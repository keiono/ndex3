"use client";

import { useNetworkStore } from "@/store";
import {
  Box,
  InputAdornment,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";

export default function SearchToolbar() {
  const { searchParams, setSearchParams, viewMode, setViewMode } = useNetworkStore();
  const [searchText, setSearchText] = useState(searchParams.searchString || "");
  const [debouncedSearch] = useDebounce(searchText, 300);

  useEffect(() => {
    setSearchParams({ searchString: debouncedSearch, start: 0 });
  }, [debouncedSearch, setSearchParams]);

  const handleViewModeChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newMode: "list" | "grid" | null) => {
      if (newMode !== null) {
        setViewMode(newMode);
      }
    },
    [setViewMode]
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <TextField
        placeholder="Search networks..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ width: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          size="small"
        >
          <ToggleButton value="list" aria-label="list view">
            <Tooltip title="List view">
              <ViewListIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid view">
            <Tooltip title="Grid view">
              <GridViewIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
}
