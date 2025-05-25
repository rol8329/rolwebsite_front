// src/app/layout.tsx

import { ReactQueryProvider } from "@/services/providers/query-provider";
import './globals.css'; // Adjust path if needed


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}