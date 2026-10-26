import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wijaya Dary Dimas — Personal Digital Hub",
  description:
    "Personal digital hub of Wijaya Dary Dimas. Informatics background from Universitas Muhammadiyah Purwokerto, Computer Vision research in modified YOLOv11 PPE detection, and Pranata Komputer at Badan Informasi Geospasial.",
  keywords: [
    "Wijaya Dary Dimas",
    "Informatics Engineering",
    "Universitas Muhammadiyah Purwokerto",
    "Badan Informasi Geospasial",
    "YOLOv11",
    "Computer Vision",
    "Software Engineer",
  ],
  authors: [{ name: "Wijaya Dary Dimas" }],
  creator: "Wijaya Dary Dimas",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/wijayadarydimas-coder",
    title: "Wijaya Dary Dimas — Exploring Technology. Building Ideas. Creating Impact.",
    description:
      "Production-ready personal website and digital portfolio of Wijaya Dary Dimas. Engineering projects, YOLOv11 PPE detection thesis, geospatial track record, and interactive AI assistant.",
    siteName: "Wijaya Dary Dimas Personal Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wijaya Dary Dimas — Personal Digital Hub",
    description:
      "Exploring Technology. Building Ideas. Creating Impact. Engineering projects & YOLOv11 research.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="antialiased bg-[#0B0D12] text-[#F1F2F5] min-h-screen">
        {children}
      </body>
    </html>
  );
}
