"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

type ClientDateProps = {
  date: string | Date;
};

export default function ClientDate({ date }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Using suppressHydrationWarning ensures no mismatch warnings.
    return <span suppressHydrationWarning>Loading...</span>;
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return <span suppressHydrationWarning>Invalid date</span>;
  }

  return (
    <span suppressHydrationWarning>
      {format(parsedDate, "PPP")}
    </span>
  );
}
