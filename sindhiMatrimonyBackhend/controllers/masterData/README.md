# 🏛️ Controllers: Sindhi Master Data (`controllers/masterData/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Sindhi community ki cultural ontology ka management (Caste, Subcaste, Gotra, Surname, Exogamy rules).

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Add/Edit/Delete Castes, Subcastes, Gotras, Surnames, Compatibility matrices.
- `users.js`: Hierarchical dropdown filters (e.g. Subcaste select karne par allowed Gotras filter hona).

## ⚙️ Key Actions & Flows
1. **Sindhi Exogamy Rules**:
   - Sindhi parampara ke anusaar same Gotra me shaadi prohibited hoti hai (Swagotra).
   - Compatibility matrix rules ko enforce karna.
2. **Cache Eviction**:
   - Koi bhi master data update hone par Redis ka `CACHE_DROPDOWNS_BUNDLE` automatically invalidate hota hai.
