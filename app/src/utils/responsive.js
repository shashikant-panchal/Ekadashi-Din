import { Dimensions, PixelRatio } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro or similar standard device)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Normalizes font size based on screen width to ensure consistent sizing across devices
 * This prevents text from appearing too large on high-density screens
 * @param {number} size - The base font size
 * @returns {number} - Normalized font size
 */
export const normalize = (size) => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size * scale;

    // Round to nearest pixel to avoid sub-pixel rendering issues
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Alternative normalization that's more conservative
 * Uses a scaling factor that prevents extreme size changes
 * @param {number} size - The base font size
 * @param {string} based - 'width' or 'height' for scaling basis
 * @returns {number} - Normalized font size
 */
export const moderateScale = (size, factor = 0.5) => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    return Math.round(size + (scale - 1) * size * factor);
};

/**
 * Scale based on screen width percentage
 * @param {number} percentage - Percentage of screen width
 * @returns {number} - Calculated width
 */
export const widthPercentage = (percentage) => {
    return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * Scale based on screen height percentage
 * @param {number} percentage - Percentage of screen height
 * @returns {number} - Calculated height
 */
export const heightPercentage = (percentage) => {
    return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Get responsive font size with device-specific limits
 * This is the recommended method for most text
 */
export const responsiveFontSize = (size) => {
    // Calculate scale factor
    const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);

    // Apply scale with moderate factor to prevent extreme changes
    const newSize = size * (1 + (scale - 1) * 0.3);

    // Ensure minimum readability
    const minSize = size * 0.85; // Don't go below 85% of original
    const maxSize = size * 1.25; // Don't go above 125% of original

    const scaledSize = Math.max(minSize, Math.min(maxSize, newSize));

    return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

// Export screen dimensions for convenience
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;
