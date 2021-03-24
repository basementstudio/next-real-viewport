import React, { forwardRef } from "react";

type WithCenterProps = JSX.IntrinsicElements["div"] & {
  center?: boolean;
};

const ViewportWidthBox = forwardRef<HTMLDivElement, WithCenterProps>(
  ({ style, center = true, ...rest }, ref) => (
    <div
      style={{
        ...style,
        width: "calc(var(--vw) * 100)",
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
  <div
    style={{ ...style, height: "calc(var(--vh) * 100)" }}
    {...rest}
    ref={ref}
  />
));

export { ViewportWidthBox, ViewportHeightBox };
