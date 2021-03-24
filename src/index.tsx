import Head from "next/head";
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import { debounce } from "./utils";

const vwCssVar = "vw";
const vhCssVar = "vh";

interface Context {
  vw: number | undefined;
  vh: number | undefined;
}

const RealViewportContext = createContext<Context | undefined>(undefined);

const RealViewportScript = memo(({ prefix }: { prefix: string }) => (
  <Head>
    <script
      key="real-viewport-script"
      dangerouslySetInnerHTML={{
        __html: `(function() {
            var d = document.documentElement;
            d.style.setProperty('--${
              prefix + vwCssVar
            }', (d.clientWidth || window.innerWidth) / 100 + 'px');
            d.style.setProperty('--${
              prefix + vhCssVar
            }', (d.clientHeight || window.innerHeight) / 100 + 'px');
        }())`,
      }}
    />
  </Head>
));

type Props = {
  debounceResize?: boolean;
  variablesPrefix?: string;
};

const RealViewportProvider: React.FC<Props> = ({
  children,
  debounceResize = true,
  variablesPrefix = "",
}) => {
  const [value, setValue] = useState<Context>({ vw: undefined, vh: undefined });

  useEffect(() => {
    function handleResize() {
      const vw =
        (document.documentElement.clientWidth || window.innerWidth) / 100;
      const vh =
        (document.documentElement.clientHeight || window.innerHeight) / 100;
      document.documentElement.style.setProperty(
        "--" + variablesPrefix + vwCssVar,
        `${vw}px`
      );
      document.documentElement.style.setProperty(
        "--" + variablesPrefix + vhCssVar,
        `${vh}px`
      );
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
  }, [variablesPrefix, debounceResize]);

  return (
    <RealViewportContext.Provider value={value}>
      <RealViewportScript prefix={variablesPrefix} />
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

export { RealViewportProvider, useRealViewport };
export { ViewportWidthBox, ViewportHeightBox } from "./components";
