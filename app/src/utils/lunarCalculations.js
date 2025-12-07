// Lunar phase calculations - matches web version
// Verified Full Moon (Purnima) and New Moon (Amavasya) dates

const FULL_MOON_DATES_2024 = [
    new Date(2024, 0, 25),   // January 25
    new Date(2024, 1, 24),   // February 24
    new Date(2024, 2, 25),   // March 25
    new Date(2024, 3, 23),   // April 23
    new Date(2024, 4, 23),   // May 23
    new Date(2024, 5, 22),   // June 22
    new Date(2024, 6, 21),   // July 21
    new Date(2024, 7, 19),   // August 19
    new Date(2024, 8, 18),   // September 18
    new Date(2024, 9, 17),   // October 17
    new Date(2024, 10, 15),  // November 15
    new Date(2024, 11, 15),  // December 15
];

const FULL_MOON_DATES_2025 = [
    new Date(2025, 0, 13),   // January 13
    new Date(2025, 1, 12),   // February 12
    new Date(2025, 2, 14),   // March 14
    new Date(2025, 3, 13),   // April 13
    new Date(2025, 4, 12),   // May 12
    new Date(2025, 5, 11),   // June 11
    new Date(2025, 6, 10),   // July 10
    new Date(2025, 7, 9),    // August 9
    new Date(2025, 8, 7),    // September 7
    new Date(2025, 9, 7),    // October 7
    new Date(2025, 10, 5),   // November 5
    new Date(2025, 11, 4),   // December 4
];

const FULL_MOON_DATES_2026 = [
    new Date(2026, 0, 3),    // January 3
    new Date(2026, 1, 1),    // February 1
    new Date(2026, 2, 3),    // March 3
    new Date(2026, 3, 2),    // April 2
    new Date(2026, 4, 1),    // May 1
    new Date(2026, 4, 31),   // May 31
    new Date(2026, 5, 29),   // June 29
    new Date(2026, 6, 29),   // July 29
    new Date(2026, 7, 28),   // August 28
    new Date(2026, 8, 26),   // September 26
    new Date(2026, 9, 26),   // October 26
    new Date(2026, 10, 24),  // November 24
    new Date(2026, 11, 24),  // December 24
];

const NEW_MOON_DATES_2024 = [
    new Date(2024, 0, 11),   // January 11
    new Date(2024, 1, 9),    // February 9
    new Date(2024, 2, 10),   // March 10
    new Date(2024, 3, 8),    // April 8
    new Date(2024, 4, 8),    // May 8
    new Date(2024, 5, 6),    // June 6
    new Date(2024, 6, 5),    // July 5
    new Date(2024, 7, 4),    // August 4
    new Date(2024, 8, 3),    // September 3
    new Date(2024, 9, 2),    // October 2
    new Date(2024, 10, 1),   // November 1
    new Date(2024, 11, 1),   // December 1
    new Date(2024, 11, 30),  // December 30
];

const NEW_MOON_DATES_2025 = [
    new Date(2025, 0, 29),   // January 29
    new Date(2025, 1, 28),   // February 28
    new Date(2025, 2, 29),   // March 29
    new Date(2025, 3, 27),   // April 27
    new Date(2025, 4, 27),   // May 27
    new Date(2025, 5, 25),   // June 25
    new Date(2025, 6, 24),   // July 24
    new Date(2025, 7, 23),   // August 23
    new Date(2025, 8, 21),   // September 21
    new Date(2025, 9, 21),   // October 21
    new Date(2025, 10, 20),  // November 20
    new Date(2025, 11, 20),  // December 20
];

const NEW_MOON_DATES_2026 = [
    new Date(2026, 0, 18),   // January 18
    new Date(2026, 1, 17),   // February 17
    new Date(2026, 2, 19),   // March 19
    new Date(2026, 3, 17),   // April 17
    new Date(2026, 4, 16),   // May 16
    new Date(2026, 5, 15),   // June 15
    new Date(2026, 6, 14),   // July 14
    new Date(2026, 7, 12),   // August 12
    new Date(2026, 8, 11),   // September 11
    new Date(2026, 9, 10),   // October 10
    new Date(2026, 10, 9),   // November 9
    new Date(2026, 11, 9),   // December 9
];

// Hindu month names
const hinduMonthNames = [
    'Pausha', 'Magha', 'Phalguna', 'Chaitra', 'Vaishakha', 'Jyeshtha',
    'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwin', 'Kartik', 'Margashirsha'
];

function getHinduMonthName(month) {
    // Approximate mapping - Hindu months roughly start mid-Gregorian month
    return hinduMonthNames[(month + 10) % 12];
}

function getFullMoonsForYear(year) {
    switch (year) {
        case 2024: return FULL_MOON_DATES_2024;
        case 2025: return FULL_MOON_DATES_2025;
        case 2026: return FULL_MOON_DATES_2026;
        default:
            // For other years, calculate approximate dates
            const baseYear = 2025;
            const baseMoons = FULL_MOON_DATES_2025;
            const yearDiff = year - baseYear;
            return baseMoons.map(d => {
                const newDate = new Date(d);
                newDate.setFullYear(newDate.getFullYear() + yearDiff);
                return newDate;
            });
    }
}

function getNewMoonsForYear(year) {
    switch (year) {
        case 2024: return NEW_MOON_DATES_2024;
        case 2025: return NEW_MOON_DATES_2025;
        case 2026: return NEW_MOON_DATES_2026;
        default:
            const baseYear = 2025;
            const baseMoons = NEW_MOON_DATES_2025;
            const yearDiff = year - baseYear;
            return baseMoons.map(d => {
                const newDate = new Date(d);
                newDate.setFullYear(newDate.getFullYear() + yearDiff);
                return newDate;
            });
    }
}

// Get all full moons in a year
export function getFullMoonsInYear(year) {
    return getFullMoonsForYear(year);
}

// Get all new moons in a year
export function getNewMoonsInYear(year) {
    return getNewMoonsForYear(year);
}

// Get lunar days for a specific month
export function getLunarDaysInMonth(month, year) {
    const lunarDays = [];
    
    const fullMoons = getFullMoonsForYear(year);
    const newMoons = getNewMoonsForYear(year);
    
    fullMoons.filter(d => d.getMonth() === month).forEach(d => {
        lunarDays.push({
            date: d,
            type: 'purnima',
            name: `${getHinduMonthName(d.getMonth())} Purnima`
        });
    });
    
    newMoons.filter(d => d.getMonth() === month).forEach(d => {
        lunarDays.push({
            date: d,
            type: 'amavasya',
            name: `${getHinduMonthName(d.getMonth())} Amavasya`
        });
    });
    
    return lunarDays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

