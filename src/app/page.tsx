'use client';

import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

export default function TopPage() {
  return (
    <Box sx={{ p: 4 }} suppressHydrationWarning>
      <Typography variant="h2" gutterBottom>
        Welcome to NDEx v3
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
        <Link href="/networks" passHref>
          <MuiLink variant="body1" component="span">
            Networks
          </MuiLink>
        </Link>
        <Link href="/users" passHref>
          <MuiLink variant="body1" component="span">
            Users
          </MuiLink>
        </Link>
      </Box>
    </Box>
  );
}
