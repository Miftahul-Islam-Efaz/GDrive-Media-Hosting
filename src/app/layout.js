import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"] 
});

export const metadata = {
  metadataBase: new URL("https://g-drive-media-hosting.vercel.app"),
  title: "G Drive Media Hosting - Free Media Hosting",
  description: "Host your files for free using GDrive Media Host. Instantly upload and convert G Drive files to permanent public URLs, hotlinks, and iframe embeds. Safe, secure, and developer-friendly.",
  openGraph: {
    title: "G Drive Media Hosting - Free Media Hosting",
    description: "Host your files for free using GDrive Media Host. Instantly upload and convert G Drive files to permanent public URLs, hotlinks, and iframe embeds.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "GDrive Media Host Thumbnail",
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "G Drive Media Hosting - Free Media Hosting",
    description: "Host your files for free using GDrive Media Host. Instantly upload and convert G Drive files to permanent public URLs, hotlinks, and iframe embeds.",
    images: ["/opengraph-image.jpg"],
  },
  verification: {
    google: "UL16WbX2SDFD80N_XFHoMiYAI3G-0QBiZYBnoIK37po",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {/* Hidden SEO Keywords Block for Search Engines (Invisible to human users) */}
        <div style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: "0"
        }}>
          <h2>Google Drive Image Upload, Google Drive Hosting, and Free GDrive CDN</h2>
          <p>
            Easily generate public direct image URLs from Google Drive. Host images, videos, and media files for free using your personal Google Drive as a public CDN storage server. Convert Google Drive share links into hotlinks and direct embedding URLs.
          </p>
        </div>

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
