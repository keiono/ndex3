'use client';

import { useUserSearch } from '@/lib/api';
import { useUserStore } from '@/store';
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import { SearchParams, User } from '@/types/ndex';
import ClientDate from './ClientDate';
import { useCallback } from 'react';

export default function UserList() {
  const { searchParams, setSelectedUser } = useUserStore();
  const {
    users = [],
    isLoading,
    error,
    total = 0,
  } = useUserSearch(searchParams);

  // Pagination handling
  const updateSearchParams = useCallback((updates: Partial<SearchParams>) => {
    const newParams: SearchParams = {
      ...searchParams,
      ...updates,
      searchString: searchParams.searchString || ''
    };
    useUserStore.getState().setSearchParams(newParams);
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
        Error loading users: {error.message}
      </Typography>
    );
  }

  if (!users?.length) {
    return (
      <Typography align="center" color="text.secondary">
        No users found
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Modified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <TableRow
                key={user.userName}
                hover
                onClick={() => setSelectedUser(user)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  {`${user.firstName} ${user.lastName}`}
                </TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {user.isVerified && (
                      <Tooltip title="Verified">
                        <Typography component="span" color="primary">✓</Typography>
                      </Tooltip>
                    )}
                    {user.isDeleted && (
                      <Tooltip title="Deleted">
                        <Typography component="span" color="error">⦻</Typography>
                      </Tooltip>
                    )}
                    {!user.isVerified && !user.isDeleted && (
                      <Typography component="span" color="text.secondary">-</Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {user.isIndividual ? "Individual" : "Organization"}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {user.externalId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <ClientDate date={user.creationTime} />
                </TableCell>
                <TableCell>
                  <ClientDate date={user.modificationTime} />
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
