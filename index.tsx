import Head from "next/head";
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";

// All this to take into account the scrollbar, haha.

const cssVar = "--vw";
const fullScreenCss = `calc(var(${cssVar}) * 100)`;
interface Context {
  vw: number | undefined;
  cssVar: typeof cssVar;
  fullScreenCss: typeof fullScreenCss;
}

const RealVwContext = createContext<Context | undefined>(undefined);

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
    <RealVwContext.Provider value={{ vw, cssVar, fullScreenCss }}>
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

export { RealVwProvider, cssVar, fullScreenCss, useRealVw };
