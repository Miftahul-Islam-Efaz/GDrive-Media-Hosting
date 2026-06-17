export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://g-drive-media-hosting.vercel.app/sitemap.xml",
  };
}
