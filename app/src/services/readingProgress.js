import { supabase } from '../utils/supabase';

/**
 * Service for managing reading progress with Supabase
 * Tracks Bhagavad Gita verse reading, chapter completion, and streaks
 */

// Chapter data matching the web version
const chapterData = [
    { number: 1, title: "Arjuna's Dilemma", verses: 47 },
    { number: 2, title: "Sankya Yoga", verses: 72 },
    { number: 3, title: "Karma Yoga", verses: 43 },
    { number: 4, title: "Jnana Yoga", verses: 42 },
    { number: 5, title: "Karma-Sannyasa Yoga", verses: 29 },
    { number: 6, title: "Dhyana Yoga", verses: 47 },
    { number: 7, title: "Jnana-Vijnana Yoga", verses: 30 },
    { number: 8, title: "Aksara-Brahma Yoga", verses: 28 },
    { number: 9, title: "Raja-Vidya-Raja-Guhya Yoga", verses: 34 },
    { number: 10, title: "Vibhuti Yoga", verses: 42 },
    { number: 11, title: "Visvarupa-Darsana Yoga", verses: 55 },
    { number: 12, title: "Bhakti Yoga", verses: 20 },
    { number: 13, title: "Ksetra-Ksetrajna Vibhaga Yoga", verses: 35 },
    { number: 14, title: "Gunatraya-Vibhaga Yoga", verses: 27 },
    { number: 15, title: "Purusottama Yoga", verses: 20 },
    { number: 16, title: "Daivasura-Sampad-Vibhaga Yoga", verses: 24 },
    { number: 17, title: "Sraddhatraya-Vibhaga Yoga", verses: 28 },
    { number: 18, title: "Moksa-Sannyasa Yoga", verses: 78 }
];

/**
 * Get today's verse using the same algorithm as web
 * @returns {Object} Chapter and verse numbers for today
 */
export const getTodaysVerse = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

    // Cycle through chapters based on day of year
    const chapterIndex = (dayOfYear - 1) % chapterData.length;
    const chapter = chapterData[chapterIndex];
    const verseIndex = Math.floor(Math.random() * chapter.verses) + 1;

    return {
        chapter: chapter.number,
        verse: verseIndex,
        chapterTitle: chapter.title
    };
};

/**
 * Fetch all reading progress for a user
 * @param {string} userId - User ID from auth
 * @returns {Promise<Array>} Array of reading progress records
 */
export const fetchReadingProgress = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('reading_progress')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching reading progress:', error);
        // Return empty array if table doesn't exist yet
        return [];
    }
};

/**
 * Calculate chapter progress from reading data
 * @param {Array} progressData - Array of reading progress records
 * @returns {Array} Chapter progress with completion status
 */
export const calculateChapterProgress = (progressData) => {
    const chapters = chapterData.map(chapter => {
        const chapterReadings = progressData.filter(p =>
            p.chapter_number === chapter.number && p.completed_verse
        );

        const completedVerses = new Set(chapterReadings.map(p => p.verse_number)).size;

        return {
            chapter: chapter.number,
            title: chapter.title,
            totalVerses: chapter.verses,
            completedVerses,
            isCompleted: completedVerses >= chapter.verses
        };
    });

    return chapters;
};

/**
 * Calculate reading statistics
 * @param {Array} progressData - Array of reading progress records
 * @param {Array} chapterProgress - Chapter progress data
 * @returns {Object} Reading stats
 */
export const calculateReadingStats = (progressData, chapterProgress) => {
    const totalVersesRead = new Set(
        progressData
            .filter(p => p.completed_verse)
            .map(p => `${p.chapter_number}-${p.verse_number}`)
    ).size;

    const chaptersCompleted = chapterProgress.filter(c => c.isCompleted).length;

    const totalReadingTime = progressData.reduce((sum, p) => sum + (p.reading_duration || 0), 0);
    const averageReadingTime = progressData.length > 0 ? totalReadingTime / progressData.length : 0;

    // Calculate current streak (simplified)
    let currentStreak = 0;
    const sortedDates = [...new Set(progressData.map(p => p.date))].sort().reverse();

    for (const date of sortedDates) {
        const dayReadings = progressData.filter(p => p.date === date && p.completed_verse);
        if (dayReadings.length > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    return {
        totalVersesRead,
        chaptersCompleted,
        currentStreak,
        totalReadingTime,
        averageReadingTime: Math.round(averageReadingTime)
    };
};

/**
 * Mark a verse as complete
 * @param {string} userId - User ID from auth
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @param {number} readingDuration - Optional reading duration in seconds
 * @returns {Promise<Object>} Created progress record
 */
export const markVerseComplete = async (userId, chapter, verse, readingDuration = null) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Check if already marked as complete today
        const { data: existing } = await supabase
            .from('reading_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('date', today)
            .eq('chapter_number', chapter)
            .eq('verse_number', verse)
            .maybeSingle();

        if (existing && existing.completed_verse) {
            // Already marked as read today - return with already_read flag
            return { ...existing, already_read: true };
        } else if (existing) {
            // Update existing record
            const { data, error } = await supabase
                .from('reading_progress')
                .update({
                    completed_verse: true,
                    reading_duration: readingDuration,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            return { ...data, already_read: false };
        } else {
            // Create new record
            const { data, error } = await supabase
                .from('reading_progress')
                .insert({
                    user_id: userId,
                    date: today,
                    chapter_number: chapter,
                    verse_number: verse,
                    completed_verse: true,
                    completed_purport: false,
                    reading_duration: readingDuration
                })
                .select()
                .single();

            if (error) throw error;
            return { ...data, already_read: false };
        }
    } catch (error) {
        console.error('Error marking verse complete:', error);
        throw error;
    }
};

/**
 * Mark purport as complete
 * @param {string} userId - User ID from auth
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @returns {Promise<Object>} Updated progress record
 */
export const markPurportComplete = async (userId, chapter, verse) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const { data: existing } = await supabase
            .from('reading_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('date', today)
            .eq('chapter_number', chapter)
            .eq('verse_number', verse)
            .maybeSingle();

        if (existing) {
            const { data, error } = await supabase
                .from('reading_progress')
                .update({
                    completed_purport: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        }

        return null;
    } catch (error) {
        console.error('Error marking purport complete:', error);
        throw error;
    }
};
