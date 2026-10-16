# ⭐ Controllers: Reviews & Testimonials (`controllers/reviews/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Users dwara platform par diye gaye ratings aur testimonials ka moderation.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Reviews approve karna, reject karna, reply karna, featured tag lagana.
- `users.js`: Review submit karna, public approved reviews browse karna.

## ⚙️ Key Actions & Flows
1. **Moderation Before Publish**:
   - Koi bhi review bina admin approval ke public website par nahi dikhega (`status: 'APPROVED'`).
