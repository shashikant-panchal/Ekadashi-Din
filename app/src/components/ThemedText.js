import { Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function ThemedText({
    style,
    type = 'default',
    color,
    ...rest
}) {
    const { colors, typography } = useTheme();

    const getStyleParams = () => {
        switch (type) {
            case 'title':
                return {
                    fontFamily: typography.family.sansBold,
                    fontSize: 32,
                    lineHeight: 40,
                };
            case 'subtitle':
                return {
                    fontFamily: typography.family.sansBold,
                    fontSize: 24,
                    lineHeight: 32,
                }
            case 'heading':
                return {
                    fontFamily: typography.family.sansBold,
                    fontSize: 20,
                    lineHeight: 28,
                }
            case 'defaultSemiBold':
                return {
                    fontFamily: typography.family.sansSemiBold,
                    fontSize: 16,
                    lineHeight: 24,
                };
            case 'small':
                return {
                    fontFamily: typography.family.sans,
                    fontSize: 14,
                    lineHeight: 20,
                };
            case 'caption':
                return {
                    fontFamily: typography.family.sans,
                    fontSize: 12,
                    lineHeight: 16,
                };
            case 'link':
                return {
                    fontFamily: typography.family.sansSemiBold,
                    fontSize: 16,
                    lineHeight: 24,
                    color: colors.primary,
                };
            case 'devanagari':
                return {
                    fontFamily: typography.family.devanagari,
                    fontSize: 18,
                    lineHeight: 28,
                }
            default:
                return {
                    fontFamily: typography.family.sans,
                    fontSize: 16,
                    lineHeight: 24,
                };
        }
    }

    const { fontFamily, fontSize, lineHeight, color: defaultColor } = getStyleParams();

    return (
        <Text
            style={[
                {
                    fontFamily,
                    fontSize,
                    lineHeight,
                    color: color || defaultColor || colors.foreground,
                },
                style,
            ]}
            {...rest}
        />
    );
}
