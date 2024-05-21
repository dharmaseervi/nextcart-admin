import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./Providers";
import GlobalProvider from "@/components/GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ecommerce admin dashboard | admin dashboard",
  description: "ecommerce admin dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <GlobalProvider>
            {children}
          </GlobalProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
