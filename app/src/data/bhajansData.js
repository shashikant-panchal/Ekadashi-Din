// Bhajans and Mantras data - synced with web version
export const bhajansList = [
  {
    id: 1,
    name: "Hare Krishna Mahamantra",
    sanskrit: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे\nहरे राम हरे राम राम राम हरे हरे",
    transliteration: "Hare Krishna Hare Krishna Krishna Krishna Hare Hare\nHare Rama Hare Rama Rama Rama Hare Hare",
    description: "The most powerful mantra for spiritual purification and divine connection",
    url: "https://soundcloud.com/thebhaktas/hare-krishna",
    type: "mantra",
    duration: "10:00",
    artist: "Various Artists"
  },
  {
    id: 2,
    name: "Ekadashi Vrata Katha",
    sanskrit: "",
    transliteration: "",
    description: "Sacred stories and kirtans dedicated to Ekadashi observance",
    url: "https://soundcloud.com/aindra-das-497468581/10-01-10-ekadasi-kirtan_1",
    type: "kirtan",
    duration: "15:30",
    artist: "Aindra Das"
  },
  {
    id: 3,
    name: "Om Namo Bhagavate Vasudevaya",
    sanskrit: "ॐ नमो भगवते वासुदेवाय",
    transliteration: "Om Namo Bhagavate Vasudevaya",
    description: "A powerful mantra for surrendering to Lord Krishna",
    url: "https://soundcloud.com/krishna-bhakti-network/om-namo-bhagavate-vasudevaya-atmarama-dasa",
    type: "mantra",
    duration: "12:45",
    artist: "Atmarama Das"
  },
  {
    id: 4,
    name: "Govinda Jaya Jaya",
    sanskrit: "गोविन्द जय जय गोपाल जय जय",
    transliteration: "Govinda Jaya Jaya Gopala Jaya Jaya",
    description: "Celebrating the glories of Lord Krishna as Govinda and Gopala",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder - replace with actual URL
    type: "bhajan",
    duration: "8:20",
    artist: "Various Artists"
  },
  {
    id: 5,
    name: "Radhe Radhe",
    sanskrit: "राधे राधे",
    transliteration: "Radhe Radhe",
    description: "Chanting the holy name of Srimati Radharani",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder - replace with actual URL
    type: "bhajan",
    duration: "9:15",
    artist: "Various Artists"
  },
  {
    id: 6,
    name: "Jaya Radha Madhava",
    sanskrit: "जय राधा माधव",
    transliteration: "Jaya Radha Madhava",
    description: "Glories of the divine couple Radha and Krishna",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder - replace with actual URL
    type: "bhajan",
    duration: "11:30",
    artist: "Various Artists"
  }
];

export const mantrasList = [
  {
    id: 1,
    name: "Hare Krishna Mahamantra",
    sanskrit: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे\nहरे राम हरे राम राम राम हरे हरे",
    transliteration: "Hare Krishna Hare Krishna Krishna Krishna Hare Hare\nHare Rama Hare Rama Rama Rama Hare Hare",
    meaning: "O Lord, O Energy of the Lord, please engage me in Your service",
    benefits: "Purifies consciousness, removes material desires, brings spiritual happiness"
  },
  {
    id: 2,
    name: "Om Namo Bhagavate Vasudevaya",
    sanskrit: "ॐ नमो भगवते वासुदेवाय",
    transliteration: "Om Namo Bhagavate Vasudevaya",
    meaning: "I offer my respectful obeisances unto Lord Krishna, the son of Vasudeva",
    benefits: "Surrenders to the Supreme Lord, removes obstacles, grants protection"
  },
  {
    id: 3,
    name: "Om Namo Narayanaya",
    sanskrit: "ॐ नमो नारायणाय",
    transliteration: "Om Namo Narayanaya",
    meaning: "I offer my respectful obeisances to Lord Narayana",
    benefits: "Attains peace, spiritual advancement, divine protection"
  }
];

export function getBhajanById(id) {
  return bhajansList.find(bhajan => bhajan.id === id);
}

export function getBhajansByType(type) {
  return bhajansList.filter(bhajan => bhajan.type === type);
}

export function getAllBhajans() {
  return bhajansList;
}

