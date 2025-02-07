import type { Metadata } from "next";
import { SWRConfig } from "swr";

export const metadata: Metadata = {
  title: "NDEx v3",
  description: "Next generation NDEx web client",
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
