import Script from "next/script";
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCallback } from "react";
import { useIOSToolbarState } from "./hooks";
import { debounce } from "./utils";

const vwCssVar = "vw";
const vhCssVar = "vh";

interface Context {
  vw: number | undefined;
  vh: number | undefined;
  isIOSToolbarVisible: boolean | undefined;
}

const RealViewportContext = createContext<Context | undefined>(undefined);

const encodeBase64 = (str: string) => {
  return typeof window !== "undefined"
    ? window.btoa(str)
    : Buffer.from(str).toString("base64");
};

const RealViewportScript = memo(({ prefix }: { prefix: string }) => {
  const encodedScript = `data:text/javascript;base64,${encodeBase64(`(function() {
    var d = document.documentElement;
    d.style.setProperty('--${
      prefix + vwCssVar
    }', (d.clientWidth || window.innerWidth) / 100 + 'px');
    d.style.setProperty('--${
      prefix + vhCssVar
    }', (d.clientHeight || window.innerHeight) / 100 + 'px');
}())`)}`;
  return (
    <Script
      key="real-viewport-script"
      strategy="beforeInteractive"
      src={encodedScript}
    />
  );
});


/**
 *  After React 18 the type React.FC does not provide a children prop anymore,
 *  therefore it is necessary to manually add the type using the helper 
 *  React.PropsWithChildren or the prop 'children: React.ReactNode'
 */
type Props = {
  debounceResize?: boolean;
  variablesPrefix?: string;
};

const RealViewportProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  debounceResize = true,
  variablesPrefix = "",
}) => {
  const [value, setValue] = useState<Pick<Context, "vw" | "vh">>({
    vw: undefined,
    vh: undefined,
  });
  const { isVisible } = useIOSToolbarState();

  const handleResize = useCallback(() => {
    const vw = parseFloat((window.innerWidth * 0.01).toFixed(4));
    const vh = parseFloat((window.innerHeight * 0.01).toFixed(4));
    document.documentElement.style.setProperty(
      "--" + variablesPrefix + vwCssVar,
      `${vw}px`
    );
    document.documentElement.style.setProperty(
      "--" + variablesPrefix + vhCssVar,
      `${vh}px`
    );
    setValue({ vw, vh });
  }, [variablesPrefix]);

  useEffect(() => {
    handleResize();
    const handler = debounceResize ? debounce(handleResize, 250) : handleResize;
    window.addEventListener("resize", handler, { passive: true });
    window.addEventListener("orientationchange", handler, { passive: true });
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, [variablesPrefix, debounceResize, isVisible, handleResize]);

  useEffect(() => {
    const timeout = window.setTimeout(handleResize, 200);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [isVisible]);

  return (
    <RealViewportContext.Provider
      value={{ ...value, isIOSToolbarVisible: isVisible }}
    >
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
