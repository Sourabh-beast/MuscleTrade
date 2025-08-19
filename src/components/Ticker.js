"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

const StockTicker =({ refreshInterval = 15000, pxPerSecond = 120 }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  // Stock symbols
  const stockSymbols = [
    "RELIANCE.NS",
    "TCS.NS",
    "HDFCBANK.NS",
    "INFY.NS",
    "ITC.NS",
    "BHARTIARTL.NS",
    "ICICIBANK.NS",
    "SBIN.NS",
    "LT.NS",
    "KOTAKBANK.NS",
    "MARUTI.NS",
    "HINDUNILVR.NS",
  ];

  // Fetch stock data
  const fetchStockData = async (symbol) => {
    try {
      const response = await fetch(
        `/api/yahoo?symbol=${encodeURIComponent(symbol)}`
      );
      const data = await response.json();

      console.log(`Data for ${symbol}:`, data); // Debug log

      // Handle different response formats
      let stockInfo;
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // If data is array, get last item
        stockInfo = data.data[data.data.length - 1];
      } else if (data.data && typeof data.data === "object") {
        // If data is object
        stockInfo = data.data;
      } else {
        // Direct data
        stockInfo = data;
      }

      return {
        symbol: symbol,
        displaySymbol: symbol.replace(".NS", "").replace(".BO", ""),
        price:
          stockInfo.regularMarketPrice ||
          stockInfo.price ||
          stockInfo.close ||
          Math.random() * 1000 + 100, // Fallback for testing
        change:
          stockInfo.regularMarketChange ||
          stockInfo.change ||
          (Math.random() - 0.5) * 20,
        changePercent:
          stockInfo.regularMarketChangePercent ||
          stockInfo.changePercent ||
          (Math.random() - 0.5) * 5,
      };
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
      // Return mock data for testing when API fails
      return {
        symbol: symbol,
        displaySymbol: symbol.replace(".NS", ""),
        price: Math.random() * 1000 + 100,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 5,
      };
    }
  };

  // Load all stocks
  const loadStocks = async () => {
    try {
      const stockPromises = stockSymbols.map(fetchStockData);
      const results = await Promise.all(stockPromises);

      console.log("All stocks loaded:", results); // Debug log

      if (mounted.current) {
        setStocks(results);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading stocks:", error);
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    loadStocks();

    const interval = setInterval(loadStocks, refreshInterval);

    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [refreshInterval]);
  const tickerRef = useRef(null);
const [duration, setDuration] = useState(60);

  // compute animation duration based on content width for consistent speed
useEffect(() => {
  if (!tickerRef.current) return;
  // tickerRef holds the moving element which contains TWO copies of the content.
  requestAnimationFrame(() => {
    const el = tickerRef.current;
    const totalScrollWidth = el.scrollWidth || 0;
    const singleWidth = totalScrollWidth / 2 || 0;
    // speed in px/sec controlled by pxPerSecond prop
    const secs = Math.max(10, Math.round(singleWidth / pxPerSecond)); // minimum 10s
    setDuration(secs);
  });
}, [stocks, pxPerSecond]);


  // Format price
  const formatPrice = (price) => {
    return typeof price === "number" ? price.toFixed(2) : "0.00";
  };

  // Get change color
  const getChangeColor = (change) => {
    return change >= 0 ? "#00D084" : "#FF4757";
  };

  // Format change
  const formatChange = (change, changePercent) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0D1421",
          borderBottom: "1px solid #1E2D3D",
          color: "#8B949E",
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "14px" }}>
          Loading market data...
        </Typography>
      </Box>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <Box
        sx={{
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0D1421",
          borderBottom: "1px solid #1E2D3D",
          color: "#FF4757",
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "14px" }}>
          No market data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 50,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)",
        borderBottom: "1px solid #1E2D3D",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Scrolling content */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          whiteSpace: "nowrap",
          animation: `tickerScroll ${duration}s linear infinite`,
    "@keyframes tickerScroll": {
      "0%": { transform: "translateX(0%)" },
      "100%": { transform: "translateX(-50%)" }, // animate only half because content is duplicated
    },
  }}
         
      >
        {/* First set */}
        {stocks.map((stock, index) => (
          <Box
            key={`first-${index}`}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: "fit-content",
            }}
          >
            {/* Symbol */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "14px",
                color: "#E6EDF3",
                minWidth: "fit-content",
              }}
            >
              {stock.displaySymbol}
            </Typography>

            {/* Price */}
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#E6EDF3",
                minWidth: "fit-content",
              }}
            >
              ₹{formatPrice(stock.price)}
            </Typography>

            {/* Change */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: getChangeColor(stock.change),
                  minWidth: "fit-content",
                }}
              >
                {formatChange(stock.change, stock.changePercent)}
              </Typography>
              {stock.change >= 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: "#00D084" }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: "#FF4757" }} />
              )}
            </Box>

            {/* Separator */}
            <Box
              sx={{
                height: "4px",

                mx: 1,
              }}
            />
          </Box>
        ))}

        {/* Second set for seamless loop */}
        <Box sx={{ display: "inline-flex", alignItems: "center" }} aria-hidden="true">
        {stocks.map((stock, index) => (
          <Box
            key={`second-${index}`}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: "fit-content",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "14px",
                color: "#E6EDF3",
                minWidth: "fit-content",
              }}
            >
              {stock.displaySymbol}
            </Typography>

            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#E6EDF3",
                minWidth: "fit-content",
              }}
            >
              ₹{formatPrice(stock.price)}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: getChangeColor(stock.change),
                  minWidth: "fit-content",
                }}
              >
                {formatChange(stock.change, stock.changePercent)}
              </Typography>
              {stock.change >= 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: "#00D084" }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: "#FF4757" }} />
              )}
            </Box>

            <Box
              sx={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#30363D",
                mx: 1,
              }}
            />
          </Box>
        ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StockTicker;
