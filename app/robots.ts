import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/konto/", "/logowanie", "/weryfikacja", "/platnosc/"],
      },
    ],
    sitemap: "https://mocplomienia.pl/sitemap.xml",
  };
}
