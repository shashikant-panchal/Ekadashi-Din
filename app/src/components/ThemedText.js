import { Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

export function ThemedText({ style, type = "default", color, ...rest }) {
  const { colors, typography, isLargeText } = useTheme();

  const getStyleParams = () => {
    switch (type) {
      case "title":
        return {
          fontFamily: typography.family.sansBold,
          fontSize: 32,
          lineHeight: 40,
        };
      case "subtitle":
        return {
          fontFamily: typography.family.sansBold,
          fontSize: 24,
          lineHeight: 32,
        };
      case "heading":
        return {
          fontFamily: typography.family.sansBold,
          fontSize: 20,
          lineHeight: 28,
        };
      case "defaultSemiBold":
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: 16,
          lineHeight: 24,
        };
      case "small":
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: 14,
          lineHeight: 20,
        };
      case "caption":
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: 12,
          lineHeight: 16,
        };
      case "link":
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.primary,
        };
      case "devanagari":
        return {
          fontFamily: typography.family.devanagari,
          fontSize: 18,
          lineHeight: 28,
        };
      default:
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: 16,
          lineHeight: 24,
        };
    }
  };

  const {
    fontFamily,
    fontSize,
    lineHeight,
    color: defaultColor,
  } = getStyleParams();

  // Scale factor for generic large text support (1.35x for more noticeable difference)
  const scale = isLargeText ? 1.35 : 1;

  // Extract fontSize and lineHeight from style prop if present, and scale them
  const styleArray = Array.isArray(style) ? style : [style];
  const flattenedStyle = styleArray.reduce(
    (acc, s) => ({ ...acc, ...(s || {}) }),
    {}
  );
  const {
    fontSize: styleFontSize,
    lineHeight: styleLineHeight,
    ...restStyle
  } = flattenedStyle;

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize: (styleFontSize || fontSize) * scale,
          lineHeight: (styleLineHeight || lineHeight) * scale,
          color: color || defaultColor || colors.foreground,
        },
        restStyle,
      ]}
      allowFontScaling={false}
      {...rest}
    />
  );
}
