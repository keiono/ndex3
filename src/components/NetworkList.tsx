"use client";

import { useNetworkSearch } from "@/lib/api";
import { useNetworkStore } from "@/store";
import {
  Box,
  Card,
  Checkbox,
  CircularProgress,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { NetworkSummary } from "@/types/ndex";
import ClientDate from "./ClientDate";
import DOMPurify from "dompurify";

function NetworkGridItem({ network, selected, onToggle }: { 
  network: NetworkSummary;
  selected: boolean;
  onToggle: () => void;
}) {
  const { setSelectedNetworkId, selectionMode, selectedNetworkId } = useNetworkStore();
  const isSelected = selectionMode ? selected : selectedNetworkId === network.externalId;

  const handleClick = () => {
    if (selectionMode) {
      onToggle();
    } else {
      setSelectedNetworkId(network.externalId);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        bgcolor: isSelected ? "action.selected" : "background.paper",
        "&:hover": {
          bgcolor: isSelected ? "action.selected" : "action.hover",
        },
        transition: "background-color 0.2s",
      }}
      onClick={handleClick}
    >
      {selectionMode && (
        <Box sx={{ position: "absolute", right: 8, top: 8 }}>
          <Checkbox checked={selected} onClick={(e) => e.stopPropagation()} />
        </Box>
      )}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
          <AccountTreeIcon color="action" />
          <Typography variant="subtitle1" noWrap>{network.name}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {network.description || "No description"}
        </Typography>
      </Box>
      <Box sx={{ p: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Modified: <ClientDate date={network.modified} />
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Nodes: {network.nodeCount} | Edges: {network.edgeCount}
        </Typography>
      </Box>
    </Card>
  );
}

export default function NetworkList() {
  const { searchParams, selectedNetworks, toggleNetworkSelection, viewMode, selectionMode, selectedNetworkId, setSelectedNetworkId } = useNetworkStore();
  const { networks = [], isLoading, error } = useNetworkSearch(searchParams) || {};

  // Show loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error loading networks: {error.message}
      </Typography>
    );
  }

  if (!networks?.length) {
    return (
      <Typography align="center" color="text.secondary">
        No networks found
      </Typography>
    );
  }

  if (viewMode === "grid") {
    return (
      <Grid container spacing={2}>
        {networks.map((network) => (
          <Grid item key={network.externalId} xs={12} sm={6} md={4} lg={3}>
            <NetworkGridItem
              network={network}
              selected={selectedNetworks.includes(network.externalId)}
              onToggle={() => toggleNetworkSelection(network.externalId)}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Render Table view instead of a list.
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Modified</TableCell>
            <TableCell>Nodes</TableCell>
            <TableCell>Edges</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {networks.map((network) => (
            <TableRow 
              key={network.externalId}
              hover
              selected={!selectionMode && selectedNetworkId === network.externalId}
              onClick={() => {
                if (selectionMode) {
                  toggleNetworkSelection(network.externalId);
                } else {
                  setSelectedNetworkId(network.externalId);
                }
              }}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{network.name}</TableCell>
              <TableCell>
                <span 
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(network.description || "No description")
                  }}
                />
              </TableCell>
              <TableCell>
                <ClientDate date={network.modified} />
              </TableCell>
              <TableCell>{network.nodeCount}</TableCell>
              <TableCell>{network.edgeCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
