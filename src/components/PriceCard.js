'use client';

import React, { useEffect, useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
// Professional dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#10b981' },
    background: {
      paper: 'rgba(17, 24, 39, 0.95)',
      default: '#0f172a',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    success: { main: '#22c55e' },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
  },
  typography: {
    fontFamily: '"SF Pro Display", "Inter", "Segoe UI", system-ui, sans-serif',
    fontWeightBold: 600,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default function PriceCard({ symbol = 'RELIANCE.NS', refreshInterval = 5000 }) {
  const theme = darkTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [candles, setCandles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceAnimation, setPriceAnimation] = useState('');
  const [lastPrice, setLastPrice] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function fetchOnce() {
      if (!loading) setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/yahoo?symbol=${encodeURIComponent(symbol)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.error) throw new Error(json.error || 'Unknown');
        const data = json.data || [];
        
        if (mounted.current) {
          const newPrice = data.length ? data[data.length - 1].close : null;
          
          // Animate price changes
          if (lastPrice !== null && newPrice !== null && newPrice !== lastPrice) {
            setPriceAnimation(newPrice > lastPrice ? 'flash-green' : 'flash-red');
            setTimeout(() => setPriceAnimation(''), 1000);
          }
          
          setLastPrice(newPrice);
          setCandles(data);
        }
      } catch (err) {
        if (mounted.current) setError(err.message || String(err));
      } finally {
        if (mounted.current) setLoading(false);
      }
    }

    fetchOnce();
    const id = setInterval(fetchOnce, refreshInterval);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [symbol, refreshInterval, lastPrice]);

  const latest = candles && candles.length ? candles[candles.length - 1] : null;
  const prev = candles && candles.length > 1 ? candles[candles.length - 2] : null;
  const price = latest ? latest.close : null;
  const change = price !== null && prev ? price - prev.close : null;
  const pct = change !== null && prev ? (change / prev.close) * 100 : null;

  const closes = candles ? candles.slice(-30).map((c) => c.close) : [];
  const volumes = candles ? candles.slice(-30).map((c) => c.volume || Math.random() * 1000000) : [];

  // Calculate volatility and trend
  const volatility = closes.length > 1 ? 
    Math.sqrt(closes.reduce((acc, close, i) => {
      if (i === 0) return 0;
      const ret = (close - closes[i-1]) / closes[i-1];
      return acc + ret * ret;
    }, 0) / (closes.length - 1)) * 100 : 0;

  const trend = closes.length > 5 ? 
    (closes[closes.length - 1] - closes[closes.length - 6]) / closes[closes.length - 6] * 100 : 0;

  function sparklinePath(values, w = 180, h = 45) {
    if (!values || values.length === 0) return '';
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    return values
      .map((v, i) => {
        const x = (i / (values.length - 1 || 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');
  }

  function volumePath(values, w = 180, h = 20) {
    if (!values || values.length === 0) return '';
    const max = Math.max(...values);
    const barWidth = w / values.length;
    return values
      .map((v, i) => {
        const x = i * barWidth;
        const height = (v / max) * h;
        return `M ${x} ${h} L ${x} ${h - height} L ${x + barWidth - 1} ${h - height} L ${x + barWidth - 1} ${h} Z`;
      })
      .join(' ');
  }

  const up = change !== null && change >= 0;
  const chartColor = closes.length && (closes[closes.length - 1] >= (closes[0] ?? 0)) ? '#22c55e' : '#ef4444';
  const symbolParts = symbol.split('.');
  const mainSymbol = symbolParts[0];
  const exchange = symbolParts[1] || '';

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper 
        elevation={0}
        sx={{ 
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'stretch', 
          gap: 0, 
          borderRadius: 2,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 80%, rgba(30, 41, 59, 0.95) 100%)',
          border: '1px solid rgba(71, 85, 105, 0.2)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          minHeight: isMobile ? 'auto' : 80,
          width: isMobile ? '90%' : 'auto',
          maxWidth: isMobile ? '100%' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(34, 197, 94, 0.4)',
            boxShadow: '0 20px 40px -12px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            transform: isMobile ? 'none' : 'translateY(-2px)',
            '& .chart-container': {
              '& path': {
                filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))',
              }
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          },
          '@keyframes flash-green': {
            '0%, 100%': { backgroundColor: 'rgba(15, 23, 42, 0.98)' },
            '50%': { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
          },
          '@keyframes flash-red': {
            '0%, 100%': { backgroundColor: 'rgba(15, 23, 42, 0.98)' },
            '50%': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
          },
          ...(priceAnimation && {
            animation: `${priceAnimation} 1s ease-out`,
          })
        }}
      >
        {/* Left accent bar - horizontal on mobile */}
        <Box
          sx={{
            width: isMobile ? '100%' : 4,
            height: isMobile ? 4 : 'auto',
            background: up ? 
              'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)' : 
              'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Mobile Layout */}
        {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* Top row: Symbol and Price */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(71, 85, 105, 0.1)'
            }}>
              {/* Symbol */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SignalCellularAltIcon sx={{ fontSize: {xs:12,md:16}, color: 'primary.main', opacity: 0.8 }} />
                <Typography variant="h6" sx={{ fontWeight: {xs:400,md:700}, color: 'text.primary', fontSize: {xs:'0.8rem',md:'1rem'} }}>
                  {mainSymbol}
                </Typography>
                {exchange && (
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary',
                    backgroundColor: 'rgba(71, 85, 105, 0.3)',
                    px: 0.5,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    textTransform: 'uppercase'
                  }}>
                    {exchange}
                  </Typography>
                )}
              </Box>

              {/* Price and Change */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: {xs:'0.8rem',md:'1.1rem'},
                  fontVariantNumeric: 'tabular-nums',
                  ...(priceAnimation && {
                    color: priceAnimation === 'flash-green' ? '#22c55e' : '#ef4444',
                  })
                }}>
                  {loading ? '—' : price !== null ? `₹${price.toFixed(2)}` : '—'}
                </Typography>
                {change !== null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                    {up ? (
                      <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 14, color: 'error.main' }} />
                    )}
                    <Typography variant="caption" sx={{ 
                      color: up ? 'success.main' : 'error.main',
                      fontWeight: 600,
                      fontSize: {xs:'0.5rem',md:'0.75rem'}
                    }}>
                      {up ? '+' : ''}{change.toFixed(2)} ({pct >= 0 ? '+' : ''}{pct.toFixed(2)}%)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Bottom row: Chart and Metrics */}
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5 }}>
              {/* Chart */}
              <Box sx={{ flex: 1, mr: 2 }}>
                <svg width="140" height="40" viewBox="0 0 140 40">
                  <defs>
                    <linearGradient id={`gradient-${symbol.replace(/\./g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={chartColor} stopOpacity="0.4"/>
                      <stop offset="70%" stopColor={chartColor} stopOpacity="0.1"/>
                      <stop offset="100%" stopColor={chartColor} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {closes.length > 0 && (
                    <path 
                      d={`${sparklinePath(closes, 140, 35)} L 140 35 L 0 35 Z`}
                      fill={`url(#gradient-${symbol.replace(/\./g, '-')})`}
                    />
                  )}
                  
                  <path 
                    d={sparklinePath(closes, 140, 35)} 
                    fill="none" 
                    strokeWidth={2} 
                    stroke={chartColor}
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  
                  {closes.length > 0 && (
                    <circle
                      cx={140}
                      cy={35 - ((closes[closes.length - 1] - Math.min(...closes)) / (Math.max(...closes) - Math.min(...closes) || 1)) * 35}
                      r="3"
                      fill={chartColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </Box>

              {/* Metrics */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {!isMobile &&  (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block' }}>
                      VOLATILITY
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: volatility > 2 ? 'warning.main' : 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  }}>
                    {volatility.toFixed(2)}%
                  </Typography>
                </Box>
              )}

                {!isMobile&&(<Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block' }}>
                    TREND
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  }}>
                    {trend > 0 ? '+' : ''}{trend.toFixed(2)}%
                  </Typography>
                </Box>)}

                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: error ? 'error.main' : 'success.main',
                    mx: 'auto',
                    mb: 0.5
                  }} />
                  <Typography variant="caption" sx={{ 
                    color: error ? 'error.main' : 'success.main',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase'
                  }}>
                    {error ? 'Offline' : 'Live'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          /* Desktop Layout */
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row',
            width: '100%',
            alignItems: 'stretch'
          }}>
            {/* Symbol Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              px: 2,
              py: 2,
              minWidth: 140,
              borderRight: '1px solid rgba(71, 85, 105, 0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <SignalCellularAltIcon sx={{ fontSize: 16, color: 'primary.main', opacity: 0.8 }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  fontSize: '1.1rem',
                  letterSpacing: '0.025em'
                }}>
                  {mainSymbol}
                </Typography>
                {exchange && (
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary',
                    backgroundColor: 'rgba(71, 85, 105, 0.3)',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    textTransform: 'uppercase'
                  }}>
                    {exchange}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                {latest?.datetime ? new Date(latest.datetime).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                }) : 'No data'}
              </Typography>
            </Box>

            {/* Price Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              px: 1,
              py: 2,
              mr: 2,
              borderRight: '1px solid rgba(71, 85, 105, 0.1)'
            }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '1.5rem',
                mb: 0.5,
                fontVariantNumeric: 'tabular-nums',
                transition: 'all 0.3s ease',
                ...(priceAnimation && {
                  color: priceAnimation === 'flash-green' ? '#22c55e' : '#ef4444',
                })
              }}>
                {loading ? (
                  <Box component="span" sx={{ 
                    display: 'inline-block', 
                    width: 80, 
                    height: 28, 
                    backgroundColor: 'rgba(71, 85, 105, 0.2)',
                    borderRadius: 1,
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }} />
                ) : price !== null ? (
                  `₹${price.toFixed(2)}`
                ) : '—'}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {change !== null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {up ? (
                      <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    )}
                    
                    <Typography variant="body2" sx={{ 
                      color: up ? 'success.main' : 'error.main',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      {up ? '+' : ''}{change.toFixed(2)}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ 
                      color: up ? 'success.main' : 'error.main',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      opacity: 0.9
                    }}>
                      ({pct >= 0 ? '+' : ''}{pct.toFixed(2)}%)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            {/* Chart Section */}
            <Box className="chart-container" sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              px: 0,
              py: 2,
              mr: 1,
              borderRight: '1px solid rgba(71, 85, 105, 0.1)'
            }}>
              <Box sx={{ position: 'relative', height: 50, mb: 1 }}>
                <svg width="180" height="50" viewBox="0 0 180 50" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id={`gradient-${symbol.replace(/\./g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={chartColor} stopOpacity="0.4"/>
                      <stop offset="70%" stopColor={chartColor} stopOpacity="0.1"/>
                      <stop offset="100%" stopColor={chartColor} stopOpacity="0"/>
                    </linearGradient>
                    <filter id={`shadow-${symbol.replace(/\./g, '-')}`}>
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={chartColor} floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  
                  {/* Price area fill */}
                  {closes.length > 0 && (
                    <path 
                      d={`${sparklinePath(closes, 180, 45)} L 180 45 L 0 45 Z`}
                      fill={`url(#gradient-${symbol.replace(/\./g, '-')})`}
                    />
                  )}
                  
                  {/* Price line */}
                  <path 
                    d={sparklinePath(closes, 180, 45)} 
                    fill="none" 
                    strokeWidth={2.5} 
                    stroke={chartColor}
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  
                  {/* Data points */}
                  {closes.map((close, i) => {
                    if (i % 3 !== 0) return null;
                    const max = Math.max(...closes);
                    const min = Math.min(...closes);
                    const range = max - min || 1;
                    const x = (i / (closes.length - 1 || 1)) * 180;
                    const y = 45 - ((close - min) / range) * 45;
                    
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="2"
                        fill={chartColor}
                        opacity="0.7"
                      />
                    );
                  })}
                  
                  {/* Current price indicator */}
                  {closes.length > 0 && (
                    <circle
                      cx={180}
                      cy={45 - ((closes[closes.length - 1] - Math.min(...closes)) / (Math.max(...closes) - Math.min(...closes) || 1)) * 45}
                      r="4"
                      fill={chartColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                      filter={`url(#shadow-${symbol.replace(/\./g, '-')})`}
                    />
                  )}
                </svg>
              </Box>

              {/* Volume bars */}
              <Box sx={{ height: 12, opacity: 0.6 }}>
                <svg width="180" height="12" viewBox="0 0 180 12">
                  <path 
                    d={volumePath(volumes, 180, 12)}
                    fill="rgba(148, 163, 184, 0.4)"
                  />
                </svg>
              </Box>
            </Box>

            {/* Metrics Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              px: 1.5,
              py: 2,
              mr: 4,
              borderRight: '1px solid rgba(71, 85, 105, 0.1)'
            }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  VOLATILITY
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: volatility > 2 ? 'warning.main' : 'text.primary',
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {volatility.toFixed(2)}%
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  TREND (5D)
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.primary',
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {trend > 0 ? '+' : ''}{trend.toFixed(2)}%
                </Typography>
              </Box>
            </Box>

            {/* Status Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              py: 2,
              mr: 3
            }}>
              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <LinearProgress 
                    sx={{ 
                      width: 50, 
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: 'rgba(71, 85, 105, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'primary.main',
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    Updating
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: error ? 'error.main' : 'success.main',
                      position: 'relative',
                      '&::before': error ? {} : {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        borderRadius: '50%',
                        backgroundColor: 'success.main',
                        opacity: 0.3,
                        animation: 'ping 2s infinite'
                      },
                      '@keyframes ping': {
                        '0%': { transform: 'scale(1)', opacity: 0.3 },
                        '75%, 100%': { transform: 'scale(2)', opacity: 0 }
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ 
                    color: error ? 'error.main' : 'success.main',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {error ? 'Offline' : 'Live'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </ThemeProvider>
  );
}