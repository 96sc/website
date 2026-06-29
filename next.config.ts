import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/trash-collection", destination: "/services/trash-collection", permanent: true },
      { source: "/utilities-cpw", destination: "/services/utilities-cpw", permanent: true },
      { source: "/business-licenses", destination: "/services/business-license-renewal", permanent: true },
      { source: "/town-council", destination: "/government/council", permanent: true },
      { source: "/minutes-agendas-and-recordings", destination: "/government/meetings", permanent: true },
      { source: "/departments", destination: "/government/departments", permanent: true },
      { source: "/contact-96", destination: "/contact", permanent: true },
      { source: "/events-0", destination: "/events", permanent: true },
      { source: "/parks", destination: "/community", permanent: true },
      { source: "/moving-96", destination: "/community", permanent: true }
    ];
  }
};

export default nextConfig;
