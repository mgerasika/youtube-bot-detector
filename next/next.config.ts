import withTwin from './withTwin.mjs'
import {i18n} from './next-i18next.config'
/**
 * @type {import('next').NextConfig}
 */
const config = withTwin({
  i18n: i18n
})
export default {
  ...config,
    reactStrictMode: true,
    async headers() {
      return [
        {
          source: '/index.js', // or use '/:path*' for all files
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: 'https://www.youtube.com', // Restrict to YouTube domain
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET,OPTIONS', // Restrict methods as needed
            },
            {
              key: 'Content-Security-Policy',
              value: "script-src 'self' 'wasm-unsafe-eval' https://youtube-bot-detector.com;", // Restrict methods as needed
            },
          ],
        },
      ];
    },
};
