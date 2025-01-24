// pages/_app.js
import '../app/globals.css'
import { SessionProvider } from "next-auth/react";
import { EdgeStoreProvider } from '../lib/edgestore';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <EdgeStoreProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </EdgeStoreProvider>
  );
}

export default MyApp;