import React from "react";
import Link from "next/link";
import { Folder, ArrowLeft, ExternalLink, Image as ImageIcon, Video, ShieldCheck, Heart, Star } from "lucide-react";

export const metadata = {
  metadataBase: new URL("https://g-drive-media-hosting.vercel.app"),
  title: "G Drive Media Hosting - Free Media Hosting",
  description: "Host your files for free using GDrive Media Host. Instantly upload and convert G Drive files to permanent public URLs, hotlinks, and iframe embeds. Safe, secure, and developer-friendly.",
  keywords: [
    "Google Drive image upload",
    "image public URL",
    "Google Drive hosting",
    "free hosting",
    "free media hosting",
    "free hosting for images",
    "GDrive image hosting",
    "Google Drive public link",
    "convert drive link to direct image URL"
  ],
  openGraph: {
    title: "G Drive Media Hosting - Free Media Hosting",
    description: "Get direct image public URLs and free video hosting using G Drive as a public CDN.",
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
    description: "Get direct image public URLs and free video hosting using G Drive as a public CDN.",
    images: ["/opengraph-image.jpg"],
  }
};

export default function AboutPage() {
  return (
    <div style={{
      backgroundColor: "#f8fafd",
      color: "#1f1f1f",
      minHeight: "100vh",
      fontFamily: "'Outfit', sans-serif",
      padding: "40px 24px"
    }}>
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
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)",
        border: "1px solid #dadce0",
        padding: "48px 40px"
      }}>
        
        {/* Navigation back to dashboard */}
        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: "#4899ff",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          marginBottom: 32,
          transition: "transform 0.2s ease"
        }}>
          <ArrowLeft style={{ width: 18, height: 18 }} />
          Back to Dashboard
        </Link>

        {/* Branding header */}
        <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{
            backgroundColor: "#d3e3fd",
            padding: 12,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Folder style={{ color: "#4899ff", width: 32, height: 32 }} />
          </div>
          <div>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", tracking: "0.05em", color: "#4899ff", fontWeight: 700 }}>Open-Source Public CDN</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700, margin: "2px 0 0 0", color: "#1f1f1f", letterSpacing: "-0.03em" }}>
              GDrive Media Host
            </h1>
          </div>
        </header>

        {/* Main SEO optimized body */}
        <main>
          <section>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#5f6368", marginBottom: 28 }}>
              GDrive Media Host is a state-of-the-art, client-side web application designed to turn your personal G Drive account into a fast, reliable, and 100% free media hosting server. Generate direct public URLs for images, obtain copy-paste CDN hotlinks, and embed videos on your websites with absolute ease.
            </p>
          </section>

          <section style={{ margin: "40px 0" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 18, borderBottom: "2px solid #e9eef6", paddingBottom: 8 }}>
              Why Choose G Drive Hosting?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
              
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ color: "#4899ff", flexShrink: 0 }}>
                  <ImageIcon style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 4 }}>GDrive Image Upload & Hotlinking</h3>
                  <p style={{ fontSize: "0.9rem", color: "#5f6368", lineHeight: 1.5 }}>
                    Seamlessly upload images and instantly copy direct embedding URLs (`lh3.googleusercontent.com/d/FILE_ID`) to use in custom HTML `&lt;img&gt;` tags, forums, or markdown documents.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ color: "#4899ff", flexShrink: 0 }}>
                  <Video style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 4 }}>Free Media Hosting & Video Embeds</h3>
                  <p style={{ fontSize: "0.9rem", color: "#5f6368", lineHeight: 1.5 }}>
                    Store, manage, and play your video files inside your websites using GDrive's native iframe preview player, completely bypassing bandwidth fees.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ color: "#34a853", flexShrink: 0 }}>
                  <ShieldCheck style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 4 }}>100% Safe and Secure (Client-Side Only)</h3>
                  <p style={{ fontSize: "0.9rem", color: "#5f6368", lineHeight: 1.5 }}>
                    Security is our top priority. The application runs entirely inside your web browser. There are no backend database servers, which means your personal Google account access keys and tokens are never saved or exposed to third parties.
                  </p>
                </div>
              </div>

            </div>
          </section>

          <section style={{ margin: "40px 0" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 18, borderBottom: "2px solid #e9eef6", paddingBottom: 8 }}>
              SEO-Friendly GDrive CDN Hosting FAQ
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 4 }}>How do I get an image public URL from G Drive?</h4>
                <p style={{ fontSize: "0.9rem", color: "#5f6368", lineHeight: 1.5 }}>
                  Simply connect your G Drive to this app, drag & drop an image, and click "Copy Link". The system handles authorization, folder permissions, and outputs a direct public URL ready to hotlink instantly.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 4 }}>Is there any bandwidth limit for free hosting?</h4>
                <p style={{ fontSize: "0.9rem", color: "#5f6368", lineHeight: 1.5 }}>
                  By hosting on G Drive, you leverage the cloud storage infrastructure. However, Drive imposes quota limits for rapid downloads, which is why images are optimized via caching, and video streaming requires native iframe embeds.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action Star Repo */}
          <section style={{
            backgroundColor: "#24292e",
            borderRadius: "12px",
            padding: "24px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginTop: 40,
            gap: 14
          }}>
            <Heart style={{ color: "#ff4b4b", width: 28, height: 28, fill: "#ff4b4b" }} />
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: 4 }}>Support GDrive-Media-Hosting</h3>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af", maxWidth: "550px", lineHeight: 1.4 }}>
                This open-source hosting manager is 100% free. If GDrive Media Host helps you link and share images easily, please support the developer by starring the project on GitHub!
              </p>
            </div>
            <a
              href="https://github.com/Miftahul-Islam-Efaz/GDrive-Media-Hosting"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "white",
                color: "#24292e",
                padding: "10px 24px",
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 12px rgba(255, 255, 255, 0.15)",
                transition: "transform 0.2s ease"
              }}
            >
              <Star style={{ width: 16, height: 16, fill: "#24292e" }} />
              Star on GitHub
            </a>
          </section>
        </main>
        
        <footer style={{ marginTop: 48, borderTop: "1px solid #dadce0", paddingTop: 24, textAlign: "center", fontSize: "0.8rem", color: "#80868b" }}>
          <div style={{ marginBottom: 8 }}>
            GDrive Media Host — The Premium Web Solution for G Drive Image & Media Hosting.
          </div>
          <div>
            <Link href="/privacy" style={{ color: "#4899ff", textDecoration: "none", fontWeight: 500 }}>
              Privacy Policy
            </Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
