# 🔮 Controllers: Horoscope & Kundli (`controllers/horoscope/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Vedic Astrology, Ashtakoota 36-Guna Milan aur Manglik Dosha matching API.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Assisted horoscope reports, custom gunas override, astro consultation notes.
- `users.js`: Two profiles ke beech 36-Guna score calculate karna, Guna breakdown view karna.

## ⚙️ Key Actions & Flows
1. **Kundli Calculation**:
   - Do candidates ke birth details (Date, Time, Place/Coordinates) input lete hain.
   - `serviceHoroscope.calculateAshtakoota()` call karke Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi ka score nikalte hain.
2. **Manglik Check**:
   - Lagna aur Moon chart se Mars position evaluate hoti hai.
