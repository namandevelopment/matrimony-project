# 🔍 Validators Layer — Joi Input Sanitization

## 📌 Overview
Validators incoming HTTP request data (body, query, params) ko controller tak pahunchne se pehle thoroughly sanitize aur validate karte hain.

## 🎯 Architecture & Composition
1. **No Inline Joi Checks**:
   - Har schema `utils/joiValidationDataType.js` ke standard rules se compose hoga.
2. **Prevent Parameter Pollution & Injection**:
   - Unknown fields automatically strip kiye jate hain (`stripUnknown: true`).
3. **Mirroring Directory Structure**:
   - Har validator module exactly route aur controller module ki tarah mirrored hai.
