"use client";

import { useNetworkStore, useUserStore } from "@/store";
import { useNetworkSearch, useUserSearch } from "@/lib/api";
import { usePathname } from "next/navigation";
import {
  Box,
  InputAdornment,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useCallback, useState } from "react";
import { IconButton } from "@mui/material";

export default function SearchToolbar() {
  const pathname = usePathname();
  const isUserSearch = pathname === "/users";
  
  const networkStore = useNetworkStore();
  const userStore = useUserStore();
  
  const { searchParams, setSearchParams, viewMode, setViewMode } = isUserSearch 
    ? { ...userStore, viewMode: "list" as const, setViewMode: () => {} }
    : networkStore;
    
  // Call hooks unconditionally
  const userSearchResult = useUserSearch(searchParams);
  const networkSearchResult = useNetworkSearch(searchParams);
  const total = isUserSearch ? userSearchResult.total : networkSearchResult.total;
  const [searchText, setSearchText] = useState(searchParams.searchString || "");
  const handleSearch = useCallback(() => {
    setSearchParams({
      searchString: isUserSearch && !searchText.trim() ? '*' : searchText,
      start: 0, // Reset to first page on new search
      size: searchParams.size || 25,
      permission: searchParams.permission,
      includeGroups: searchParams.includeGroups,
      accountName: searchParams.accountName
    });
  }, [searchText, searchParams, setSearchParams]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          placeholder={`Search ${isUserSearch ? "users" : "networks"}...`}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ width: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch} aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {total > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
          {total} {total === 1 ? 'hit' : 'hits'}
        </Typography>
      )}
      </Box>

      {!isUserSearch && (
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
      )}
    </Paper>
  );
}
