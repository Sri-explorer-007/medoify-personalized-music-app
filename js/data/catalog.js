/* ==========================================================================
   MUSIC CATALOG DATA
   Includes high-fidelity tracks with audio URLs, synth generation fallbacks,
   synced lyrics timestamps, genre tags, and high-res artwork.
   ========================================================================== */

export const CATALOG_TRACKS = [
  {
    id: "track-1",
    title: "Midnight City Lights",
    artist: "Neon Dreamer",
    artistId: "artist-1",
    album: "Synthetic Horizon",
    albumId: "album-1",
    duration: 214,
    genre: "Synthwave",
    year: 2026,
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3",
    color: "#8B5CF6",
    lyrics: [
      { time: 0, text: "♪ [Ambient Synth Intro] ♪" },
      { time: 12, text: "Cruising down the neon avenue" },
      { time: 18, text: "Reflections of the night in shades of blue" },
      { time: 24, text: "The city pulses with electric light" },
      { time: 30, text: "Chasing shadows through the velvet night" },
      { time: 36, text: "Take me higher, past the sky" },
      { time: 42, text: "Where the stars and circuits fly" },
      { time: 48, text: "♪ [Retro Synth Lead Solo] ♪" },
      { time: 64, text: "Lost in the rhythm of the cyber glow" },
      { time: 70, text: "Nowhere to be, nowhere left to go" },
      { time: 76, text: "Feel the bassline rising in your chest" },
      { time: 82, text: "In this digital frequency we find our rest" },
      { time: 94, text: "Midnight city, take my soul" },
      { time: 102, text: "Let the synthesizer take control" },
      { time: 120, text: "♪ [Outro Fade] ♪" }
    ]
  },
  {
    id: "track-2",
    title: "Cyberpunk Odyssey",
    artist: "HyperMatrix",
    artistId: "artist-2",
    album: "Neo Tokyo 2099",
    albumId: "album-2",
    duration: 188,
    genre: "Cyberpunk",
    year: 2026,
    coverUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-2099-10701.mp3",
    color: "#EC4899",
    lyrics: [
      { time: 0, text: "♪ [Heavy Industrial Bass Drone] ♪" },
      { time: 10, text: "Neural link connected: 100%" },
      { time: 16, text: "Rain falling over towering steel" },
      { time: 22, text: "Tell me what is simulated, what is real" },
      { time: 28, text: "Augmented dreams in an endless grid" },
      { time: 34, text: "Secrets that the megacorps hid" },
      { time: 42, text: "♪ [Heavy Bass Drop & Glitch FX] ♪" },
      { time: 58, text: "Data stream rushing through my veins" },
      { time: 64, text: "Breaking free from algorithmic chains" },
      { time: 72, text: "We are the ghosts inside the machine" },
      { time: 80, text: "Living in the spaces in between" },
      { time: 100, text: "System overload... rebooting consciousness." }
    ]
  },
  {
    id: "track-3",
    title: "Rainy Cafe Lo-Fi",
    artist: "Aura Beats",
    artistId: "artist-3",
    album: "Coffee & Raindrops",
    albumId: "album-3",
    duration: 162,
    genre: "Chill Lo-Fi",
    year: 2025,
    coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=lofi-study-112191.mp3",
    color: "#F59E0B",
    lyrics: [
      { time: 0, text: "♪ [Vinyl Crackle & Warm Rhodes Piano] ♪" },
      { time: 14, text: "Raindrops tapping on the windowpane" },
      { time: 22, text: "A warm cup of tea to soothe the brain" },
      { time: 30, text: "Quiet moments when the world slows down" },
      { time: 38, text: "Far away from the noise of town" },
      { time: 50, text: "♪ [Soft Drum Beat & Trumpet Solo] ♪" },
      { time: 70, text: "Pages turning in an old worn book" },
      { time: 80, text: "Finding peace in a quiet cozy nook" },
      { time: 94, text: "Breathe in, let the worries fade away" },
      { time: 108, text: "Tomorrow brings a brand new day" },
      { time: 130, text: "♪ [Gentle Fade Out] ♪" }
    ]
  },
  {
    id: "track-4",
    title: "Electric Pulse",
    artist: "Volt & Echo",
    artistId: "artist-4",
    album: "Resonance",
    albumId: "album-4",
    duration: 205,
    genre: "Electronic",
    year: 2026,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=electronic-future-beats-117997.mp3",
    color: "#D7FF3F",
    lyrics: [
      { time: 0, text: "♪ [Energetic Four-on-the-Floor Beat] ♪" },
      { time: 15, text: "Feel the current moving through the floor" },
      { time: 22, text: "Every heartbeat asking for more" },
      { time: 29, text: "Frequency locked at one twenty eight" },
      { time: 36, text: "No time to hesitate, open the gate" },
      { time: 45, text: "♪ [Synth Pluck Arpeggio Build-up] ♪" },
      { time: 60, text: "LIGHTS FLASHING IN THE DARK" },
      { time: 66, text: "IGNITE THE ELECTRIC SPARK" },
      { time: 74, text: "♪ [Main Hook Drop] ♪" },
      { time: 95, text: "We dance until the sunrise breaks" },
      { time: 102, text: "Whatever it gives, whatever it takes" }
    ]
  },
  {
    id: "track-5",
    title: "Deep Focus Ambient",
    artist: "Solstice Studio",
    artistId: "artist-5",
    album: "Mindful Waves",
    albumId: "album-5",
    duration: 240,
    genre: "Ambient",
    year: 2025,
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=ambient-piano-amp-strings-10711.mp3",
    color: "#06B6D4",
    lyrics: [
      { time: 0, text: "♪ [Ethereal Pad & Distant Chimes] ♪" },
      { time: 20, text: "Clear your mind of all distractions" },
      { time: 40, text: "Focus entirely on the present state" },
      { time: 60, text: "Flow effortlessly into the rhythm" },
      { time: 90, text: "♪ [Lush Harmonic Swells] ♪" },
      { time: 140, text: "Clarity, calm, balance." },
      { time: 190, text: "♪ [Deep Resonance Drone] ♪" }
    ]
  },
  {
    id: "track-6",
    title: "Sunset Boulevard",
    artist: "Neon Dreamer",
    artistId: "artist-1",
    album: "Synthetic Horizon",
    albumId: "album-1",
    duration: 195,
    genre: "Synthwave",
    year: 2026,
    coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=sunset-drive-synthwave-112194.mp3",
    color: "#FF6B4A",
    lyrics: [
      { time: 0, text: "♪ [Chill Analog Bass & 80s Snare] ♪" },
      { time: 14, text: "Golden hour shining on the sea" },
      { time: 20, text: "Top down, ocean breeze running free" },
      { time: 27, text: "Palm trees dancing in the sunset haze" },
      { time: 34, text: "Remembering our glorious summer days" },
      { time: 48, text: "♪ [Dreamy Saxophone Solo] ♪" },
      { time: 68, text: "As the violet sky turns to black" },
      { time: 75, text: "We're moving forward, never looking back" }
    ]
  },
  {
    id: "track-7",
    title: "After Midnight Club",
    artist: "Kira Noir",
    artistId: "artist-6",
    album: "Velvet Underground",
    albumId: "album-6",
    duration: 210,
    genre: "Deep House",
    year: 2026,
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_d0a13f69d2.mp3?filename=deep-house-groove-112195.mp3",
    color: "#F43F5E",
    lyrics: [
      { time: 0, text: "♪ [Sub Bass Groove & High-Hat] ♪" },
      { time: 16, text: "Smoke in the air, shadows on the wall" },
      { time: 23, text: "Waiting for the midnight bass to fall" },
      { time: 30, text: "Can you feel the vibration in the room?" },
      { time: 37, text: "Midnight flowers ready to bloom" },
      { time: 50, text: "♪ [Hypnotic Synth Chord Progression] ♪" },
      { time: 70, text: "Stay with me till four AM" },
      { time: 78, text: "Let the beat start over again" }
    ]
  },
  {
    id: "track-8",
    title: "Celestial Drift",
    artist: "Aura Beats",
    artistId: "artist-3",
    album: "Starlight Dreams",
    albumId: "album-7",
    duration: 175,
    genre: "Chill Lo-Fi",
    year: 2025,
    coverUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_245be59b91.mp3?filename=lofi-chill-hop-126245.mp3",
    color: "#3B82F6",
    lyrics: [
      { time: 0, text: "♪ [Starlight Melodies & Soft Percussion] ♪" },
      { time: 15, text: "Floating gently past the constellations" },
      { time: 24, text: "Leaving behind earthly vibrations" },
      { time: 35, text: "Quiet thoughts and velvet skies" },
      { time: 44, text: "Seeing wonders through awakened eyes" },
      { time: 60, text: "♪ [Mellow Guitar Strumming] ♪" },
      { time: 80, text: "Drifting through infinity..." }
    ]
  }
];

export const ARTISTS = [
  {
    id: "artist-1",
    name: "Neon Dreamer",
    genre: "Synthwave / Retrowave",
    monthlyListeners: "1,420,890",
    verified: true,
    bio: "Synthwave producer crafting nostalgic retro-futuristic soundscapes with authentic 80s analog synthesizers and cinematic drums.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80"
  },
  {
    id: "artist-2",
    name: "HyperMatrix",
    genre: "Cyberpunk / Industrial Bass",
    monthlyListeners: "980,450",
    verified: true,
    bio: "Pioneering cybernetic sound designer creating dark electronic bass music inspired by high-tech dystopian futures.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80"
  },
  {
    id: "artist-3",
    name: "Aura Beats",
    genre: "Chill Lo-Fi / Downtempo",
    monthlyListeners: "2,350,110",
    verified: true,
    bio: "Chillhop and Lo-Fi hip hop beatmaker specializing in cozy study music, vinyl warmth, and soulful melodic loops.",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80"
  },
  {
    id: "artist-4",
    name: "Volt & Echo",
    genre: "EDM / Electro Pop",
    monthlyListeners: "3,110,400",
    verified: true,
    bio: "Duo combining heavy festival drops with euphoric synth melodies that have headlined major global music events.",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80"
  },
  {
    id: "artist-5",
    name: "Solstice Studio",
    genre: "Ambient / Modern Classical",
    monthlyListeners: "740,200",
    verified: true,
    bio: "Composing minimalist piano and organic spatial audio designed for deep work, relaxation, and cognitive flow.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80"
  },
  {
    id: "artist-6",
    name: "Kira Noir",
    genre: "Deep House / Melodic Techno",
    monthlyListeners: "1,120,700",
    verified: true,
    bio: "Underground club producer shaping late-night grooves with punchy sub frequencies and ethereal vocals.",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80"
  }
];

export const GENRES = [
  { id: "synthwave", name: "Synthwave", color: "#8B5CF6", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80" },
  { id: "cyberpunk", name: "Cyberpunk", color: "#EC4899", img: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&auto=format&fit=crop&q=80" },
  { id: "lofi", name: "Chill Lo-Fi", color: "#F59E0B", img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80" },
  { id: "electronic", name: "Electronic / EDM", color: "#D7FF3F", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80" },
  { id: "ambient", name: "Ambient / Focus", color: "#06B6D4", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80" },
  { id: "deephouse", name: "Deep House", color: "#F43F5E", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=80" },
  { id: "pop", name: "Modern Pop", color: "#10B981", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80" },
  { id: "rock", name: "Alternative Rock", color: "#E11D48", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80" }
];
