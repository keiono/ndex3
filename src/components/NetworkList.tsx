'use client';

import { useNetworkSearch } from '@/lib/api';
import { useNetworkStore } from '@/store';
import {
  Box,
  Card,
  Checkbox,
  CircularProgress,
  Link as MuiLink,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Select,
  MenuItem,
  Pagination,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { NetworkSummary, SearchParams } from '@/types/ndex';
import ClientDate from './ClientDate';
import { useCallback } from 'react';

function NetworkGridItem({
  network,
  selected,
  onToggle,
}: {
  network: NetworkSummary;
  selected: boolean;
  onToggle: () => void;
}) {
  const { setSelectedNetwork, selectionMode, selectedNetworkId } =
    useNetworkStore();
  const isSelected = selectionMode
    ? selected
    : selectedNetworkId === network.externalId;

  const handleClick = () => {
    if (selectionMode) {
      onToggle();
    } else {
      setSelectedNetwork(network);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        bgcolor: isSelected ? 'action.selected' : 'background.paper',
        '&:hover': {
          bgcolor: isSelected ? 'action.selected' : 'action.hover',
        },
        transition: 'background-color 0.2s',
      }}
      onClick={handleClick}
    >
      {selectionMode && (
        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Checkbox checked={selected} onClick={(e) => e.stopPropagation()} />
        </Box>
      )}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          <AccountTreeIcon color="action" />
          <Typography variant="subtitle1" noWrap>
            {network.name}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {network.description || 'No description'}
        </Typography>
      </Box>
      <Box sx={{ p: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Modified: <ClientDate date={network.modificationTime} />
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Nodes: {network.nodeCount} | Edges: {network.edgeCount}
        </Typography>
      </Box>
    </Card>
  );
}

export default function NetworkList() {
  const {
    searchParams,
    selectedNetworks,
    toggleNetworkSelection,
    viewMode,
    selectionMode,
    selectedNetworkId,
    setSelectedNetwork,
  } = useNetworkStore();
  const {
    networks = [],
    isLoading,
    error,
    total = 0,
  } = useNetworkSearch(searchParams) || {};

  // Pagination handling
  const updateSearchParams = useCallback((updates: Partial<SearchParams>) => {
    // Create a new object with all current params and add updates
    const newParams: SearchParams = {
      ...searchParams,  // Keep all existing params
      ...updates,       // Apply updates
      // Ensure searchString is preserved
      searchString: searchParams.searchString || ''
    };
    useNetworkStore.getState().setSearchParams(newParams);
  }, [searchParams]);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    const newStart = (page - 1) * (searchParams.size || 25);
    updateSearchParams({ start: newStart });
  }, [searchParams.size, updateSearchParams]);

  const handlePageSizeChange = useCallback((event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    updateSearchParams({ size: newSize, start: 0 });
  }, [updateSearchParams]);

  const currentPage = Math.floor((searchParams.start || 0) / (searchParams.size || 25)) + 1;
  const totalPages = Math.ceil(total / (searchParams.size || 25));

  const PaginationControls = () => (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <FormControl variant="outlined" size="small">
        <InputLabel>Page Size</InputLabel>
        <Select
          value={searchParams.size || 25}
          onChange={handlePageSizeChange}
          label="Page Size"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
      <Pagination 
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        showFirstButton 
        showLastButton
      />
    </Box>
  );

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

  if (viewMode === 'grid') {
    return (
      <>
        <Grid container spacing={2}>
          {networks.map((network) => (
            <Grid key={network.externalId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <NetworkGridItem
                network={network}
                selected={selectedNetworks.includes(network.externalId)}
                onToggle={() => toggleNetworkSelection(network.externalId)}
              />
            </Grid>
          ))}
        </Grid>
        <PaginationControls />
      </>
    );
  }

  // Render Table view with additional columns
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Nodes</TableCell>
              <TableCell>Edges</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Visibility</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell>Creation Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {networks.map((network) => (
              <TableRow
                key={network.externalId}
                hover
                selected={
                  !selectionMode && selectedNetworkId === network.externalId
                }
                onClick={() => {
                  if (selectionMode) {
                    toggleNetworkSelection(network.externalId);
                  } else {
                    setSelectedNetwork(network);
                  }
                }}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <MuiLink
                    component="a"
                    href={`https://www.ndexbio.org/viewer/networks/${network.externalId}`}
                    underline="hover"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        `https://www.ndexbio.org/viewer/networks/${network.externalId}`,
                        'ndexViewer',
                      );
                    }}
                  >
                    {network.name}
                  </MuiLink>
                </TableCell>
                <TableCell>
                  <Tooltip title={network.description} arrow placement="top">
                    <span>
                      {network.description && network.description.length > 200
                        ? `${network.description.substring(0, 200)}…`
                        : network.description || 'No description'}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>{network.nodeCount}</TableCell>
                <TableCell>{network.edgeCount}</TableCell>
                <TableCell>{network.owner}</TableCell>
                <TableCell>{network.visibility}</TableCell>
                <TableCell>
                  <ClientDate date={network.modificationTime} />
                </TableCell>
                <TableCell>
                  <ClientDate date={network.creationTime} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationControls />
    </>
  );
}
