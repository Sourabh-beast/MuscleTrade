import StockMarketHero from "@/components/Hero";
import Ticker from "@/components/StockTicker";
import { Stack, Container, Box } from "@mui/material";
import StockTicker from "@/components/Ticker";

export default function Home() {
  return (
    <Box sx={{ backgroundColor: "black", minHeight: "100vh" }}>
      <StockTicker refreshInterval={15000} />
      <StockMarketHero />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "100%",
            overflowX: "auto",

            "&::-webkit-scrollbar": {
              display: "none",
            },

            "-ms-overflow-style": "none",
            scrollbarWidth: "none",
            "& > *": {
              minWidth: "fit-content",
              flexShrink: 0,
            },
          }}
        >
          <Ticker symbol="RELIANCE.NS" refreshInterval={5000} />
          <Ticker symbol="TCS.NS" refreshInterval={5000} />
          <Ticker symbol="INFY.NS" refreshInterval={5000} />
        </Stack>
      </Container>
       

    </Box>
  );
}
