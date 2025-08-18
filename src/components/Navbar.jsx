"use client";

import React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";

export default function Navbar({ navItems }) {
  const items =
    navItems ||
    [
      { label: "Trading", href: "/trade" },
      { label: "Education", href: "/edu" },
      { label: "Robo Advisor", href: "/robo" },
      { label: "Portfolio", href: "/holding" },
      { label: "Pricing", href: "/pricing" },
    ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
        color: "white",
        py: 0,
        borderBottom: "1px solid rgba(34, 197, 94, 0.15)",
        backdropFilter: "blur(20px)",
        px:6
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          minHeight: "72px !important",
        }}
      >
        {/* Left: Brand and Contact */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              edge="start"
              aria-label="TradeModules"
              sx={{
                bgcolor: "rgba(34, 197, 94, 0.1)",
                width: 48,
                height: 48,
                borderRadius: 2,
                border: "1px solid rgba(34, 197, 94, 0.3)",
                '&:hover': {
                  bgcolor: "rgba(34, 197, 94, 0.2)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)",
                  borderColor: "rgba(34, 197, 94, 0.5)",
                },
                transition: "all 0.3s ease",
              }}
              component={Link}
              href="/"
            >
              <SvgIcon sx={{ fontSize: 24, color: "#22c55e" }} viewBox="0 0 24 24">
                {/* Professional financial chart icon */}
                <path 
                  d="M3 3v18h18" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M7 16l3-3 2 2 5-5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <rect x="13" y="6" width="2" height="4" fill="currentColor" rx="0.5" />
                <rect x="16" y="4" width="2" height="6" fill="currentColor" rx="0.5" />
                <rect x="19" y="8" width="2" height="2" fill="currentColor" rx="0.5" />
              </SvgIcon>
            </IconButton>

            <Box>
              
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(34, 197, 94, 0.8)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                MuscleTrade
              </Typography>
            </Box>
          </Box>

       
        </Box>

        {/* Center: Navigation Links */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 0.5,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            maxWidth: 600,
          }}
        >
          {items.map((item, index) => (
            <Button
              key={item.label}
              component={Link}
              href={item.href}
              disableRipple
              sx={{
                color: "rgba(255,255,255,0.85)",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.3px",
                minWidth: 0,
                px: 2.5,
                py: 1.5,
                borderRadius: 2,
                position: "relative",
                '&:hover': {
                  color: "#ffffff",
                  bgcolor: "rgba(34, 197, 94, 0.08)",
                  transform: "translateY(-1px)",
                },
                '&:after': {
                  content: '""',
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  width: 0,
                  height: 2,
                  bgcolor: "#22c55e",
                  borderRadius: 1,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: "translateX(-50%)",
                },
                '&:hover:after': {
                  width: "70%",
                },
                transition: "all 0.2s ease",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right: Authentication Buttons */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            component={Link}
            href="/auth/login"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 600,
              fontSize: "14px",
              borderColor: "rgba(255, 255, 255, 0.25)",
              color: "rgba(255, 255, 255, 0.9)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              '&:hover': { 
                borderColor: "rgba(34, 197, 94, 0.6)",
                backgroundColor: "rgba(34, 197, 94, 0.08)",
                color: "#22c55e",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Login
          </Button>

          <Button
            variant="contained"
            component={Link}
            href="/auth/signup"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 600,
              fontSize: "14px",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#000000",
              boxShadow: "0 4px 14px rgba(34, 197, 94, 0.4)",
              border: "1px solid rgba(34, 197, 94, 0.5)",
              '&:hover': { 
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                boxShadow: "0 6px 20px rgba(34, 197, 94, 0.5)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Box>

      {/* Market Status Indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 24,
          display: { xs: "none", xl: "flex" },
          alignItems: "center",
          gap: 1,
          fontSize: "11px",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            animation: "pulse 2s infinite",
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 },
            },
          }}
        />
        <Typography variant="caption" sx={{ fontSize: "11px", fontWeight: 500 }}>
          Markets Open
        </Typography>
      </Box>
    </AppBar>
  );
}