'use client'
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    useTheme,
    alpha,
    Chip,
} from '@mui/material';
import Image from 'next/image';

const TradingPlatformHero = () => {
    const theme = useTheme();
    const [animatedElements, setAnimatedElements] = useState([]);

    useEffect(() => {
        // Create floating animated elements
        const elements = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 4,
        }));
        setAnimatedElements(elements);
    }, []);

    const FloatingElement = ({ element, children }) => (
        <Box
            sx={{
                position: 'absolute',
                left: `${element.x}%`,
                top: `${element.y}%`,
                animation: `float ${element.duration}s ease-in-out infinite`,
                animationDelay: `${element.delay}s`,
                zIndex: 2,
                '@keyframes float': {
                    '0%, 100%': {
                        transform: 'translate(0, 0) rotate(0deg)',
                    },
                    '33%': {
                        transform: 'translate(30px, -30px) rotate(120deg)',
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) rotate(240deg)',
                    },
                },
            }}
        >
            {children}
        </Box>
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: '#000000',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                px:6
            }}
        >


            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3 }}>
                <Grid container spacing={6} alignItems="center" sx={{ minHeight: '100vh' }}>
                    {/* Left Content */}
                    <Grid item xs={12} lg={6}>
                        <Box sx={{ pr: { lg: 4 } }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: alpha('#ffffff', 0.9),
                                    fontWeight: 400,
                                    mb: 2,
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                }}
                            >
                                Copy Trade Smarter with
                            </Typography>

                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '3rem', md: '4rem', lg: '5rem' },
                                    fontWeight: 800,
                                    lineHeight: 1,
                                    mb: 4,
                                    background: 'linear-gradient(45deg, #00ff00, #00cc00)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textTransform: 'uppercase',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Muscle Trade
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: alpha('#ffffff', 0.8),
                                    mb: 4,
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    maxWidth: '500px',
                                }}
                            >
                                Join a professional copy trading ecosystem where you can follow top traders, customize your trading screen, and enjoy a seamless experience with powerful tools and multiple “skins”.
Build confidence, trade smarter, and grow faster — all in one platform.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 3, mb: 6 }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: '#00ff00',
                                        color: '#00ff00',
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 1,
                                        textTransform: 'uppercase',
                                        fontSize: '0.9rem',
                                        letterSpacing: '0.5px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: '#00ff00',
                                            backgroundColor: alpha('#00ff00', 0.1),
                                            transform: 'translateY(-2px)',
                                        }
                                    }}
                                >
                                    Start Trading Now
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: alpha('#ffffff', 0.3),
                                        color: alpha('#ffffff', 0.8),
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 1,
                                        textTransform: 'uppercase',
                                        fontSize: '0.9rem',
                                        letterSpacing: '0.5px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: '#00ff00',
                                            color: '#00ff00',
                                            backgroundColor: alpha('#00ff00', 0.05),
                                        }
                                    }}
                                >
                                    Join
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Content - Trading Dashboard */}
                    <Grid item xs={12} lg={6}>
                        <Box sx={{ position: 'relative' }}>
                            {/* Main Trading Dashboard */}
                            <Image
                                src="/images/hero.webp"
                                alt="Trading Dashboard"
                                width={580}
                                height={400}
                                objectFit="cover"
                                priority
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Background Glow Effects */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '10%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 255, 0, 0.1), transparent)',
                    filter: 'blur(40px)',
                    animation: 'pulse 4s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
                        '50%': { opacity: 0.8, transform: 'scale(1.1)' },
                    }
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '5%',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 255, 0, 0.08), transparent)',
                    filter: 'blur(30px)',
                    animation: 'pulse 6s ease-in-out infinite reverse',
                }}
            />
        </Box>
    );
};

export default TradingPlatformHero;