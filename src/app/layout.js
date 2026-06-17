import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"] 
});

export const metadata = {
  title: "Free Google Drive Media Hosting - Direct Image Public URLs & CDN",
  description: "Host your files for free using GDrive Media Host. Instantly upload and convert Google Drive files to permanent public URLs, hotlinks, and iframe embeds. Safe, secure, and developer-friendly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {/* Load Google Identity Services SDK for OAuth 2.0 */}
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="afterInteractive" 
        />
        {/* Load legacy Google API Client library for GDrive file operations */}
        <Script 
          src="https://apis.google.com/js/api.js" 
          strategy="afterInteractive" 
        />
        {children}
      </body>
    </html>
  );
}
