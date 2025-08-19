import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if(!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    googleId?: string;
    givenName?: string;
    familyName?: string;
    error?: string;
    picture?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    user: {
      googleId?: string;
      givenName?: string;
      familyName?: string;
    } & import('next-auth').DefaultSession['user'];
  }

  interface Profile {
    sub?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    email_verified?: boolean;
  }
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type: string;
  error?: string;
  error_description?: string;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const refreshToken = token.refreshToken;

    if(!refreshToken) {
      console.error('[NextAuth] No refresh token available for token refresh');
      return {
        ...token,
        error: 'RefreshAccessTokenError',
        accessToken: undefined
      };
    }

    const params = new URLSearchParams({
      client_id: requiredEnvVars.GOOGLE_CLIENT_ID!,
      client_secret: requiredEnvVars.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    const data: GoogleTokenResponse = await response.json();

    if(!response.ok) {
      console.error('[NextAuth] Token refresh failed:', {
        status: response.status,
        error: data.error,
        description: data.error_description,
      });

      return {
        ...token,
        error: 'RefreshAccessTokenError',
        accessToken: undefined
      };
    }

    console.log('Token refreshed successfully');

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + ((data.expires_in || 3600) * 1000),
      refreshToken: data.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch(error) {
    console.error('Token refresh error:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
      accessToken: undefined
    };
  }
}

function shouldRefreshToken(token: JWT): boolean {
  const accessTokenExpires = token.accessTokenExpires;
  const refreshToken = token.refreshToken;

  if(!accessTokenExpires || !refreshToken || typeof accessTokenExpires !== 'number') {
    return false;
  }

  const refreshThreshold = 5 * 60 * 1000;
  return Date.now() > (accessTokenExpires - refreshThreshold);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: requiredEnvVars.GOOGLE_CLIENT_ID!,
      clientSecret: requiredEnvVars.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
          ].join(' '),
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code',
          include_granted_scopes: 'true',
        },
      },

      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`.trim(),
          email: profile.email,
          image: profile.picture,
          googleId: profile.sub,
          givenName: profile.given_name,
          familyName: profile.family_name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if(account?.access_token) {
        console.log('Initial sign-in, storing tokens');

        const expiresIn = typeof account.expires_in === 'number' ? account.expires_in : 3600;
        const expiresAt = typeof account.expires_at === 'number' ? account.expires_at : null;

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = expiresAt
          ? expiresAt * 1000
          : Date.now() + (expiresIn * 1000);
      }

      if(profile) {
        token.googleId = profile.sub;
        token.givenName = profile.given_name;
        token.familyName = profile.family_name;
        token.picture = profile.picture;
      }

      if(shouldRefreshToken(token)) {
        console.log('Token expired, attempting refresh');
        return await refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      if(token.accessToken) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }

      if(token.error) {
        session.error = token.error;
      }

      if(session.user && token.googleId) {
        session.user.googleId = token.googleId;
        session.user.givenName = token.givenName;
        session.user.familyName = token.familyName;
      }

      return session;
    },

    async signIn({ account, profile }) {
      if(account?.provider === 'google') {
        if(profile?.email_verified === false) {
          console.error('Sign-in rejected: Email not verified');
          return false;
        }

        return true;
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      if(url.startsWith('/')) return `${baseUrl}${url}`;
      if(new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/welcome',
  },

  events: {
    async signIn({ user, isNewUser }) {
      console.log(`Sign-in event: ${user.email} (new user: ${isNewUser})`);
    },

    async signOut({ token }) {
      console.log(`Sign-out event: ${token.email}`);
    },

    async session({ session }) {
      if(process.env.NODE_ENV === 'development') {
        console.log(`Session accessed: ${session.user?.email}`);
      }
    },
  },

  useSecureCookies: process.env.NODE_ENV === 'production',

  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
      },
    },
  },

  debug: process.env.NODE_ENV === 'development',

  logger: {
    error(code, metadata) {
      console.error(`[NextAuth Error] ${code}:`, metadata);
    },
    warn(code) {
      if(process.env.NODE_ENV === 'development') {
        console.warn(`[NextAuth Warning] ${code}`);
      }
    },
    debug(code, metadata) {
      if(process.env.NODE_ENV === 'development') {
        console.debug(`[NextAuth Debug] ${code}:`, metadata);
      }
    },
  },
};