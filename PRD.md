# Product Requirements Document (PRD)
## Ambrelle Fragrance Blog Platform

**Version:** 1.0  
**Last Updated:** March 2026  
**Status:** Released to Production

---

## 1. Overview

Ambrelle Fragrance Blog is a luxury fragrance editorial and commerce platform that enables the brand owner to publish rich fragrance reviews, showcase IBRAQ products, and convert blog readers into WhatsApp sales leads.

### 1.1 Vision
"Transform every fragrance post into an immersive brand storytelling experience that compels visitors to order."

### 1.2 Target Audience
| Audience | Goal |
|---|---|
| **Visitors** | Discover and learn about luxury fragrances |
| **Brand Owner (Admin)** | Publish and manage fragrance content, receive order inquiries |
| **Returning Customers** | Comment on posts, explore new arrivals |

---

## 2. Current State (v1.0) — What's Built

### ✅ Core Features Shipped

| Feature | Status |
|---|---|
| Homepage with kinetic hero, parallax, halo glow effects | ✅ Done |
| Day/Night theme with system preference detection | ✅ Done |
| Fragrance card grid with bottle images | ✅ Done |
| Animated fragrance detail modal (spring physics) | ✅ Done |
| Aromatic pyramid breakdown (Top / Heart / Base notes) | ✅ Done |
| "Order via WhatsApp" CTA with pre-filled message | ✅ Done |
| Supabase Auth (email/password sign up & sign in) | ✅ Done |
| Admin Dashboard (list, create, edit, delete posts) | ✅ Done |
| Supabase Storage image upload in create/edit post | ✅ Done |
| Comment system for authenticated visitors | ✅ Done |
| 6 IBRAQ fragrance posts seeded with real CDN images | ✅ Done |
| Production security headers | ✅ Done |
| Vercel-ready deployment configuration | ✅ Done |

---

## 3. Roadmap — Future Enhancements

### 3.1 Priority 1 — High Impact (Next 30 Days)

#### 📱 WhatsApp Catalog Integration
- **What:** Sync fragrance posts to the WhatsApp Business Catalog API automatically
- **Why:** Currently every order requires manual chat; a catalog reduces friction significantly
- **How:** Server action that calls Meta's Graph API on post publish
- **Effort:** Medium (2–3 days)

#### 🔍 Search & Filter
- **What:** Full-text search across all fragrance posts + filter by topic (Oud, Musk, Tobacco, etc.)
- **Why:** As the archive grows, discovery becomes harder
- **How:** Supabase `tsvector` full-text search + client-side filter state
- **Effort:** Small (1 day)

#### 🖼️ Image Gallery on Posts
- **What:** Each fragrance detail modal / blog post page shows a swipeable mini gallery of multiple bottle angles
- **Why:** Single image doesn't do justice to luxury products
- **How:** Add `images: text[]` column to posts table, Framer Motion carousel in modal
- **Effort:** Medium (1–2 days)

---

### 3.2 Priority 2 — Medium Impact (60–90 Days)

#### 📊 Analytics Dashboard (Admin)
- **What:** Simple admin analytics page showing page views, most clicked fragrances, WhatsApp click rate
- **Why:** Brand owner needs to know what content is performing
- **How:** Vercel Analytics + custom click-event tracking via Supabase `events` table
- **Effort:** Medium (3–4 days)

#### ⭐ Ratings System on Posts
- **What:** Authenticated users can give a 1–5 star rating; aggregate shown on card
- **Why:** Social proof increases conversion and engagement
- **How:** New `ratings (post_id, user_id, score)` table + RLS policy
- **Effort:** Small (1 day)

#### 🌐 Arabic Language Support (i18n)
- **What:** Full Arabic translation of the UI with RTL layout support
- **Why:** The target audience is primarily Arabic-speaking (Qatar/GCC)
- **How:** `next-intl` library with `en` and `ar` locale files; `dir="rtl"` conditional
- **Effort:** Large (5–7 days)

#### 🔔 Email Notifications on New Comments
- **What:** Brand owner receives an email when someone comments on a post
- **Why:** Keeps the owner engaged and allows faster community management
- **How:** Supabase Database Webhooks → Resend email API (Edge Function)
- **Effort:** Small (half a day)

---

### 3.3 Priority 3 — Long-Term (90+ Days)

#### 🛒 Direct Ordering Page
- **What:** A simple checkout-like page where visitors select fragrance size and submit order (name, phone, address) — goes to Supabase `orders` table and triggers WhatsApp notification to admin
- **Why:** Reduces friction vs. a manual WhatsApp message; creates order records
- **Effort:** Large (5–7 days)

#### 🎥 Video Post Support
- **What:** Fragrance posts can include a short product video uploaded to Supabase Storage
- **Why:** Video dramatically increases engagement and conversion on luxury products
- **How:** Extend `posts` schema with `video_url`; add video player in modal
- **Effort:** Medium (2 days)

#### 🤖 AI Content Generator
- **What:** Admin types a fragrance name + notes, AI generates a full cinematic description
- **Why:** Saves time writing poetic descriptions; maintains tone consistency
- **How:** OpenAI API (GPT-4o) server action with a luxury fragrance system prompt
- **Effort:** Small (1 day)

#### 🔑 Google / Social Sign-In
- **What:** One-click sign-in with Google or Instagram
- **Why:** Reduces friction for visitor accounts and comment system engagement
- **How:** Supabase OAuth providers (Google already supported; Instagram requires Meta app)
- **Effort:** Small (half a day)

---

## 4. Known Technical Debt

| Item | Impact | Fix Plan |
|---|---|---|
| Blog post detail page (`/blog/[slug]`) uses basic styling | Low | Restyle to match the luxury card modal design |
| No pagination on the archive grid | Medium | Add Supabase range queries + "Load More" button |
| Comment section has no moderation controls | Medium | Add admin delete-comment capability |
| No image optimization (`<Image>` from Next.js) | Low | Replace `<img>` tags with `<Image>` for better LCP |

---

## 5. API & Integration Inventory

| Integration | Purpose | Status |
|---|---|---|
| Supabase Auth | User sign in / sign up | ✅ Active |
| Supabase Database (PostgreSQL) | Posts + comments storage | ✅ Active |
| Supabase Storage | Fragrance image uploads | ✅ Active |
| WhatsApp (`wa.me`) | Sales lead conversion | ✅ Active |
| Ibrahim Al-Qurashi CDN | Existing product images | ✅ Active |
| Vercel | Hosting + deployment | 🔜 Planned |
| Resend (Email) | Admin notifications | 📋 Roadmap |
| OpenAI API | AI description generator | 📋 Roadmap |

---

## 6. Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anon/public key |
| `OPENAI_API_KEY` | ⬜ Roadmap | For AI content generator |
| `RESEND_API_KEY` | ⬜ Roadmap | For email notifications |

---

## 7. Success Metrics

| Metric | Target (30 days after launch) |
|---|---|
| WhatsApp clicks from blog posts | 20+ per week |
| Fragrance pages viewed | 200+ unique visitors |
| Admin posts published | 3+ new posts per month |
| Comments per post | 2+ avg |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1 |

---

*This document is a living PRD. Update it as features are shipped or priorities change.*
