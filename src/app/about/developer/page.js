import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Code2, Globe, Cpu, Award, Mail, Github, Linkedin, Briefcase } from "lucide-react";

export const metadata = {
  metadataBase: new URL("https://g-drive-media-hosting.vercel.app"),
  title: "About Developer - Miftahul Islam Efaz | Creative Frontend Engineer",
  description: "Learn more about Miftahul Islam Efaz, a Creative Frontend Engineer, Entrepreneur, and AI Orchestrator building digital sanctuaries and high-performance frontend architectures.",
  keywords: [
    "Miftahul Islam Efaz",
    "Efaz developer",
    "Miftahul Islam Efaz portfolio",
    "Creative Frontend Engineer Bangladesh",
    "AI Orchestrator Chittagong",
    "Vibe Coder Bangladesh",
    "web developer Chittagong",
    "Webigns"
  ],
  openGraph: {
    title: "About Developer - Miftahul Islam Efaz",
    description: "Creative Frontend Engineer, Developer, and Technical Architect based in Chittagong, Bangladesh.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Miftahul Islam Efaz Profile",
      }
    ],
    type: "profile"
  },
  twitter: {
    card: "summary_large_image",
    title: "About Developer - Miftahul Islam Efaz",
    description: "Creative Frontend Engineer, Developer, and Technical Architect based in Chittagong, Bangladesh.",
    images: ["/opengraph-image.jpg"],
  }
};

export default function DeveloperPage() {
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
        
        {/* Navigation back to About */}
        <Link href="/about" style={{
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
          Back to About Host
        </Link>

        {/* Header Intro */}
        <header style={{ marginBottom: 36 }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", tracking: "0.05em", color: "#4899ff", fontWeight: 700 }}>Behind the Code</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: "4px 0 8px 0", color: "#1f1f1f", letterSpacing: "-0.03em" }}>
            Miftahul Islam Efaz
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#5f6368", margin: 0, fontWeight: 400 }}>
            Creative Frontend Engineer · Entrepreneur · AI Orchestrator
          </p>
        </header>

        {/* Main Body */}
        <main style={{ fontSize: "0.98rem", lineHeight: 1.65, color: "#5f6368" }}>
          
          {/* Bio Hook */}
          <section style={{ marginBottom: 36 }}>
            <p style={{ fontSize: "1.1rem", color: "#1f1f1f", fontWeight: 400, marginBottom: 20 }}>
              Based in Chittagong, Bangladesh, Efaz sits at a unique intersection of **advanced frontend architecture, generative AI workflows, and strategic business engineering**. As the co-founder of Webigns, he crafts immersive, high-performance digital products for clients worldwide.
            </p>
            <p>
              Rather than writing traditional code line-by-line, Efaz utilizes AI code orchestrations as a force multiplier—shipping robust MVP platforms in days rather than weeks, and engineering Docker infrastructure, n8n automations, and complex API pipelines to deliver maximum business value.
            </p>
          </section>

          {/* Skill Columns */}
          <section style={{ marginBottom: 40, borderTop: "1px solid #e9eef6", paddingTop: 32 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <Cpu style={{ color: "#4899ff", width: 22, height: 22 }} />
              Core Competencies
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 6 }}>Creative Frontend</h3>
                <p style={{ fontSize: "0.88rem", margin: 0 }}>
                  React, Next.js, TypeScript, Tailwind CSS, Framer Motion, and GSAP. Specializes in biophilic geometries, WebGL shader interactions, and pixel-perfect layouts.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 6 }}>AI & Automations</h3>
                <p style={{ fontSize: "0.88rem", margin: 0 }}>
                  n8n workflow pipelines, multi-agent LLM orchestrations, Claude Code, custom MCP server integrations, and webhook system automations.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 6 }}>Backend & Cloud</h3>
                <p style={{ fontSize: "0.88rem", margin: 0 }}>
                  Express API controllers, Docker containerization, VPS hosting configuration, and Puppeteer server-side script generations.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 6 }}>Technical Strategy</h3>
                <p style={{ fontSize: "0.88rem", margin: 0 }}>
                  Cost-optimization (e.g. running containers on pre-existing resources), cold outreach pipelines, and translating ideas to live MVPs at light speed.
                </p>
              </div>
            </div>
          </section>

          {/* Key Work */}
          <section style={{ marginBottom: 40, borderTop: "1px solid #e9eef6", paddingTop: 32 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <Briefcase style={{ color: "#4899ff", width: 22, height: 22 }} />
              Featured Productions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <strong style={{ color: "#1f1f1f" }}>My Blood Test (MBT):</strong> AI-powered medical diagnostics application built for a UK client. Features server-side Puppeteer PDF reports and is deployed in the Google Play Store on VPS using Docker containers.
              </div>
              <div>
                <strong style={{ color: "#1f1f1f" }}>Nagarik Seba:</strong> Civic issues submission portal for Dhaka utilizing GPS positioning and Gemini Vision filters to verify civic complaints dynamically.
              </div>
              <div>
                <strong style={{ color: "#1f1f1f" }}>NanoQuery:</strong> A pay-per-request research application featuring Mistral AI integrations, designed during the Lablab.ai hackathon.
              </div>
            </div>
          </section>

          {/* Credentials */}
          <section style={{ marginBottom: 40, borderTop: "1px solid #e9eef6", paddingTop: 32 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#1f1f1f", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <Award style={{ color: "#4899ff", width: 22, height: 22 }} />
              Hackathons
            </h2>
            <p style={{ margin: "0 0 12px 0" }}>
              <strong>Cognisor AI Hackathon @ BUET:</strong> Youngest Top Finalist team (Webigns) among 100+ university candidates, competing at Bangladesh's premier tech institution.
            </p>
          </section>

          {/* Connect Section */}
          <section style={{
            backgroundColor: "#f8fafd",
            borderRadius: "12px",
            border: "1px solid #e9eef6",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 16
          }}>
            <div style={{ fontWeight: 600, color: "#1f1f1f" }}>Visit the Official Portfolio</div>
            <a 
              href="https://miftahulislamefaz.xyz" 
              target="_blank" 
              rel="dofollow" 
              style={{
                backgroundColor: "#4899ff",
                color: "white",
                padding: "10px 24px",
                borderRadius: "20px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 12px rgba(72, 153, 255, 0.25)"
              }}
            >
              <Globe style={{ width: 16, height: 16 }} />
              miftahulislamefaz.xyz
              <ExternalLink style={{ width: 14, height: 14 }} />
            </a>
            
            {/* Social Grid */}
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <a href="https://github.com/Miftahul-Islam-Efaz" target="_blank" rel="dofollow" style={{ color: "#5f6368" }} title="GitHub">
                <Github style={{ width: 20, height: 20 }} />
              </a>
              <a href="https://www.linkedin.com/in/miftahul-islam-efaz-a91373284/" target="_blank" rel="dofollow" style={{ color: "#5f6368" }} title="LinkedIn">
                <Linkedin style={{ width: 20, height: 20 }} />
              </a>
              <a href="mailto:webigns@gmail.com" style={{ color: "#5f6368" }} title="Email">
                <Mail style={{ width: 20, height: 20 }} />
              </a>
            </div>
          </section>

        </main>
        
        <footer style={{ marginTop: 48, borderTop: "1px solid #dadce0", paddingTop: 24, textAlign: "center", fontSize: "0.8rem", color: "#80868b" }}>
          © 2026 Miftahul Islam Efaz. Crafted with precision for high performance.
        </footer>

      </div>
    </div>
  );
}
