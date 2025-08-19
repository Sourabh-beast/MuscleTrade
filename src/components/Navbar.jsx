"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {signIn} from "next-auth/react";


// Hamburger Menu Icon
const MenuIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" fill="currentColor" />
  </SvgIcon>
);

// Close Icon
const CloseIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
  </SvgIcon>
);

export default function Navbar({ navItems }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  function handleLogin() {
    signIn('google', { callbackUrl: '/' });
  }

  const items = navItems || [
    { label: "Trading", href: "/trade" },
    { label: "Education", href: "/edu" },
    { label: "Robo Advisor", href: "/robo" },
    { label: "Portfolio", href: "/holding" },
    { label: "Pricing", href: "/pricing" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileNavClick = () => {
    setMobileOpen(false);
  };

  // Mobile Drawer Content
  const drawer = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        background: "linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
        color: "white",
      }}
      role="presentation"
    >
      {/* Drawer Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid rgba(34, 197, 94, 0.15)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            sx={{
              bgcolor: "rgba(34, 197, 94, 0.1)",
              width: 40,
              height: 40,
              borderRadius: 2,
              border: "1px solid rgba(34, 197, 94, 0.3)",
            }}
            component={Link}
            href="/"
            onClick={handleMobileNavClick}
          >
            <SvgIcon sx={{ fontSize: 20, color: "#22c55e" }} viewBox="0 0 24 24">
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
          <Typography
            variant="caption"
            sx={{
              color: "rgba(34, 197, 94, 0.8)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            MuscleTrade
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: "rgba(255,255,255,0.7)" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ px: 1, pt: 2 }}>
        {items.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={handleMobileNavClick}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                '&:hover': {
                  bgcolor: "rgba(34, 197, 94, 0.1)",
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.9)",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(34, 197, 94, 0.15)", mx: 2, my: 2 }} />

      {/* Mobile Auth Buttons */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Stack spacing={2}>
          <Button
            variant="outlined"
            onClick={handleLogin}
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              fontSize: "14px",
              borderColor: "rgba(255, 255, 255, 0.25)",
              color: "rgba(255, 255, 255, 0.9)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              '&:hover': { 
                borderColor: "rgba(34, 197, 94, 0.6)",
                backgroundColor: "rgba(34, 197, 94, 0.08)",
                color: "#22c55e",
              },
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            onClick={handleLogin}
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              fontSize: "14px",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#000000",
              boxShadow: "0 4px 14px rgba(34, 197, 94, 0.4)",
              '&:hover': { 
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                boxShadow: "0 6px 20px rgba(34, 197, 94, 0.5)",
              },
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Box>

    
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
          color: "white",
          py: 0,
          borderBottom: "1px solid rgba(34, 197, 94, 0.15)",
          backdropFilter: "blur(20px)",
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
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
            minHeight: { xs: "60px", md: "72px" },
          }}
        >
          {/* Left: Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 1.5 } }}>
            <IconButton
              edge="start"
              aria-label="TradeModules"
              sx={{
                bgcolor: "rgba(34, 197, 94, 0.1)",
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
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
              <SvgIcon sx={{ fontSize: { xs: 20, md: 24 }, color: "#22c55e" }} viewBox="0 0 24 24">
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

            <Box sx={{ display: { xs: isMobile ? "none" : "block", sm: "block" } }}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(34, 197, 94, 0.8)",
                  fontSize: { xs: "10px", md: "11px" },
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

          {/* Center: Navigation Links (Desktop/Tablet) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: { md: 0.5, lg: 0.5 },
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              maxWidth: { md: 500, lg: 600 },
            }}
          >
            {items.map((item) => (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                disableRipple
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  textTransform: "none",
                  fontSize: { md: "13px", lg: "14px" },
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  minWidth: 0,
                  px: { md: 1.5, lg: 2.5 },
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

          {/* Right: Auth Buttons (Desktop) & Mobile Menu Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Desktop Auth Buttons */}
            <Stack 
              direction="row" 
              spacing={1.5} 
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: { md: 2, lg: 3 },
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: { md: "13px", lg: "14px" },
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
                onClick={handleLogin}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: { md: 2, lg: 3 },
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: { md: "13px", lg: "14px" },
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
                {isTablet ? "Start" : "Get Started"}
              </Button>
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "rgba(255,255,255,0.9)",
                '&:hover': {
                  bgcolor: "rgba(34, 197, 94, 0.1)",
                  color: "#22c55e",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>

  
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}