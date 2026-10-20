import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/guide": ["./public/data/eras/**/events.geojson", "./public/data/eras/**/territories.geojson"],
  },
};

export default nextConfig;
