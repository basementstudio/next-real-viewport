import Head from "next/head";
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import { debounce } from "./utils";

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

type Props = {
  debounceResize?: boolean;
};

const RealViewportProvider: React.FC<Props> = ({
  children,
  debounceResize = true,
}) => {
  const [value, setValue] = useState<Context>({ vw: undefined, vh: undefined });

  useEffect(() => {
    function handleResize() {
      const vw =
        (document.documentElement.clientWidth || window.innerWidth) / 100;
      const vh =
        (document.documentElement.clientHeight || window.innerHeight) / 100;
      document.documentElement.style.setProperty(vwCssVar, `${vw}px`);
      document.documentElement.style.setProperty(vhCssVar, `${vh}px`);
      setValue({ vw, vh });
    }
    handleResize();
    const handler = debounceResize ? debounce(handleResize, 250) : handleResize;
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
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
  if (context === undefined) {
    throw new Error(
      "useRealViewport must be used below a <RealViewportProvider>"
    );
  }
  return context;
};

export {
  RealViewportProvider,
  vwCssVar,
  vhCssVar,
  fullWidthCss,
  fullHeightCss,
  useRealViewport,
};
export { ViewportWidthBox, ViewportHeightBox } from "./components";
