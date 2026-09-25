# HUẾ — Một Chương Có Em

Website tình yêu tương tác, điện ảnh — món quà kể lại chuyến đi Huế có thật. Static site, không build step, không backend. Toàn bộ nội dung hiển thị đã Việt hóa 100% (xem `data/memories.json`).

**Tính năng mới nhất:**
- Nhạc nền nhúng qua YouTube IFrame API (2 bài, không tải file — xem `js/music.js`, `data/config.js`).
- Section mới "Huế Có Thơ, Anh Có Em" — 24 câu thương gốc, xem trong trang (giữa Chapter 04 và 05) hoặc bất cứ lúc nào qua nút tròn nổi góc dưới-phải (♎).
- Menu "Đi nhanh đến" (nút ☰ góc trên-phải) — nhảy thẳng đến bất kỳ chương nào, không cần cuộn hết trang.

## 1. Chạy thử ở local

Vì `js/data.js` dùng `fetch()` để tải `data/memories.json`, bạn **cần chạy qua một local server** — mở trực tiếp `index.html` bằng cách double-click (giao thức `file://`) sẽ khiến `fetch` bị chặn bởi CORS ở một số trình duyệt.

Chọn một trong các cách sau, tại thư mục `D:\love\Hue-city`:

```bash
# Node.js (npx có sẵn nếu đã cài Node)
npx serve .

# hoặc Python 3
python -m http.server 5500

# hoặc VS Code — cài extension "Live Server" rồi bấm "Go Live"
```

Sau đó mở `http://localhost:5500` (hoặc cổng tương ứng) trên trình duyệt.

## 2. Cấu trúc dự án

```
Hue-city/
├── index.html               # Toàn bộ 7 chapter, một trang duy nhất
├── css/                      # reset, variables, typography, components, chapters, animations, responsive
├── js/                       # main, navigation, animations, gallery, video, music, data
├── data/
│   ├── memories.json         # NỘI DUNG THẬT — sửa ở đây, không cần đụng JS
│   └── config.js              # cấu hình chung (đường dẫn nhạc, danh sách chapter...)
└── assets/
    ├── images/
    │   ├── moments/           # 203 ảnh thật đã tối ưu (dùng cho Chapter 03, ~270KB/ảnh)
    │   ├── moments-original/  # bản gốc chưa nén của 203 ảnh trên (KHÔNG dùng trên site, chỉ để lưu trữ)
    │   ├── posters/           # ảnh thumbnail tự trích từ 47 video (dùng làm poster Chapter 04)
    │   ├── hero/, journey/, letters/  # còn trống — xem mục 3
    ├── videos/                # 47 video thật, giữ nguyên chất lượng gốc
    ├── audio/
    └── icons/
```

## 3. Về media hiện tại — QUAN TRỌNG

Bạn đã xác nhận 250 file trong `assets/images/imagesAndVideos/images/` (203 ảnh + 47 video) là ảnh/video thật của chuyến đi Huế. Quy trình đã thực hiện, đầy đủ chi tiết nằm trong **`MEDIA_CATALOG.md`** (đọc file này trước khi sửa `memories.json`):

1. **Nén ảnh để web tải nhanh**: mỗi ảnh gốc → resize tối đa 1600px, nén còn trung bình ~270KB, lưu tại `assets/images/moments/`. Bản gốc giữ nguyên tại `assets/images/moments-original/` (đã kiểm tra checksum khớp 100%).
2. **Giữ nguyên chất lượng video** (không nén) — video chỉ tải khi bấm Play nên không tốn băng thông nếu không xem.
3. **Xem qua toàn bộ 203 ảnh + 47 video** (bằng contact sheet, không đoán mò), nhóm thành các cụm theo nội dung thực tế nhìn thấy, phát hiện ảnh/video trùng lặp bằng thuật toán perceptual hash — xem chi tiết từng cụm, từng file trong `MEDIA_CATALOG.md`.
4. **Đã gắn vào site**:
   - `beforeWeLeft.heroImage` — 1 ảnh cầu/sông lúc hoàng hôn (P006 trong catalog).
   - `journey.stops` — 6 địa điểm, mỗi địa điểm 1 ảnh đại diện. **Tên địa điểm đang ghi kèm "(cần xác nhận)"** vì đây là suy đoán từ hình ảnh (kiến trúc trông giống Đại Nội, một khu lăng tẩm, một ngôi chùa có tháp cổ...) — **chưa phải tên đã xác nhận, bạn cần tự kiểm tra và sửa lại cho đúng**.
   - `moments.gallery` — 173 ảnh (203 gốc, trừ 4 ảnh riêng tư trong phòng, trừ 7 ảnh đã dùng làm hero/journey, trừ 19 ảnh trùng/gần trùng đã tự động lọc bớt).
   - `movingMemories.videos` — 33 video (47 gốc, trừ 8 video tối/rung/mờ chất lượng thấp, trừ 6 video trùng lặp gần như y hệt).
5. **4 ảnh riêng tư (soi gương, đắp mặt nạ trong phòng) đã KHÔNG đưa vào gallery công khai** — vẫn còn nguyên trong `assets/images/moments/` nếu bạn muốn tự thêm lại.

**Vẫn cần bạn làm tiếp:**
- Xác nhận/sửa lại 6 tên địa điểm ở Chapter 02 (đang đánh dấu rõ "(cần xác nhận)" để không ai nhầm là đã chốt).
- Ngày đi, tên tỉnh/thành cụ thể ở `trip`.
- Duyệt lại 173 ảnh trong Chapter 03 một lượt — dù đã lọc bớt ảnh riêng tư rõ ràng, tôi chưa xem xét kỹ từng ảnh ở mức "có nên công khai không", chỉ lọc theo tiêu chí kỹ thuật (trùng lặp, chất lượng).

**Dọn dẹp còn lại**: thư mục gốc `assets/images/imagesAndVideos/` (545MB) hiện vẫn còn — nội dung đã được sao chép an toàn vào `moments-original/` và `assets/videos/` (đã kiểm tra checksum khớp), có thể tự xoá để giải phóng ổ đĩa. Tôi không tự xoá vì khó hoàn tác trên 545MB dữ liệu gốc.

## 4. Sửa nội dung / lời nhắn

Toàn bộ text hiển thị (tiêu đề, caption, lá thư ở Chapter 05...) nằm trong `data/memories.json`. Các chỗ đang là placeholder được viết hoa rõ ràng, ví dụ:

- `journey.stops[].title` → đang ghi kèm `"(cần xác nhận)"` — sửa thành tên địa điểm thật đã xác nhận, bỏ phần "(cần xác nhận)" đi.
- `letter.body` → mảng các đoạn văn — thay bằng lời nhắn thật của bạn.
- `trip.date`, `journey.stops[].date` → để trống, điền khi có ngày chính xác.
- `moments.gallery[].caption` → để trống cho cả 173 ảnh (tôi không tự bịa caption) — bạn có thể điền caption cho những ảnh muốn chú thích, để trống thì ảnh hiển thị không caption, không sao cả.

**Không có ngày tháng, địa điểm, hay chi tiết nào bị tự ý bịa ra** — tất cả các trường chưa xác nhận đều để trống hoặc đánh dấu rõ là placeholder, theo đúng yêu cầu trong `promt.txt`.

## 5. Nhạc nền

Đặt file nhạc tại `assets/audio/background-music.mp3` (đường dẫn cấu hình trong `data/config.js`) — hiện chưa có file nhạc. Nhạc **không tự phát** — chỉ phát khi người xem bấm nút toggle ở góc dưới bên trái, đúng theo yêu cầu không autoplay có âm thanh.

## 6. Deploy lên GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Sau đó vào **Settings → Pages** trên GitHub, chọn branch `main`, thư mục `/ (root)`. Vì tất cả đường dẫn asset trong code đều là **đường dẫn tương đối** (`assets/...`, `data/...`), site sẽ chạy đúng dù deploy ở root domain hay ở `username.github.io/repo-name/`.

> ⚠️ Repo hiện có ~650MB (video gốc + ảnh gốc + ảnh nén). GitHub giới hạn 100MB/file (video của bạn đều dưới mức này) và khuyến nghị repo dưới ~1GB — nên cân nhắc xoá `moments-original/` và `assets/images/imagesAndVideos/` trước khi đẩy lên Git nếu không cần giữ bản gốc trên GitHub.
>
> Chưa thực hiện bất kỳ lệnh git nào — sẽ chỉ chạy khi bạn xác nhận.

## 7. Tính năng đã triển khai

- 7 chapter đầy đủ theo brief (00 → 06), nội dung data-driven từ `memories.json`.
- Sticky chapter navigation (dot nav bên phải) + thanh progress bar trên cùng.
- Scroll-triggered reveal animation bằng GSAP + ScrollTrigger, có fallback IntersectionObserver khi GSAP không tải được.
- Tôn trọng `prefers-reduced-motion` (tắt animation, giữ nguyên nội dung).
- Editorial masonry gallery (173 ảnh thật, đã lọc trùng lặp + ảnh riêng tư) + lightbox (bàn phím: ←/→/Esc).
- Video reel (33 video thật, đã lọc video tối/mờ/trùng lặp): lazy-load, custom play/pause/mute/progress, tự nhận diện chiều dọc/ngang, chỉ 1 video phát cùng lúc, tự pause khi cuộn ra khỏi màn hình.
- Nhạc nền toggle, chỉ phát sau khi người dùng tương tác.
- Loading screen, xử lý ảnh/video thiếu bằng placeholder trực quan (không vỡ layout).
- Responsive mobile-first, keyboard navigation, focus state rõ ràng, favicon, SEO meta cơ bản.

## 8. Giới hạn hiện tại (known limitations)

- **Tên 6 địa điểm ở Chapter 02 chưa được xác nhận** — đang ghi "(cần xác nhận)" trong tiêu đề, xem `MEDIA_CATALOG.md` mục 6.
- **Chưa có ngày đi / nội dung thư thật** — cần bạn điền vào `memories.json`.
- **173 ảnh trong Chapter 03 mới lọc theo tiêu chí kỹ thuật** (trùng lặp, riêng tư rõ ràng) — chưa được bạn duyệt kỹ từng ảnh, nên tự lướt qua 1 lượt trước khi gửi.
- Video giữ nguyên dung lượng gốc (~307MB tổng) — nếu cần nhẹ hơn để gửi qua mạng yếu, báo tôi nén thêm.
- Chưa test trên Firefox/Safari thật — mới rà theo chuẩn web hiện hành, khuyến nghị tự kiểm tra trước khi gửi.
- Chưa init git / chưa deploy — theo yêu cầu bỏ qua git ở bước này.

## 9. Bước tiếp theo

1. Đọc `MEDIA_CATALOG.md` mục 6, xác nhận/sửa 6 tên địa điểm ở Chapter 02.
2. Lướt qua Chapter 03 một lượt, xoá bớt nếu có ảnh không muốn công khai.
3. Điền ngày đi, lời thư thật vào `memories.json`.
4. Thêm nhạc nền (tuỳ chọn).
5. Chạy local server, kiểm tra trên điện thoại thật.
6. Khi ok, báo để tiến hành `git init` + push + hướng dẫn bật GitHub Pages.
