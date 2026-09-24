# HUE — A Chapter of Us

An interactive, cinematic love-story website — a personal gift telling the story of a real trip to Hue, Vietnam. Static site, no build step, no backend.

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

Bạn đã xác nhận 250 file trong `assets/images/imagesAndVideos/images/` (203 ảnh + 47 video) là ảnh/video thật của chuyến đi Huế. Tôi đã:

1. **Nén ảnh để web tải nhanh**: mỗi ảnh gốc (~1-3MB) → resize còn tối đa 1600px, nén còn trung bình ~270KB, lưu tại `assets/images/moments/`. Bản gốc chưa đụng tới được giữ nguyên tại `assets/images/moments-original/` (đã kiểm tra checksum khớp 100% với bản gốc).
2. **Giữ nguyên video** — không nén (47 video, ~307MB) — vì video chỉ tải khi người xem bấm Play (lazy-load), nên không tốn băng thông nếu không xem. Nếu muốn giảm dung lượng gửi đi, có thể nhờ tôi nén video sau.
3. **Tự tạo poster/thumbnail** cho từng video bằng cách trích 1 khung hình, lưu tại `assets/images/posters/`.
4. **Đưa toàn bộ 203 ảnh vào Chapter 03 (The Little Things I Remember)** — vì đây là gallery tổng hợp, phù hợp để chứa mọi ảnh mà không cần biết ảnh nào chụp ở đâu.
5. **Đưa toàn bộ 47 video vào Chapter 04 (Moving Memories)**.

**Tôi CHƯA tự chọn ảnh cho:**
- `beforeWeLeft.heroImage` (ảnh nền lớn ở Chapter 01) — đang để trống.
- `journey.stops[].image` (ảnh đại diện từng địa điểm ở Chapter 02) — đang để trống, kèm placeholder `"PLACEHOLDER LOCATION"`.

Lý do: tôi thử chọn tự động 1 ảnh "landscape" đầu tiên làm hero, nhưng ảnh đó lại là một khoảnh khắc riêng tư (không phù hợp để làm ảnh mở đầu of site) và bị lật ngang do file gốc không có dữ liệu xoay ảnh (EXIF). Việc chọn ảnh nổi bật nhất site cần con người xem qua nội dung, không nên để thuật toán chọn ngẫu nhiên. **Bạn hãy tự chọn** 1 ảnh cho hero và tối đa vài ảnh cho từng địa điểm ở Chapter 02, rồi:

```json
"beforeWeLeft": {
  "heroImage": "assets/images/moments/<tên-file-bạn-chọn>.jpg"
},
"journey": {
  "stops": [
    { "index": "01", "title": "Tên địa điểm thật", "image": "assets/images/moments/<tên-file>.jpg", ... }
  ]
}
```

**Lưu ý riêng tư**: tôi đã xem lướt qua kết quả để kiểm tra hiển thị đúng, nhưng **chưa duyệt nội dung từng ảnh trong 203 ảnh**. Nếu trong đó có ảnh riêng tư không muốn xuất hiện trong gallery công khai của Chapter 03, bạn nên tự lướt qua site 1 lượt và xoá entry tương ứng khỏi `data/memories.json` (`moments.gallery`) trước khi gửi.

**Dọn dẹp còn lại**: thư mục gốc `assets/images/imagesAndVideos/` (545MB) hiện vẫn còn — toàn bộ nội dung của nó đã được sao chép an toàn vào `moments-original/` (ảnh) và `assets/videos/` (video, đã kiểm tra checksum khớp), nên bạn có thể tự xoá `assets/images/imagesAndVideos/` để giải phóng ổ đĩa nếu muốn. Tôi không tự xoá vì đây là thao tác khó hoàn tác trên 545MB dữ liệu gốc.

## 4. Sửa nội dung / lời nhắn

Toàn bộ text hiển thị (tiêu đề, caption, lá thư ở Chapter 05...) nằm trong `data/memories.json`. Các chỗ đang là placeholder được viết hoa rõ ràng, ví dụ:

- `journey.stops[].title` → `"PLACEHOLDER LOCATION"` — thay bằng tên địa điểm thật đã xác nhận.
- `letter.body` → mảng các đoạn văn — thay bằng lời nhắn thật của bạn.
- `trip.date`, `journey.stops[].date` → để trống, điền khi có ngày chính xác.
- `moments.gallery[].caption` → để trống cho cả 203 ảnh (tôi không tự bịa caption) — bạn có thể điền caption cho những ảnh muốn chú thích, để trống thì ảnh hiển thị không caption, không sao cả.

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
- Editorial masonry gallery (203 ảnh thật) + lightbox (bàn phím: ←/→/Esc).
- Video reel (47 video thật): lazy-load, custom play/pause/mute/progress, tự nhận diện chiều dọc/ngang, chỉ 1 video phát cùng lúc, tự pause khi cuộn ra khỏi màn hình.
- Nhạc nền toggle, chỉ phát sau khi người dùng tương tác.
- Loading screen, xử lý ảnh/video thiếu bằng placeholder trực quan (không vỡ layout).
- Responsive mobile-first, keyboard navigation, focus state rõ ràng, favicon, SEO meta cơ bản.

## 8. Giới hạn hiện tại (known limitations)

- **Chưa có ảnh hero (Chapter 01) và ảnh địa điểm (Chapter 02)** — cần bạn tự chọn (xem mục 3).
- **Chưa có tên địa điểm/ngày/nội dung thư thật** — cần bạn điền vào `memories.json`.
- **203 ảnh trong Chapter 03 chưa được bạn duyệt riêng tư** — nên tự lướt qua 1 lượt trước khi gửi.
- Video giữ nguyên dung lượng gốc (~307MB tổng) — nếu cần nhẹ hơn để gửi qua mạng yếu, báo tôi nén thêm.
- Chưa test trên Firefox/Safari thật — mới rà theo chuẩn web hiện hành, khuyến nghị tự kiểm tra trước khi gửi.
- Chưa init git / chưa deploy — theo yêu cầu bỏ qua git ở bước này.

## 9. Bước tiếp theo

1. Tự chọn ảnh hero (Chapter 01) + ảnh cho từng địa điểm (Chapter 02), điền vào `memories.json`.
2. Lướt qua Chapter 03 một lượt, xoá bớt nếu có ảnh không muốn công khai.
3. Điền tên địa điểm, ngày, lời thư thật vào `memories.json`.
4. Thêm nhạc nền (tuỳ chọn).
5. Chạy local server, kiểm tra trên điện thoại thật.
6. Khi ok, báo để tiến hành `git init` + push + hướng dẫn bật GitHub Pages.
