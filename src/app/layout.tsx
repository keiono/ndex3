import type { Metadata } from "next";
import { SWRConfig } from "swr";

export const metadata: Metadata = {
  title: "NDEx Network Browser",
  description: "Browse and search NDEx networks with a Google Drive-like interface",
};

const swrConfig = {
  revalidateOnFocus: false,
  refreshInterval: 0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SWRConfig value={swrConfig}>
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
