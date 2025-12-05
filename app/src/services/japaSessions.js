import { supabase } from '../utils/supabase';

/**
 * Service for managing Japa sessions with Supabase
 * Tracks daily japa practice, rounds completed, and streaks
 */

/**
 * Fetch today's japa session for the current user
 * @param {string} userId - User ID from auth
 * @returns {Promise<Object|null>} Today's session or null
 */
export const fetchTodaySession = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('japa_sessions')
            .select('*')
            .eq('user_id', userId)
            .eq('date', today)
            .maybeSingle();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching today session:', error);
        throw error;
    }
};

/**
 * Fetch recent japa sessions for streak and stats calculation
 * @param {string} userId - User ID from auth
 * @param {number} limit - Number of sessions to fetch (default 30)
 * @returns {Promise<Array>} Array of recent sessions
 */
export const fetchRecentSessions = async (userId, limit = 30) => {
    try {
        const { data, error } = await supabase
            .from('japa_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw error;
    }
};

/**
 * Calculate statistics from session data
 * @param {Array} sessions - Array of japa sessions
 * @returns {Object} Stats object with totalRounds, currentStreak, etc.
 */
export const calculateStats = (sessions) => {
    if (!sessions || sessions.length === 0) {
        return {
            totalRounds: 0,
            currentStreak: 0,
            longestStreak: 0,
            averageRounds: 0,
            totalSessions: 0
        };
    }

    const totalRounds = sessions.reduce((sum, s) => sum + (s.completed_rounds || 0), 0);
    const totalSessions = sessions.length;
    const averageRounds = totalSessions > 0 ? totalRounds / totalSessions : 0;

    // Calculate current streak
    let currentStreak = 0;
    const sortedSessions = [...sessions].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const session of sortedSessions) {
        if (session.completed_rounds > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    // Calculate longest streak (simplified - just use current for now)
    const longestStreak = currentStreak;

    return {
        totalRounds,
        currentStreak,
        longestStreak,
        averageRounds: Math.round(averageRounds),
        totalSessions
    };
};

/**
 * Start a new japa session or update existing one
 * @param {string} userId - User ID from auth
 * @returns {Promise<Object>} Created or updated session
 */
export const startSession = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const existingSession = await fetchTodaySession(userId);

        if (existingSession) {
            // Update existing session with start time if not already set
            if (!existingSession.start_time) {
                const { data, error } = await supabase
                    .from('japa_sessions')
                    .update({
                        start_time: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingSession.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            }
            return existingSession;
        } else {
            // Create new session
            const { data, error } = await supabase
                .from('japa_sessions')
                .insert({
                    user_id: userId,
                    date: today,
                    completed_rounds: 0,
                    target_rounds: 16,
                    start_time: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Error starting session:', error);
        throw error;
    }
};

/**
 * Complete a round of japa
 * @param {string} userId - User ID from auth
 * @returns {Promise<Object>} Updated session
 */
export const completeRound = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        let session = await fetchTodaySession(userId);

        if (!session) {
            // Create session if it doesn't exist
            session = await startSession(userId);
        }

        const { data, error } = await supabase
            .from('japa_sessions')
            .update({
                completed_rounds: (session.completed_rounds || 0) + 1,
                updated_at: new Date().toISOString()
            })
            .eq('id', session.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error completing round:', error);
        throw error;
    }
};

/**
 * End the japa session with final duration
 * @param {string} userId - User ID from auth
 * @param {string} notes - Optional notes about the session
 * @returns {Promise<Object>} Updated session
 */
export const endSession = async (userId, notes = null) => {
    try {
        const session = await fetchTodaySession(userId);
        if (!session) {
            throw new Error('No active session found');
        }

        const startTime = session.start_time ? new Date(session.start_time) : new Date();
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

        const { data, error } = await supabase
            .from('japa_sessions')
            .update({
                end_time: endTime.toISOString(),
                session_duration: duration,
                notes: notes,
                updated_at: new Date().toISOString()
            })
            .eq('id', session.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error ending session:', error);
        throw error;
    }
};

/**
 * Reset today's japa session
 * @param {string} userId - User ID from auth
 * @returns {Promise<Object>} Reset session
 */
export const resetSession = async (userId) => {
    try {
        const session = await fetchTodaySession(userId);
        if (!session) {
            return null;
        }

        const { data, error } = await supabase
            .from('japa_sessions')
            .update({
                completed_rounds: 0,
                start_time: null,
                end_time: null,
                session_duration: null,
                notes: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', session.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error resetting session:', error);
        throw error;
    }
};
