import Head from "next/head";
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";

const vwCssVar = "--vw";
const vhCssVar = "--vh";
const fullWidthCss = `calc(var(${vwCssVar}) * 100)`;
const fullHeightCss = `calc(var(${vhCssVar}) * 100)`;

interface Context {
  vw: number | undefined;
  vh: number | undefined;
}

const RealViewportContext = createContext<Context | undefined>(undefined);

const RealViewportScript = memo(() => (
  <Head>
    <script
      key="real-viewport-script"
      dangerouslySetInnerHTML={{
        __html: `(function() {
            var d = document.documentElement;
            d.style.setProperty('${vwCssVar}', (d.clientWidth || window.innerWidth) / 100 + 'px');
            d.style.setProperty('${vhCssVar}', (d.clientHeight || window.innerHeight) / 100 + 'px');
        }())`,
      }}
    />
  </Head>
));

const RealViewportProvider: React.FC = ({ children }) => {
  const [value, setValue] = useState<Context>()

  useEffect(() => {
    function handleResize() {
      const vw = (document.documentElement.clientWidth || window.innerWidth) / 100;
      const vh = (document.documentElement.clientHeight || window.innerHeight) / 100;
      document.documentElement.style.setProperty(vwCssVar, `${vw}px`);
      document.documentElement.style.setProperty(vhCssVar, `${vh}px`);
      setValue({ vw, vh });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <RealViewportContext.Provider value={value}>
      <RealViewportScript />
      {children}
    </RealViewportContext.Provider>
  );
};

const useRealViewport = () => {
  const context = useContext(RealViewportContext);
  if (typeof context === "undefined") {
    throw new Error("useRealViewport must be used below a <RealViewportProvider>");
  }
  return context;
};

export { RealViewportProvider, vwCssVar, vhCssVar, fullWidthCss, fullHeightCss, useRealViewport };
export { ViewportWidthBox, ViewportHeightBox } from './components'