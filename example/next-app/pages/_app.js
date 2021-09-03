import { RealViewportProvider } from "next-real-viewport";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <RealViewportProvider>
      <Component {...pageProps} />
    </RealViewportProvider>
  );
}

export default MyApp;
