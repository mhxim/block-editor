"use client";

import "./globals.scss";
import type { Metadata } from "next";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { Inter } from 'next/font/google'
import { store } from "@/store";
import Head from "next/head";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <Head>
        <title>Block Editor</title>
      </Head>
      <body className={`antialiaased ${inter.className}`}>
        <Provider store={store}>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </Provider>
      </body>
    </html>
  );
}
