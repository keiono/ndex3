"use client";

import { useState, useEffect } from "react";
import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NetworkDetails from "./NetworkDetails";
import { useNetworkSearch } from "@/lib/api";
import { useNetworkStore } from "@/store";

const DRAWER_WIDTH = 400; // Match the width in NetworkDetails

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
  },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const { selectedNetworkId } = useNetworkStore();
  const { networks = [] } = useNetworkSearch({ 
    size: 1000 // Larger size to ensure we have all networks for details
  }) || {};
  const selectedNetwork = selectedNetworkId ? networks.find(n => n.externalId === selectedNetworkId) : undefined;
  const [isOpen, setIsOpen] = useState(true);

  const handlePanelToggle = () => {
    setIsOpen(!isOpen);
  };

  // Open panel when network is selected, close when deselected
  useEffect(() => {
    setIsOpen(!!selectedNetworkId);
  }, [selectedNetworkId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        component="div"
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          minHeight: "100vh",
          position: "relative"
        }}
      >
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              NDEx Networks
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            transition: theme => theme.transitions.create('margin', {
              duration: theme.transitions.duration.standard,
            }),
            ...(selectedNetworkId && isOpen && {
              marginRight: DRAWER_WIDTH,
            }),
          }}
        >
          {children}
        </Box>
        <NetworkDetails
          network={selectedNetwork}
          open={!!selectedNetworkId && isOpen}
          onClose={handlePanelToggle}
        />
      </Box>
    </ThemeProvider>
  );
}
