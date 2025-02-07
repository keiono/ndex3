'use client';

import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

export default function TopPage() {
  return (
    <Box sx={{ p: 4 }} suppressHydrationWarning>
      <Typography variant="h2" gutterBottom>
        Welcome to NDEx v3
      </Typography>
      <Typography sx={{ mb: 2 }}>
        (Add links to other pages here)
      </Typography>
      <Link href="/networks" passHref>
        <MuiLink variant="body1" component="span">
          Networks
        </MuiLink>
      </Link>
    </Box>
  );
}
