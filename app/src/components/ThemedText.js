import { Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { responsiveFontSize } from "../utils/responsive";

export function ThemedText({ style, type = "default", color, ...rest }) {
  const { colors, typography, isLargeText } = useTheme();

  const getStyleParams = () => {
    switch (type) {
      case "title":
        return {
          fontFamily: typography.family.sansBold,
          fontSize: responsiveFontSize(32),
          lineHeight: responsiveFontSize(40),
        };
      case "subtitle":
        return {
          fontFamily: typography.family.sansBold,
          fontSize: responsiveFontSize(24),
          lineHeight: responsiveFontSize(32),
        };
      case "heading":
        return {
          fontFamily: typography.family.sansBold,
          fontSize: responsiveFontSize(20),
          lineHeight: responsiveFontSize(28),
        };
      case "defaultSemiBold":
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: responsiveFontSize(16),
          lineHeight: responsiveFontSize(24),
        };
      case "small":
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20),
        };
      case "caption":
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: responsiveFontSize(12),
          lineHeight: responsiveFontSize(16),
        };
      case "link":
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: responsiveFontSize(16),
          lineHeight: responsiveFontSize(24),
          color: colors.primary,
        };
      case "devanagari":
        return {
          fontFamily: typography.family.devanagari,
          fontSize: responsiveFontSize(18),
          lineHeight: responsiveFontSize(28),
        };
      default:
        return {
          fontFamily: typography.family.sansSemiBold,
          fontSize: responsiveFontSize(16),
          lineHeight: responsiveFontSize(24),
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
      allowFontScaling={false}
      style={[
        {
          fontFamily,
          fontSize: (styleFontSize || fontSize) * scale,
          lineHeight: (styleLineHeight || lineHeight) * scale,
          color: color || defaultColor || colors.foreground,
        },
        restStyle,
      ]}
      {...rest}
    />
  );
}
