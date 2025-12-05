import moment from 'moment';
import { ekadashiData2025 } from './ekadashiData';

export const getMoonPhasesByMonth = (month) => {
    // Ekadashi is roughly 11th tithi. 
    // Purnima (Full Moon) is roughly 4 days after Shukla Paksha Ekadashi.
    // Amavasya (New Moon) is roughly 4 days after Krishna Paksha Ekadashi.

    const ekadashis = ekadashiData2025.filter(e => e.date.getMonth() === month);
    const phases = [];

    ekadashis.forEach(ekadashi => {
        const ekadashiDate = moment(ekadashi.date);

        if (ekadashi.paksha === 'Shukla') {
            const purnimaDate = ekadashiDate.clone().add(4, 'days');
            // Verify if still in same month, or if it crosses over (which is fine, but we categorize by date)
            if (purnimaDate.month() === month) {
                phases.push({
                    name: `${ekadashi.month} Purnima`,
                    date: purnimaDate,
                    type: 'Purnima',
                    phase: 'full'
                });
            }
        } else if (ekadashi.paksha === 'Krishna') {
            const amavasyaDate = ekadashiDate.clone().add(4, 'days');
            if (amavasyaDate.month() === month) {
                phases.push({
                    name: `${ekadashi.month} Amavasya`,
                    date: amavasyaDate,
                    type: 'Amavasya',
                    phase: 'new'
                });
            }
        }
    });

    return phases.sort((a, b) => a.date - b.date);
};
