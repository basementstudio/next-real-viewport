import { useEffect, useState } from "react";

export const useIOSToolbarState = () => {
  const [isVisible, setIsVisible] = useState<boolean>();

  useEffect(() => {
    const ua = window.navigator ? window.navigator.userAgent : "";
    const iOS = ua.match(/iPad/i) || ua.match(/iPhone/i);
    const webkit = ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    const baseWindowHeight = window.innerHeight;

    function handleScroll() {
      const newWindowHeight = window.innerHeight;
      if (newWindowHeight - 50 > baseWindowHeight) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }

    // the toolbar issue only happens on iOS Safari
    if (iOSSafari) {
      if (
        "standalone" in window.navigator &&
        (window.navigator as any)["standalone"]
      ) {
        // if it's iOS' standalone mode (added to home screen)
        // the toolbar is always "hidden"
        setIsVisible(false);
      } else {
        // iOS Safari
        document.addEventListener("scroll", handleScroll);

        return () => {
          document.removeEventListener("scroll", handleScroll);
        };
      }
    }
  }, []);

  return { isVisible };
};
