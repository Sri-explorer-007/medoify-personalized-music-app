# PROJECT MASTER CONTEXT & WORKSPACE RULES

## Application Identity & Non-Negotiables
1. **Music-First Focus**: Private music streaming app for 7–10 trusted users. Core loop: listen -> discover -> organize -> friend activity -> admin catalog management.
2. **Legal & Security**: Admin-uploaded, rights-cleared audio only. Signed/temporary URLs, DB RLS server-side authorization. Zero secrets in client code.
3. **Strict Privacy**: Absolute isolation of private playlists, likes, history, notifications, and presence.
4. **Single Sources of Truth**: 1 Global Player, 1 Queue, 1 DB Client, 1 Storage Service, 1 Notification System, 1 Design System. Reuse and extend existing instances.
5. **Performance**: Zero per-second DB writes, subscription/event-driven updates, efficient single-container glassmorphism blurs.

## Design System Tokens
- **Backgrounds**: `#08090D`, `#0C0D13`, `#11131B`, `#161925`
- **Accent**: `#D7FF3F` (Electric Lime)
- **Glass Tokens**: `glass-subtle`, `glass-standard`, `glass-elevated`
- **Standard UI Library**: Button, IconButton, GlassCard, Artwork, SongRow, TrackCard, AlbumCard, ArtistCard, PlaylistCard, MiniPlayer, NowPlaying, Queue, Tabs, Chip, Dialog, BottomSheet, Avatar, Switch, Toast, Skeleton, EmptyState, ErrorState.
