import React, { forwardRef } from "react";
import { fullHeightCss, fullWidthCss } from "src";

type WithCenterProps = JSX.IntrinsicElements["div"] & {
  center?: boolean;
};

const ViewportWidthBox = forwardRef<HTMLDivElement, WithCenterProps>(
  ({ style, center = true, ...rest }, ref) => (
    <div
      style={{
        ...style,
        width: fullWidthCss,
        ...(center
          ? { position: "relative", transform: "translateX(-50%)", left: "50%" }
          : undefined),
      }}
      {...rest}
      ref={ref}
    />
  )
);

const ViewportHeightBox = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"]
>(({ style, ...rest }, ref) => (
  <div style={{ ...style, height: fullHeightCss }} {...rest} ref={ref} />
));

export { ViewportWidthBox, ViewportHeightBox };
