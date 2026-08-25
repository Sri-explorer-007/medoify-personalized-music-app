# PROJECT MASTER CONTEXT — PRIVATE MUSIC STREAMING APPLICATION
Persistent context for Antigravity. Loaded before every task. All future prompts are treated as incremental changes to THIS application.

## 1. PRODUCT IDENTITY
Private music streaming app for 7–10 trusted users. Not a Spotify-scale product.
Core loop: listen → discover → organize (playlists/likes/library) → see friends' activity (privacy-respecting) → admin manages a legally-owned catalog.
MUSIC FIRST. Never let this drift into a generic social network, admin dashboard, or SaaS shell.

## 2. NON-NEGOTIABLE CONSTRAINTS
- **Legal**: Only admin-uploaded, rights-cleared audio. No scraping, no YouTube/Spotify extraction, no DRM bypass.
- **Security**: All authorization enforced server-side/DB-side (RLS), never frontend-only. Signed/temporary URLs for audio, never public buckets. No secrets in client code.
- **Privacy**: Users can never access another user's private playlists, likes, history, notifications, or presence — including via blocked users or alternate routes.
- **Single Sources of Truth**:
  - ONE global player state
  - ONE queue system
  - ONE DB client
  - ONE storage service
  - ONE notification system
  - ONE design system
  *(Search existing codebase before adding any of these and extend instead of duplicating)*
- **Performance Budget**: Built for 7–10 users:
  - No per-second DB writes (playback position, presence)
  - No polling where a subscription/event works
  - No `backdrop-filter` on hundreds of nodes (one glass parent > many glass children)

## 3. DESIGN SYSTEM — PREMIUM DARK GLASSMORPHISM
- **Palette**:
  - Background scale (near-black, cool undertone): `#08090D → #0C0D13 → #11131B → #161925`
  - Accent (use sparingly — active nav, play button, progress, liked state, focus ring only): `#D7FF3F`
- **Glass Tokens** (reusable components/utilities): `glass-subtle`, `glass-standard`, `glass-elevated` — translucent surface + subtle border + controlled blur + soft shadow.
- **Artwork**: First-class element across Home, Now Playing, Albums, Artists, Playlists, Library. Correct aspect ratio, zero layout shift, graceful fallback, optimized resolution. Optional ambient background with blurred gradient + dark overlay.
- **Typography Hierarchy**: Display → Section heading → Track title → Artist → Metadata. Strong contrast on primary text, muted secondary text.
- **Spacing/Radius**: Centralized tokens, generous desktop whitespace, comfortable mobile touch targets.
- **Original Identity**: Cinematic Now Playing, floating glass nav, lime accent, atmospheric gradients.

## 4. COMPONENT LIBRARY (Reuse-First)
`Button`, `IconButton`, `GlassCard`, `Artwork`, `SongRow`, `TrackCard`, `AlbumCard`, `ArtistCard`, `PlaylistCard`, `MiniPlayer`, `NowPlaying`, `Queue`, `Tabs`, `Chip`, `Dialog`, `BottomSheet`, `Avatar`, `Switch`, `Toast`, `Skeleton`, `EmptyState`, `ErrorState`.

## 5. DOMAIN MODEL & SPECIFICATIONS
*(To be extended with domain schema, entities, and relationships)*
