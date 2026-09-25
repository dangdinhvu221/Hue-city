/**
 * Site-wide configuration.
 * Edit these values to adjust behavior without touching other scripts.
 */
const SITE_CONFIG = {
  dataUrl: 'data/memories.json',
  music: {
    // Embedded via the YouTube IFrame API (no audio files are downloaded or hosted).
    youtubeIds: ['05M5jKoxw78', 'u2Ix73ePWDs'],
    defaultVolume: 35, // 0-100, YouTube player API scale
    autoplay: false // never true — music starts only after user interaction
  },
  chapters: [
    { id: 'chapter-00', label: 'Mở đầu' },
    { id: 'chapter-01', label: 'Trước ngày đi' },
    { id: 'chapter-02', label: 'Hành trình Huế' },
    { id: 'chapter-03', label: 'Những điều nhỏ' },
    { id: 'chapter-04', label: 'Khoảnh khắc' },
    { id: 'chapter-05', label: 'Lá thư' },
    { id: 'chapter-06', label: 'Còn tiếp' }
  ],
  loaderMinDuration: 900
};
