/**
 * Site-wide configuration.
 * Edit these values to adjust behavior without touching other scripts.
 */
const SITE_CONFIG = {
  dataUrl: 'data/memories.json',
  music: {
    src: 'assets/audio/background-music.mp3',
    defaultVolume: 0.35,
    autoplay: false // never true — music starts only after user interaction
  },
  chapters: [
    { id: 'chapter-00', label: 'Invitation' },
    { id: 'chapter-01', label: 'Before We Left' },
    { id: 'chapter-02', label: 'The Journey' },
    { id: 'chapter-03', label: 'Little Things' },
    { id: 'chapter-04', label: 'Moving Memories' },
    { id: 'chapter-05', label: 'The Letter' },
    { id: 'chapter-06', label: 'To Be Continued' }
  ],
  loaderMinDuration: 900
};
