import axios from 'axios';

/**
 * Service for fetching Bhagavad Gita verses
 * Uses bhagavadgitaapi.in API - free and reliable
 */

// Chapter verse counts for generating all verses
const chapterVerseCounts = {
    1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47, 7: 30, 8: 28, 9: 34,
    10: 42, 11: 55, 12: 20, 13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
};

// Famous verses with full content for better fallback
const famousVerses = {
    1: {
        1: {
            sanskrit: "धृतराष्ट्र उवाच |\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः |\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||१-१||",
            transliteration: "dhṛtarāṣṭra uvāca |\ndharmakṣetre kurukṣetre samavetā yuyutsavaḥ |\nmāmakāḥ pāṇḍavāścaiva kimakurvata sañjaya ||1-1||",
            translation: "Dhritarashtra said: O Sanjaya, what did my sons and the sons of Pandu do when they assembled on the holy field of Kurukshetra, eager to fight?",
            significance: "This verse sets the stage for the entire Bhagavad Gita. King Dhritarashtra, blind and anxious, asks his minister Sanjaya about the battle between his sons (Kauravas) and his nephews (Pandavas)."
        },
        2: {
            sanskrit: "सञ्जय उवाच |\nदृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा |\nआचार्यमुपसङ्गम्य राजा वचनमब्रवीत् ||१-२||",
            transliteration: "sañjaya uvāca |\ndṛṣṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanastadā |\nācāryamupasaṅgamya rājā vacanamabravīt ||1-2||",
            translation: "Sanjaya said: Having seen the army of the Pandavas drawn up in battle array, King Duryodhana approached his teacher Drona and spoke these words.",
            significance: "Duryodhana, seeing the powerful army of the Pandavas, becomes concerned and seeks counsel from his teacher Dronacharya."
        },
        3: {
            sanskrit: "पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम् |\nव्यूढां द्रुपदपुत्रेण तव शिष्येण धीमता ||१-३||",
            transliteration: "paśyaitāṁ pāṇḍuputrāṇām ācārya mahatīṁ camūm |\nvyūḍhāṁ drupadaputreṇa tava śiṣyeṇa dhīmatā ||1-3||",
            translation: "Behold, O teacher, this mighty army of the sons of Pandu, arrayed for battle by your intelligent disciple, the son of Drupada.",
            significance: "Duryodhana reminds Dronacharya that Dhrishtadyumna, the son of Drupada and a former student of Drona, now leads the enemy army."
        }
    },
    2: {
        47: {
            sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||२-४७||",
            transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||2-47||",
            translation: "You have a right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
            significance: "This is perhaps the most famous verse of the Bhagavad Gita. It teaches the essence of Karma Yoga - performing one's duty without attachment to results."
        },
        48: {
            sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय |\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ||२-४८||",
            transliteration: "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate ||2-48||",
            translation: "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.",
            significance: "This verse defines yoga as equanimity of mind - remaining balanced in both success and failure while performing one's duties."
        }
    },
    4: {
        7: {
            sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत |\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ||४-७||",
            transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata |\nabhyutthānam adharmasya tadātmānaṁ sṛjāmy aham ||4-7||",
            translation: "Whenever there is a decline in righteousness (dharma) and an increase in unrighteousness (adharma), O Arjuna, at that time I manifest Myself on earth.",
            significance: "Lord Krishna explains the divine purpose of His incarnations - to restore dharma whenever it declines and protect the righteous."
        },
        8: {
            sanskrit: "परित्राणाय साधूनां विनाशाय च दुष्कृताम् |\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ||४-८||",
            transliteration: "paritrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām |\ndharma-saṁsthāpanārthāya sambhavāmi yuge yuge ||4-8||",
            translation: "For the protection of the righteous, for the destruction of the wicked, and for the establishment of dharma, I appear in every age.",
            significance: "This verse continues the previous one, explaining the threefold purpose of divine incarnation."
        }
    },
    18: {
        65: {
            sanskrit: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु |\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे ||१८-६५||",
            transliteration: "man-manā bhava mad-bhakto mad-yājī māṁ namaskuru |\nmām evaiṣyasi satyaṁ te pratijāne priyo 'si me ||18-65||",
            translation: "Always think of Me, become My devotee, worship Me and offer your homage unto Me. Thus you will come to Me without fail. I promise you this because you are My very dear friend.",
            significance: "Krishna gives the essence of devotional service - to always think of the Lord and surrender unto Him."
        },
        66: {
            sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज |\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ||१८-६६||",
            transliteration: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja |\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||18-66||",
            translation: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
            significance: "This is the final and most confidential instruction of the Bhagavad Gita - complete surrender to the Supreme Lord."
        }
    }
};

/**
 * Fetch all verses for a specific chapter
 * @param {number} chapterNumber - Chapter number (1-18)
 * @returns {Promise<Array>} Array of verse objects
 */
export const fetchChapterVerses = async (chapterNumber) => {
    const verseCount = chapterVerseCounts[chapterNumber] || 20;

    try {
        // Try fetching from bhagavadgitaapi.in
        const response = await axios.get(
            `https://bhagavadgitaapi.in/slok/${chapterNumber}/`,
            { timeout: 10000 }
        );

        if (response.data && Array.isArray(response.data)) {
            return response.data.map((verse) => ({
                verse: verse.verse || verse.slokNo,
                sanskrit: verse.slok || verse.shlok || '',
                transliteration: verse.transliteration || '',
                translation: verse.tej?.ht || verse.meaning || verse.translation || '',
                significance: verse.purpicchinnakar?.ht || verse.commentary || `Verse from Chapter ${chapterNumber} of Bhagavad Gita.`,
            }));
        }
    } catch (error) {
        console.log('API failed, using generated verses with famous content');
    }

    // Generate verses with some famous ones included
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
                ...chapterFamous[i]
            });
        } else {
            // Generate placeholder
            verses.push({
                verse: i,
                sanskrit: `॥ अध्याय ${chapterNumber} श्लोक ${i} ॥\nभगवद्गीता का श्लोक`,
                transliteration: `|| adhyāya ${chapterNumber} śloka ${i} ||`,
                translation: `This is verse ${i} of Chapter ${chapterNumber} of the Bhagavad Gita. The sacred teachings of Lord Krishna to Arjuna contain profound wisdom for all of humanity.`,
                significance: `Verse ${i} of Chapter ${chapterNumber} is part of the eternal dialogue between Lord Krishna and Arjuna on the battlefield of Kurukshetra.`
            });
        }
    }

    return verses;
};

/**
 * Fetch a single verse
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @returns {Promise<Object>} Verse object
 */
export const fetchSingleVerse = async (chapter, verse) => {
    try {
        const response = await axios.get(
            `https://bhagavadgitaapi.in/slok/${chapter}/${verse}`,
            { timeout: 5000 }
        );

        if (response.data) {
            const v = response.data;
            return {
                chapter,
                verse: v.verse || verse,
                sanskrit: v.slok || v.shlok || '',
                transliteration: v.transliteration || '',
                translation: v.tej?.ht || v.meaning || '',
                significance: v.purpicchinnakar?.ht || v.commentary || '',
            };
        }
    } catch (error) {
        console.log('Failed to fetch single verse');
    }

    // Return from famous verses if available
    if (famousVerses[chapter]?.[verse]) {
        return { chapter, verse, ...famousVerses[chapter][verse] };
    }

    return null;
};

export default {
    fetchChapterVerses,
    fetchSingleVerse
};
