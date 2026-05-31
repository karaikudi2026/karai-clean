import React, { memo } from "react";
import { Image as ExpoImage, type ImageProps } from "expo-image";
import { useTheme } from "../theme/ThemeContext";

type Props = Omit<ImageProps, "style"> & {
  radius?: number;
  style?: ImageProps["style"];
};

export const Image = memo(function Image({
  radius = 0,
  style,
  contentFit = "cover",
  transition = 300,
  ...props
}: Props) {
  const t = useTheme();

  return (
    <ExpoImage
      contentFit={contentFit}
      transition={transition}
      style={[
        { borderRadius: radius, backgroundColor: t.colors.surfaceMuted },
        style,
      ]}
      {...props}
    />
  );
});
