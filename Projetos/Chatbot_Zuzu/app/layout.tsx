import type { Metadata } from "next";
import "@mantine/core/styles.css";


import { MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "Zuzu | Assistente Virtual",
  description: "Zuzu, um chatbot interativo criado com Next.js e Mantine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}