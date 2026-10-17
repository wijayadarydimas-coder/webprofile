import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wijaya Dary Dimas — Personal Digital Hub",
  description:
    "Personal digital hub of Wijaya Dary Dimas. Informatics background from Universitas Muhammadiyah Purwokerto, Computer Vision research in modified YOLOv11 PPE detection, and Pranata Komputer at Badan Informasi Geospasial.",
  keywords: [
    "Wijaya Dary Dimas",
    "Teknik Informatika",
    "Universitas Muhammadiyah Purwokerto",
    "Badan Informasi Geospasial",
    "YOLOv11",
    "Computer Vision",
    "Pranata Komputer",
    "Software Engineer",
  ],
  authors: [{ name: "Wijaya Dary Dimas" }],
  creator: "Wijaya Dary Dimas",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://github.com/wijayadarydimas-coder",
    title: "Wijaya Dary Dimas — Exploring Technology. Building Ideas. Creating Impact.",
    description:
      "Website personal production-ready Wijaya Dary Dimas. Portofolio proyek, skripsi deteksi APD YOLOv11, rekam jejak Badan Informasi Geospasial, dan asisten AI.",
    siteName: "Wijaya Dary Dimas Personal Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wijaya Dary Dimas — Personal Digital Hub",
    description:
      "Exploring Technology. Building Ideas. Creating Impact. Portofolio proyek & penelitian skripsi YOLOv11.",
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
    <html lang="id" className="dark" data-scroll-behavior="smooth">
      <body className="antialiased bg-[#0B0D12] text-[#F1F2F5] min-h-screen">
        {children}
      </body>
    </html>
  );
}
