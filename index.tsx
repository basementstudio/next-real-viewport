import Head from "next/head";
import { createContext, memo, useContext, useEffect, useState } from "react";

// All this to take into account the scrollbar, haha.

interface Context {
  vw: number | undefined;
  vwPx: string | undefined;
  cssVar: string;
}

const RealVwContext = createContext<Context | undefined>(undefined);

const cssVar = "--vw";
const fullScreenWidth = "calc(var(--vw) * 100)";

const RealVwScript = memo(() => (
  <Head>
    <script
      key="real-vw-script"
      dangerouslySetInnerHTML={{
        __html: `(function() {
            var d = document.documentElement
            d.style.setProperty('${cssVar}', d.clientWidth / 100 + 'px')
        }())`,
      }}
    />
  </Head>
));

const RealVwProvider: React.FC = ({ children }) => {
  const [vw, setVw] = useState<number>();

  useEffect(() => {
    function handleResize() {
      const vw = document.documentElement.clientWidth / 100;
      document.documentElement.style.setProperty(cssVar, `${vw}px`);
      setVw(vw);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <RealVwContext.Provider
      value={{ vw, cssVar, vwPx: vw ? `${vw}px` : undefined }}
    >
      <RealVwScript />
      {children}
    </RealVwContext.Provider>
  );
};

const useRealVw = () => {
  const context = useContext(RealVwContext);
  if (typeof context === "undefined") {
    throw new Error("useRealVw must be used below a <RealVwProvider>");
  }
  return context;
};

export { RealVwProvider, cssVar, fullScreenWidth, useRealVw };
