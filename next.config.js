const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  rewrites: async () => ({
    beforeFiles: [
      {
        source: "/apps/:appname([^/.]+)/:rest*",
        destination: "/apps/:appname/:rest*",
      },
      {
        source: "/apps/:app([^/.]+)",
        destination: "/apps/:app/index.html",
      },
    ],
  }),
};

module.exports = nextConfig;
