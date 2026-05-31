import type { GovernmentUpdate } from "../types";

/** Local mock — replace with GET /api/v1/government-updates */
export const GOVERNMENT_UPDATES: GovernmentUpdate[] = [
  {
    id: "tvk-welfare-card",
    title_en:
      "TVK Party launches Karaikudi Welfare Card — subsidized essentials for eligible families",
    title_ta:
      "தவெக அரசு காரைக்குடி நலன் அட்டை — தகுதியுள்ள குடும்பங்களுக்கு மானிய விலை அத்தியாவசியப் பொருட்கள்",
    category: "welfare",
    priority: 2,
  },
  {
    id: "tvk-education-grant",
    title_en:
      "New TVK education support: scholarships and coaching aid for rural students in Sivaganga district",
    title_ta:
      "தவெக கல்வி உதவி: சிவகங்கை மாவட்ட ஊரக மாணவர்களுக்கு உயர்கல்வி உதவித்தொகை & பயிற்சி நலன்",
    category: "education",
    priority: 1,
  },
  {
    id: "tvk-health-camp",
    title_en:
      "TVK free health screening camps begin across Karaikudi — mobile clinics at village sandhais",
    title_ta:
      "காரைக்குடி முழுவதும் தவெக இலவச மருத்துவ முகாம் — ஊர் சந்தைகளில் நடமையும் மருத்துவ வாகனங்கள்",
    category: "healthcare",
    priority: 1,
  },
  {
    id: "tvk-women-enterprise",
    title_en:
      "TVK women entrepreneur scheme: zero-interest seed grants for Chettinad craft & food startups",
    title_ta:
      "தவெக பெண் தொழில்முனைவோர் திட்டம்: செட்டிநாடு கைவினை & உணவு தொழில்களுக்கு வட்டியில்லா துவக்க உதவித்தொகை",
    category: "scheme",
    priority: 2,
  },
  {
    id: "tvk-infrastructure",
    title_en:
      "Constituency development push: TVK announces smart street lighting & drinking water upgrades",
    title_ta:
      "தொகுதி வளர்ச்சி முன்னெடுப்பு: ஸ்மார்ட் தெரு விளக்கு & குடிநீர் மேம்பாடு — தவெக அறிவிப்பு",
    category: "infrastructure",
    priority: 1,
  },
  {
    id: "tvk-youth-employment",
    title_en:
      "TVK youth employment mission: skill centres for hospitality, construction & IT services in Karaikudi",
    title_ta:
      "தவெக இளைஞர் வேலைவாய்ப்பு: விருந்தோம்பல், கட்டுமானம் & IT திறன் மையங்கள் காரைக்குடியில்",
    category: "scheme",
    priority: 1,
    isBreaking: true,
  },
];
