'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

type ClientDateProps = {
  date: number | Date;
};

export default function ClientDate({ date }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span suppressHydrationWarning>Loading...</span>;
  }

  let parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    // If the date appears to be a Unix timestamp in seconds, convert it to milliseconds.
    const timestamp = Number(date);
    if (!isNaN(timestamp)) {
      parsedDate = new Date(timestamp * 1000);
    }
  }

  if (isNaN(parsedDate.getTime())) {
    return <span suppressHydrationWarning>Invalid date</span>;
  }

  return <span suppressHydrationWarning>{format(parsedDate, 'PPP')}</span>;
}
