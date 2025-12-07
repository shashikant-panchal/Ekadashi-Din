import axios from "axios";

/**
 * Service for fetching Bhagavad Gita verses
 * Uses bhagavadgitaapi.in API with backup API support
 * Matches web version implementation
 */

// Primary API
const BHAGAVAD_GITA_API_BASE = "https://bhagavadgitaapi.in/api/v1";
// Backup API
const BACKUP_API_BASE = "https://vedicscriptures.github.io/slok";

// Chapter verse counts for generating all verses
const chapterVerseCounts = {
  1: 47,
  2: 72,
  3: 43,
  4: 42,
  5: 29,
  6: 47,
  7: 30,
  8: 28,
  9: 34,
  10: 42,
  11: 55,
  12: 20,
  13: 35,
  14: 27,
  15: 20,
  16: 24,
  17: 28,
  18: 78,
};

// Cache for API responses
const verseCache = new Map();
const chapterCache = new Map();

// Chapter data with accurate verse counts (matching web version)
export const CHAPTER_DATA = [
  {
    chapter: 1,
    title: "Arjuna Vishada Yoga",
    totalVerses: 47,
    sanskritTitle: "अर्जुनविषादयोग",
  },
  {
    chapter: 2,
    title: "Sankhya Yoga",
    totalVerses: 72,
    sanskritTitle: "सांख्ययोग",
  },
  {
    chapter: 3,
    title: "Karma Yoga",
    totalVerses: 43,
    sanskritTitle: "कर्मयोग",
  },
  {
    chapter: 4,
    title: "Jnana Karma Sanyasa Yoga",
    totalVerses: 42,
    sanskritTitle: "ज्ञानकर्मसंन्यासयोग",
  },
  {
    chapter: 5,
    title: "Karma Sanyasa Yoga",
    totalVerses: 29,
    sanskritTitle: "कर्मसंन्यासयोग",
  },
  {
    chapter: 6,
    title: "Dhyana Yoga",
    totalVerses: 47,
    sanskritTitle: "ध्यानयोग",
  },
  {
    chapter: 7,
    title: "Jnana Vijnana Yoga",
    totalVerses: 30,
    sanskritTitle: "ज्ञानविज्ञानयोग",
  },
  {
    chapter: 8,
    title: "Aksara Brahma Yoga",
    totalVerses: 28,
    sanskritTitle: "अक्षरब्रह्मयोग",
  },
  {
    chapter: 9,
    title: "Raja Vidya Raja Guhya Yoga",
    totalVerses: 34,
    sanskritTitle: "राजविद्याराजगुह्ययोग",
  },
  {
    chapter: 10,
    title: "Vibhuti Yoga",
    totalVerses: 42,
    sanskritTitle: "विभूतियोग",
  },
  {
    chapter: 11,
    title: "Vishvarupa Darshana Yoga",
    totalVerses: 55,
    sanskritTitle: "विश्वरूपदर्शनयोग",
  },
  {
    chapter: 12,
    title: "Bhakti Yoga",
    totalVerses: 20,
    sanskritTitle: "भक्तियोग",
  },
  {
    chapter: 13,
    title: "Kshetra Kshetrajna Vibhaga Yoga",
    totalVerses: 35,
    sanskritTitle: "क्षेत्रक्षेत्रज्ञविभागयोग",
  },
  {
    chapter: 14,
    title: "Gunatraya Vibhaga Yoga",
    totalVerses: 27,
    sanskritTitle: "गुणत्रयविभागयोग",
  },
  {
    chapter: 15,
    title: "Purushottama Yoga",
    totalVerses: 20,
    sanskritTitle: "पुरुषोत्तमयोग",
  },
  {
    chapter: 16,
    title: "Daivasura Sampad Vibhaga Yoga",
    totalVerses: 24,
    sanskritTitle: "दैवासुरसम्पद्विभागयोग",
  },
  {
    chapter: 17,
    title: "Shraddhatraya Vibhaga Yoga",
    totalVerses: 28,
    sanskritTitle: "श्रद्धात्रयविभागयोग",
  },
  {
    chapter: 18,
    title: "Moksha Sanyasa Yoga",
    totalVerses: 78,
    sanskritTitle: "मोक्षसंन्यासयोग",
  },
];

// Famous verses with full content for better fallback
const famousVerses = {
  1: {
    1: {
      sanskrit:
        "धृतराष्ट्र उवाच |\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः |\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||१-१||",
      transliteration:
        "dhṛtarāṣṭra uvāca |\ndharmakṣetre kurukṣetre samavetā yuyutsavaḥ |\nmāmakāḥ pāṇḍavāścaiva kimakurvata sañjaya ||1-1||",
      translation:
        "Dhritarashtra said: O Sanjaya, what did my sons and the sons of Pandu do when they assembled on the holy field of Kurukshetra, eager to fight?",
      significance:
        "This verse sets the stage for the entire Bhagavad Gita. King Dhritarashtra, blind and anxious, asks his minister Sanjaya about the battle between his sons (Kauravas) and his nephews (Pandavas).",
    },
    2: {
      sanskrit:
        "सञ्जय उवाच |\nदृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा |\nआचार्यमुपसङ्गम्य राजा वचनमब्रवीत् ||१-२||",
      transliteration:
        "sañjaya uvāca |\ndṛṣṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanastadā |\nācāryamupasaṅgamya rājā vacanamabravīt ||1-2||",
      translation:
        "Sanjaya said: Having seen the army of the Pandavas drawn up in battle array, King Duryodhana approached his teacher Drona and spoke these words.",
      significance:
        "Duryodhana, seeing the powerful army of the Pandavas, becomes concerned and seeks counsel from his teacher Dronacharya.",
    },
    3: {
      sanskrit:
        "पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम् |\nव्यूढां द्रुपदपुत्रेण तव शिष्येण धीमता ||१-३||",
      transliteration:
        "paśyaitāṁ pāṇḍuputrāṇām ācārya mahatīṁ camūm |\nvyūḍhāṁ drupadaputreṇa tava śiṣyeṇa dhīmatā ||1-3||",
      translation:
        "Behold, O teacher, this mighty army of the sons of Pandu, arrayed for battle by your intelligent disciple, the son of Drupada.",
      significance:
        "Duryodhana reminds Dronacharya that Dhrishtadyumna, the son of Drupada and a former student of Drona, now leads the enemy army.",
    },
  },
  2: {
    47: {
      sanskrit:
        "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||२-४७||",
      transliteration:
        "karmaṇy evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||2-47||",
      translation:
        "You have a right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
      significance:
        "This is perhaps the most famous verse of the Bhagavad Gita. It teaches the essence of Karma Yoga - performing one's duty without attachment to results.",
    },
    48: {
      sanskrit:
        "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय |\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ||२-४८||",
      transliteration:
        "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate ||2-48||",
      translation:
        "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.",
      significance:
        "This verse defines yoga as equanimity of mind - remaining balanced in both success and failure while performing one's duties.",
    },
  },
  4: {
    7: {
      sanskrit:
        "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत |\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ||४-७||",
      transliteration:
        "yadā yadā hi dharmasya glānir bhavati bhārata |\nabhyutthānam adharmasya tadātmānaṁ sṛjāmy aham ||4-7||",
      translation:
        "Whenever there is a decline in righteousness (dharma) and an increase in unrighteousness (adharma), O Arjuna, at that time I manifest Myself on earth.",
      significance:
        "Lord Krishna explains the divine purpose of His incarnations - to restore dharma whenever it declines and protect the righteous.",
    },
    8: {
      sanskrit:
        "परित्राणाय साधूनां विनाशाय च दुष्कृताम् |\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ||४-८||",
      transliteration:
        "paritrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām |\ndharma-saṁsthāpanārthāya sambhavāmi yuge yuge ||4-8||",
      translation:
        "For the protection of the righteous, for the destruction of the wicked, and for the establishment of dharma, I appear in every age.",
      significance:
        "This verse continues the previous one, explaining the threefold purpose of divine incarnation.",
    },
  },
  18: {
    65: {
      sanskrit:
        "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु |\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे ||१८-६५||",
      transliteration:
        "man-manā bhava mad-bhakto mad-yājī māṁ namaskuru |\nmām evaiṣyasi satyaṁ te pratijāne priyo 'si me ||18-65||",
      translation:
        "Always think of Me, become My devotee, worship Me and offer your homage unto Me. Thus you will come to Me without fail. I promise you this because you are My very dear friend.",
      significance:
        "Krishna gives the essence of devotional service - to always think of the Lord and surrender unto Him.",
    },
    66: {
      sanskrit:
        "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज |\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ||१८-६६||",
      transliteration:
        "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja |\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||18-66||",
      translation:
        "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
      significance:
        "This is the final and most confidential instruction of the Bhagavad Gita - complete surrender to the Supreme Lord.",
    },
  },
};

/**
 * Fetch verse from backup API (vedicscriptures.github.io/slok/{chapter}/{verse})
 * Matches web version implementation exactly
 * @param {number} chapterNumber - Chapter number (1-18)
 * @param {number} verseNumber - Verse number
 * @returns {Promise<Object|null>} Verse object or null
 */
const fetchVerseFromBackup = async (chapterNumber, verseNumber) => {
  try {
    // API format: https://vedicscriptures.github.io/slok/{chapter}/{verse}
    // Example: https://vedicscriptures.github.io/slok/1/1/ or https://vedicscriptures.github.io/slok/1/34/
    const url = `${BACKUP_API_BASE}/${chapterNumber}/${verseNumber}`;
    console.log(`Fetching from backup API: ${url}`);
    
    const response = await axios.get(
      url,
      { 
        timeout: 10000, // Increased timeout for backup API
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.data || !response.status || response.status !== 200) {
      console.log(`Backup API returned invalid response for ${chapterNumber}.${verseNumber}`);
      return null;
    }

    const data = response.data;
    console.log(`Backup API response received for ${chapterNumber}.${verseNumber}:`, {
      hasSlok: !!data.slok,
      hasTransliteration: !!data.transliteration,
      hasPurohit: !!data.purohit?.et,
      hasAdi: !!data.adi?.et,
      hasRams: !!data.rams?.hc,
    });

    // Get English translation from available translators (matching web version)
    // Priority: purohit > adi > siva > san > gambir > prabhu > spitr
    // Based on actual API response structure
    const englishTranslation =
      data.purohit?.et ||
      data.adi?.et ||
      data.siva?.et ||
      data.san?.et ||
      data.gambir?.et ||
      data.prabhu?.et ||
      data.spitr?.et ||
      data.raman?.et ||
      "Translation not available";
    
    // Get significance/commentary (matching web version)
    // Priority: rams > chinmay > chinmpitr
    // Based on actual API response - rams.hc has detailed commentary
    const significance =
      data.rams?.hc ||
      data.chinmay?.hc ||
      data.chinmpitr?.hc ||
      data.rams?.ht || // Hindi translation as fallback
      data.tej?.ht || // Tejomayananda Hindi translation
      "Commentary available in original texts";

    // Return verse in standard format (matching web version structure)
    return {
      verse: verseNumber,
      verse_number: verseNumber, // Also include verse_number for compatibility
      sanskrit: data.slok || "",
      text: data.slok || "", // Also include 'text' field for compatibility
      transliteration: data.transliteration || "",
      translation: englishTranslation,
      meaning: englishTranslation, // Also include 'meaning' for compatibility
      significance: significance,
      commentary: significance, // Also include 'commentary' for compatibility
      purport: significance, // Also include 'purport' for compatibility
    };
  } catch (error) {
    console.error(
      `Backup API error for ${chapterNumber}.${verseNumber}:`,
      error.message || error
    );
    return null;
  }
};

/**
 * Check if response is HTML (bot protection page)
 * @param {any} data - Response data to check
 * @returns {boolean} True if HTML
 */
const isHTMLResponse = (data) => {
  if (typeof data === 'string') {
    return data.trim().toLowerCase().startsWith('<!doctype') || 
           data.trim().toLowerCase().startsWith('<html');
  }
  return false;
};

/**
 * Fetch a single verse with caching and backup support
 * @param {number} chapterNumber - Chapter number
 * @param {number} verseNumber - Verse number
 * @returns {Promise<Object|null>} Verse object or null
 */
export const fetchSingleVerse = async (chapterNumber, verseNumber) => {
  const cacheKey = `${chapterNumber}-${verseNumber}`;

  if (verseCache.has(cacheKey)) {
    return verseCache.get(cacheKey);
  }

  try {
    // Try primary API first
    const response = await axios.get(
      `${BHAGAVAD_GITA_API_BASE}/chapters/${chapterNumber}/verses/${verseNumber}`,
      { 
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    // Check if response is HTML (bot protection) or valid JSON
    if (isHTMLResponse(response.data)) {
      console.log(`Primary API returned HTML for ${chapterNumber}.${verseNumber}, using backup API`);
      // Immediately fall back to backup API
      const backupVerse = await fetchVerseFromBackup(chapterNumber, verseNumber);
      if (backupVerse) {
        verseCache.set(cacheKey, backupVerse);
        return backupVerse;
      }
    } else if (response.data && typeof response.data === 'object') {
      // Valid JSON response
      const data = response.data;

      // Transform API response to our format
      const englishTranslation = data.translations?.find(
        (t) => t.language === "english"
      );
      const commentary = data.commentaries?.find(
        (c) => c.language === "english"
      );

      const verse = {
        verse: data.verse_number || verseNumber,
        verse_number: data.verse_number || verseNumber,
        sanskrit: data.text || "",
        text: data.text || "",
        transliteration: data.transliteration || "",
        translation:
          englishTranslation?.description || "Translation not available",
        meaning: englishTranslation?.description || "Translation not available",
        significance:
          commentary?.description ||
          data.word_meanings ||
          "Commentary not available",
        commentary: commentary?.description || data.word_meanings || "Commentary not available",
        purport: commentary?.description || data.word_meanings || "Commentary not available",
      };

      verseCache.set(cacheKey, verse);
      return verse;
    }
  } catch (error) {
    console.error(
      `Primary API error for ${chapterNumber}.${verseNumber}:`,
      error.message || error
    );
  }

  // Try backup API (either primary failed or returned HTML)
  const backupVerse = await fetchVerseFromBackup(chapterNumber, verseNumber);
  if (backupVerse) {
    verseCache.set(cacheKey, backupVerse);
    return backupVerse;
  }

  // Fallback to famous verses if available
  if (famousVerses[chapterNumber]?.[verseNumber]) {
    return { verse: verseNumber, ...famousVerses[chapterNumber][verseNumber] };
  }

  return null;
};

/**
 * Fetch verses in batches for better performance
 * @param {number} chapterNumber - Chapter number
 * @param {number} startVerse - Start verse number
 * @param {number} endVerse - End verse number
 * @returns {Promise<Array>} Array of verse objects
 */
const fetchVerseBatch = async (chapterNumber, startVerse, endVerse) => {
  const promises = [];

  for (let i = startVerse; i <= endVerse; i++) {
    promises.push(fetchSingleVerse(chapterNumber, i));
  }

  const results = await Promise.all(promises);
  return results.filter((v) => v !== null);
};

/**
 * Fetch all verses for a specific chapter with batch processing
 * @param {number} chapterNumber - Chapter number (1-18)
 * @returns {Promise<Array>} Array of verse objects
 */
export const fetchChapterVerses = async (chapterNumber) => {
  try {
    // Get total verses from static data for reliability
    const chapterInfo = CHAPTER_DATA.find((c) => c.chapter === chapterNumber);
    if (!chapterInfo) {
      return generateVersesForChapter(
        chapterNumber,
        chapterVerseCounts[chapterNumber] || 20
      );
    }

    const totalVerses = chapterInfo.totalVerses;
    const BATCH_SIZE = 10;
    const allVerses = [];

    // Fetch in batches for better performance
    for (let start = 1; start <= totalVerses; start += BATCH_SIZE) {
      const end = Math.min(start + BATCH_SIZE - 1, totalVerses);
      const batch = await fetchVerseBatch(chapterNumber, start, end);
      allVerses.push(...batch);
    }

    // Sort by verse number to ensure correct order
    const sortedVerses = allVerses.sort((a, b) => a.verse - b.verse);

    // If we got verses from API, return them
    if (sortedVerses.length > 0) {
      return sortedVerses;
    }
  } catch (error) {
    console.error(`Error fetching verses for chapter ${chapterNumber}:`, error);
  }

  // Fallback to generated verses
  const verseCount = chapterVerseCounts[chapterNumber] || 20;
  return generateVersesForChapter(chapterNumber, verseCount);
};

/**
 * Generate verses for a chapter using famous verses where available
 * @param {number} chapterNumber - Chapter number
 * @param {number} verseCount - Total verses in chapter
 * @returns {Array} Array of verse objects
 */
const generateVersesForChapter = (chapterNumber, verseCount) => {
  const verses = [];
  const chapterFamous = famousVerses[chapterNumber] || {};

  for (let i = 1; i <= verseCount; i++) {
    if (chapterFamous[i]) {
      // Use famous verse content
      verses.push({
        verse: i,
        ...chapterFamous[i],
      });
    } else {
      // Generate placeholder
      verses.push({
        verse: i,
        sanskrit: `॥ अध्याय ${chapterNumber} श्लोक ${i} ॥\nभगवद्गीता का श्लोक`,
        transliteration: `|| adhyāya ${chapterNumber} śloka ${i} ||`,
        translation: `This is verse ${i} of Chapter ${chapterNumber} of the Bhagavad Gita. The sacred teachings of Lord Krishna to Arjuna contain profound wisdom for all of humanity.`,
        significance: `Verse ${i} of Chapter ${chapterNumber} is part of the eternal dialogue between Lord Krishna and Arjuna on the battlefield of Kurukshetra.`,
      });
    }
  }

  return verses;
};

/**
 * Get chapter info from static data
 * @param {number} chapterNumber - Chapter number
 * @returns {Object|null} Chapter info or null
 */
export const getChapterInfo = (chapterNumber) => {
  return CHAPTER_DATA.find((c) => c.chapter === chapterNumber);
};

/**
 * Get all chapters info
 * @returns {Array} Array of chapter info objects
 */
export const getAllChapters = () => {
  return CHAPTER_DATA.map((c) => ({
    chapter: c.chapter,
    title: c.title,
    totalVerses: c.totalVerses,
  }));
};

export default {
  fetchChapterVerses,
  fetchSingleVerse,
};
