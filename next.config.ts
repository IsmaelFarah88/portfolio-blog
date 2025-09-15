import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // استخدام Webpack بدلاً من Turbopack
  turbo: false,

  // خيارات أخرى يمكن إضافتها حسب الحاجة
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
