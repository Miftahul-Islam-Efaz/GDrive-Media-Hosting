import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, FileText } from "lucide-react";

export const metadata = {
  metadataBase: new URL("https://g-drive-media-hosting.vercel.app"),
  title: "Privacy Policy - G Drive Media Hosting",
  description: "Read the Privacy Policy for GDrive Media Host. Learn how we handle your Google user data securely and client-side with 100% database-free technology.",
  keywords: [
    "GDrive Media Host privacy policy",
    "G Drive hosting privacy policy",
    "free media hosting privacy",
    "Google OAuth data security"
  ],
  openGraph: {
    title: "Privacy Policy - G Drive Media Hosting",
    description: "Learn how we handle your Google user data securely with our 100% database-free, client-side architecture.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "GDrive Media Host Privacy Policy",
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - G Drive Media Hosting",
    description: "Learn how we handle your Google user data securely with our 100% database-free, client-side architecture.",
    images: ["/opengraph-image.png"],
  }
};

export default function PrivacyPage() {
  return (
    <div style={{
      backgroundColor: "#f8fafd",
      color: "#1f1f1f",
      minHeight: "100vh",
      fontFamily: "'Outfit', sans-serif",
      padding: "40px 24px"
    }}>
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

        {/* Header Section */}
        <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{
            backgroundColor: "#ffe8ec",
            padding: 12,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Lock style={{ color: "#ff4b4b", width: 32, height: 32 }} />
          </div>
          <div>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", tracking: "0.05em", color: "#ff4b4b", fontWeight: 700 }}>Security & User Rights</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700, margin: "2px 0 0 0", color: "#1f1f1f", letterSpacing: "-0.03em" }}>
              Privacy Policy
            </h1>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "#5f6368" }}>
          <p style={{ fontSize: "1.05rem", color: "#1f1f1f", marginBottom: 24 }}>
            Last updated: June 17, 2026. This Privacy Policy describes how GDrive Media Host handles your personal and Google user data. We take security seriously and have designed this application to run with a **100% database-free, client-side architecture**.
          </p>

          {/* Section 1 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck style={{ color: "#4899ff", width: 20, height: 20 }} />
              1. No Data Collection (Database-Free)
            </h2>
            <p>
              We do not collect, process, or store your personal information on any server. GDrive Media Host has **no backend servers or databases**. All app logic runs locally inside your web browser. Any credentials or authorization tokens you obtain from logging into Google are stored temporarily in your own browser's session storage.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Server style={{ color: "#4899ff", width: 20, height: 20 }} />
              2. How We Access Google User Data
            </h2>
            <p>
              When you log into the app, we request authorization scopes via OAuth 2.0 to perform the following actions:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li><strong>Create and Locate Folders:</strong> We search for or create an isolated folder named <code>"GDrive Media Host"</code> in your Google Drive storage.</li>
              <li><strong>Upload and Manage Files:</strong> We upload files that you drag-and-drop or select directly to your <code>"GDrive Media Host"</code> folder.</li>
              <li><strong>Generate Public Shared URLs:</strong> Upon successful upload, we update the permissions of the uploaded file to make it public, allowing you to generate direct embedding and hotlinking URLs.</li>
              <li><strong>Delete and Rename:</strong> We let you manage files (rename or delete) inside that folder through the dashboard. We cannot view, access, or modify files outside of this folder.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <EyeOff style={{ color: "#4899ff", width: 20, height: 20 }} />
              3. Data Sharing and Third-Parties
            </h2>
            <p>
              Since we do not save your data, we never share, sell, or distribute your account info or uploaded files with third parties. Your uploaded files reside in your personal Google account. Public sharing is solely restricted to the files you upload into the designated hosting folder so that you can hotlink them on websites.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <FileText style={{ color: "#4899ff", width: 20, height: 20 }} />
              4. Session and Revocation of Tokens
            </h2>
            <p>
              You are in full control of your Google session. You can revoke authentication tokens at any time by clicking the **Disconnect Account** button in the Settings page or by clearing your browser cache. This deletes all session tokens from your browser.
            </p>
          </section>

          {/* Verification section */}
          <div style={{
            backgroundColor: "#f1f3f4",
            borderLeft: "4px solid #5f6368",
            padding: "16px 20px",
            borderRadius: "4px",
            fontSize: "0.85rem",
            color: "#3c4043",
            marginTop: 40
          }}>
            <strong>Compliance Note:</strong> This Privacy Policy complies with the Google OAuth 2.0 User Data Policy requirements for client-side API integrations.
          </div>
        </main>

        <footer style={{ marginTop: 48, borderTop: "1px solid #dadce0", paddingTop: 24, textAlign: "center", fontSize: "0.8rem", color: "#80868b" }}>
          GDrive Media Host — Privacy Policy. 100% Secure & Client-Side.
        </footer>

      </div>
    </div>
  );
}
