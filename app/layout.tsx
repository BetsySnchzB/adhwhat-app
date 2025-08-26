import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Viewport } from "next";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";
import { UserProvider } from "@/libs/UserContext"; 


const font = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
	// Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
export const metadata = {
  title: 'A-D-H-WHAT? | ADHD Support App',
  description: 'Organize tasks, boost focus, and feel better every day with A-D-H-WHAT? — your science-backed ADHD companion.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
	  <html lang="en">
		<body>
		  <UserProvider> 
			{children}
		  </UserProvider>
		</body>
	  </html>
	);
  }
