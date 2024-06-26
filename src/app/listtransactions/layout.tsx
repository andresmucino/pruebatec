"use client";

import { Providers } from "@/common";
import { ToastsProvider } from "@/hooks";
import { AuthProvider } from "@/hooks/login";

export default function ListTransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <Providers>
        <ToastsProvider>
          <main>{children}</main>
        </ToastsProvider>
      </Providers>
  );
}
