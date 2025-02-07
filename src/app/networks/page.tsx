"use client";

import Layout from "@/components/Layout";
import NetworkList from "@/components/NetworkList";
import SearchToolbar from "@/components/SearchToolbar";
import { Box } from "@mui/material";

export default function HomePage() {
  return (
    <Layout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <SearchToolbar />
        <NetworkList />
      </Box>
    </Layout>
  );
}
