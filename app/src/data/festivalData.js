export const festivalData2025 = [
    // January
    { name: "Makar Sankranti", date: new Date(2025, 0, 14), deity: "Surya", type: "major" },
    { name: "Pongal", date: new Date(2025, 0, 14), deity: "Surya", type: "regional" },

    // February
    { name: "Vasant Panchami", date: new Date(2025, 1, 2), deity: "Saraswati", type: "major" },
    { name: "Maha Shivaratri", date: new Date(2025, 1, 26), deity: "Shiva", type: "major" },

    // March
    { name: "Holi", date: new Date(2025, 2, 14), deity: "Krishna", type: "major" },

    // April
    { name: "Rama Navami", date: new Date(2025, 3, 6), deity: "Rama", type: "major" },
    { name: "Hanuman Jayanti", date: new Date(2025, 3, 12), deity: "Hanuman", type: "major" },

    // May
    { name: "Akshaya Tritiya", date: new Date(2025, 4, 1), deity: "Laxmi", type: "major" },

    // July
    { name: "Guru Purnima", date: new Date(2025, 6, 10), deity: "Guru", type: "major" },

    // August
    { name: "Raksha Bandhan", date: new Date(2025, 7, 9), deity: "Krishna", type: "major" },
    { name: "Janmashtami", date: new Date(2025, 7, 16), deity: "Krishna", type: "major" },
    { name: "Ganesh Chaturthi", date: new Date(2025, 7, 27), deity: "Ganesha", type: "major" },

    // October
    { name: "Navaratri Begins", date: new Date(2025, 8, 22), deity: "Durga", type: "major" },
    { name: "Dussehra", date: new Date(2025, 9, 2), deity: "Rama", type: "major" },
    { name: "Diwali", date: new Date(2025, 9, 20), deity: "Laxmi", type: "major" },

    // November
    { name: "Govardhan Puja", date: new Date(2025, 9, 22), deity: "Krishna", type: "major" },

    // December
    { name: "Gita Jayanti", date: new Date(2025, 11, 30), deity: "Krishna", type: "major" },
    { name: "Chhath Puja", date: new Date(2025, 11, 26), deity: "Surya", type: "regional" } // Placeholder date matching screenshot
];

export const getFestivalsByMonth = (month) => {
    return festivalData2025.filter(f => f.date.getMonth() === month);
};
