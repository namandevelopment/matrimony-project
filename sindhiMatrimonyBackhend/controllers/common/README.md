# 🌐 Controllers: Common & Dropdowns (`controllers/common/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Platform ka sabse fast public unauthenticated endpoint jo mobile app aur web ke sabhi master dropdowns ek single payload me return karta hai.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `dropdowns.js`: Consolidated dropdown bundle handler (`GET /api/v1/common/dropdowns`).

## ⚙️ Key Actions & Flows
1. **Zero-Token Master Data Bundle**:
   - Ek single request me Castes, Subcastes, Gotras, Surnames, Educations, Occupations, Cities, Manglik options sab bundle hokar aate hain.
2. **Redis Fast Cache**:
   - Pure payload ko Redis me `CACHE_DROPDOWNS_BUNDLE` key me cache kiya jata hai. Response time < 15ms.
3. **ETag / Client Versioning**:
   - `masterDataVersion` check karke `304 Not Modified` return karta hai agar client ke paas latest data already hai.
