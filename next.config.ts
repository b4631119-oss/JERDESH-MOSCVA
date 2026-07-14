/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'aocsekpkyjgpmvidghn.supabase.co', // Твой основной домен Supabase
        port: '',
        pathname: '/storage/v1/object/public/**', // Разрешаем доступ к публичным бакетам
      },
      {
        protocol: 'https',
        hostname: 'aoxcsekpkyjgpmvidghn.supabase.co', // Дублирующий хост из твоего лога (на всякий случай)
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;