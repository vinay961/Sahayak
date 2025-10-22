import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sahayak - Social Welfare Platform",
  description:
    "Discover government schemes, latest news, and welfare programs. Get accurate information about social welfare initiatives, financial assistance, and development programs in India.",
  keywords: [
    "UPSC Current Affairs",
    "government news",
    "social welfare",
    "government schemes",
    "welfare programs",
    "financial assistance",
    "development programs",
    "India",
  ],
  openGraph: {
    title: "Sahayak - Social Welfare Platform",
    description: "Discover government schemes, latest news, and welfare programs in India",
    type: "website",
    url: "https://sahayakproject.vercel.app",
    images: [
      {
        url: "/og-image.jpg", // Add your OG image
        width: 1200,
        height: 630,
        alt: "Sahayak Platform Preview",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  alternates: {
    canonical: "https://sahayakproject.vercel.app",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
