import CryptoApp from '@/components/CryptoApp';

/**
 * Home page — thin server component that mounts the interactive client app.
 * All cipher logic runs client-side; no server data fetching needed.
 */
export default function Home() {
  return <CryptoApp />;
}
