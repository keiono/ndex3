"use client";

import Layout from "@/components/Layout";
import UserList from "@/components/UserList";
import SearchToolbar from "@/components/SearchToolbar";
import { Box } from "@mui/material";

export default function UsersPage() {
  return (
    <Layout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <SearchToolbar />
        <UserList />
      </Box>
    </Layout>
  );
}
