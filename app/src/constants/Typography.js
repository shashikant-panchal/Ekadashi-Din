export const Typography = {
    // Font Families
    family: {
        sans: 'Nunito-Regular',
        sansBold: 'Nunito-Bold',
        sansSemiBold: 'Nunito-SemiBold',
        inter: 'Inter-Regular',
        interBold: 'Inter-Bold',
        interSemiBold: 'Inter-SemiBold',
        devanagari: 'NotoSansDevanagari-Regular',
        devanagariBold: 'NotoSansDevanagari-Bold',
        devanagariSemiBold: 'NotoSansDevanagari-SemiBold',
    },

    // Font Weights (React Native uses strings '400', '700' etc if not part of family name, but here we can map to family names primarily)
    weight: {
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
    },

    // Font Sizes (mapped from Tailwind/Web standards)
    size: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    // Line Heights
    lineHeight: {
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
    },
};

export default Typography;
