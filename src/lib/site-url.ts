const fallbackSiteUrl = "https://builderdealintel.com";

export function getSiteUrl(path = "/") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || fallbackSiteUrl).replace(/\/$/, "");
  return new URL(path, `${base}/`);
}
