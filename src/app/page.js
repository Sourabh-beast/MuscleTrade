
import Hero from "@/components/Hero";
import PriceCard from "@/components/PriceCard";
import { Stack, Container, Box } from "@mui/material";
import StockTicker from "@/components/Ticker";

export default function Home() {
  return (
    <Box sx={{ backgroundColor: "black", minHeight: "100vh" }}>
      <StockTicker refreshInterval={15000} />
      <Hero />

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
          <PriceCard symbol="RELIANCE.NS" refreshInterval={5000} />
          <PriceCard symbol="TCS.NS" refreshInterval={5000} />
          <PriceCard symbol="INFY.NS" refreshInterval={5000} />
        </Stack>
      </Container>
       

    </Box>
  );
}
