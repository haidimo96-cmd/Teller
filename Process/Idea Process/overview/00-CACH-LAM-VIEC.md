# 📋 CÁCH LÀM VIỆC TỐI ƯU — 2 KÊNH YOUTUBE

*Hướng dẫn toàn diện để sản xuất nội dung cho 2 kênh YouTube song song. Cập nhật lần cuối: 2026-03-19.*

---

## 📌 NGUYÊN TẮC CỐT LÕI

1. **Không bao giờ viết kịch bản mà chưa biết tập tiếp theo là gì** → Luôn kiểm tra `00-MASTER-SCHEDULE.md` trước khi viết.
2. **Chia đều 3 thể loại** (🔥 FURY, 🧠 STRATEGY, 😂 COMEDY) cho mỗi kênh → Tránh khán giả bị ngộp một pattern.
3. **Pipeline Planning** — Có ít nhất 2 ý tưởng "One-Liner" chờ sẵn trong `00-MASTER-SCHEDULE.md` để câu Hook cuối video luôn có nội dung tham chiếu.
4. **Mỗi tập phải có Hook cụ thể** — Không dùng câu sáo rỗng ("tập sau còn điên hơn"). Phải tease tình tiết cốt truyện cụ thể.

---

## ⚡ QUY TRÌNH SPRINT 1 NGÀY — Từ Idea → Video Hoàn Chỉnh

> **Mục tiêu:** Hoàn thành 1 video trong 1 ngày (~6-8 giờ làm việc). Nếu chạy 2 ngày/tuần = 2 video (1 C1 + 1 C2). Ngày còn lại dành cho edit video, analytics, và tìm idea mới.

### ⏰ TỔNG QUAN TIMELINE

```
 8:00 ──── PHASE 1: Chọn idea + Check Schedule          (30 phút)
 8:30 ──── PHASE 2: Tạo dàn ý (Outline)                 (45 phút)
 9:15 ──── ☕ Nghỉ 15 phút
 9:30 ──── PHASE 3: Viết kịch bản EN + VI                (90 phút)
11:00 ──── PHASE 4: Review + Chỉnh sửa                   (45 phút)
11:45 ──── 🍜 Nghỉ trưa 45 phút
12:30 ──── PHASE 5: Tạo VO Script + Generate audio       (45 phút)
13:15 ──── ☕ Nghỉ 15 phút
13:30 ──── PHASE 6: Tạo Title + Thumbnail                (30 phút)
14:00 ──── PHASE 7: Kiểm tra chéo Hook + Cập nhật lịch   (15 phút)
14:15 ──── ✅ HOÀN THÀNH — Sẵn sàng đăng hoặc schedule
```

> 💡 **Bỏ bước Final:** Pipeline hiện tại đi thẳng từ Script → VO Script. File Script EN đã là narrative text thuần — đủ cho VO. Dùng `/full-pipeline` để chạy tự động.

---

### PHASE 1 — 🧠 CHỌN IDEA + CHECK SCHEDULE *(8:00 – 8:30, 30 phút)*

| Bước | Hành động | Công cụ |
|:---|:---|:---|
| 1a | Mở `00-MASTER-SCHEDULE.md` → Xác định tập tiếp theo cần làm (VD: `C1-E04`) | — |
| 1b | Idea đã có sẵn trong Schedule? → Bỏ qua bước tìm idea, nhảy sang Phase 2 | — |
| 1c | Chưa có idea? → Lướt Reddit 15 phút, chọn bài ≥10K upvotes | Trình duyệt |
| 1d | Đánh giá nhanh idea (chỉ cần mental check, không cần chấm điểm đầy đủ) | `/danh-gia-idea` *(nếu cần)* |
| 1e | Ghi One-Liner vào Schedule + Xác nhận tập tiếp theo (để viết Hook chuẩn) | `00-MASTER-SCHEDULE.md` |

> 💡 **Mẹo tăng tốc:** Dành 1 buổi tối/tuần chỉ để lướt Reddit và gom 5-10 idea vào `Ideas/`. Khi Sprint, bạn chỉ cần "chọn" chứ không phải "tìm" — tiết kiệm 20 phút.

---

### PHASE 2 — 📝 TẠO DÀN Ý *(8:30 – 9:15, 45 phút)*

> `/tao-dan-y` — 2 steps: **Step 1** Story Prep + Inventory → **Step 2** Arc Map + Outline.

| Bước | Hành động | Công cụ |
|:---|:---|:---|
| 2a | Xác định Pattern: FURY / STRATEGY / COMEDY | — |
| 2b | Chạy AI tạo dàn ý (Step 1: Prep → duyệt → Step 2: Arc Map) | `/tao-dan-y` |
| 2c | Đọc lướt output → Sửa nhanh nếu cần (đặc biệt kiểm tra SEQUEL HOOK ở cuối dàn ý) | — |
| 2d | Lưu file `Outline-[slug]-V1.md` vào `Dan Y/[PATTERN]/` | — |

> ☕ **NGHỈ 15 PHÚT** — Tách não khỏi cấu trúc trước khi viết prose.

---

### PHASE 3 — ✍️ VIẾT KỊCH BẢN EN + VI *(9:30 – 11:00, 90 phút)*

> `/viet-kich-ban` — 3 steps:
> **Step 1** Hook → duyệt → **Step 2** Body → duyệt → **Step 3** Review + Assembly + Dịch VI

| Bước | Hành động | Công cụ |
|:---|:---|:---|
| 3a | Mở dàn ý | — |
| 3b | Step 1: AI viết Hook → duyệt | `/viet-kich-ban` |
| 3c | Step 2: AI viết Body (P2-P9) → duyệt | `/viet-kich-ban` |
| 3d | Step 3: AI review hành văn + ghép + dịch VI | `/viet-kich-ban` |
| 3e | **NGAY LÚC NÀY:** Mở `00-MASTER-SCHEDULE.md` → Viết câu Hook CTA cuối video | — |

> ⚠️ **Quy tắc 90 phút:** Nếu AI output chưa hoàn hảo 100% → KHÔNG sửa lại. Đánh dấu và sửa ở Phase 4. Tránh perfection trap ở giai đoạn viết.

---

### PHASE 4 — 🔍 REVIEW + CHỈNH SỬA *(11:00 – 11:45, 45 phút)*

| Bước | Hành động | Công cụ |
|:---|:---|:---|
| 4a | Chạy AI review kịch bản | `/review` |
| 4b | Sửa các điểm critical (Hook, Punchline, Cliffhanger, CTA) | Thủ công |
| 4c | Sửa các điểm đã đánh dấu ở Phase 3 | — |
| 4d | Lưu thành V2: `Script-[slug]-EN-V2.md` | — |

> 🍜 **NGHỈ TRƯA 45 PHÚT** — Ăn uống, nghỉ ngơi. Quay lại với đầu óc tỉnh táo.

---

> ~~### PHASE 5 — TẠO FINAL~~ *(ĐÃ BỎ — Script EN đi thẳng sang VO)*

---

### PHASE 5 — 🎤 TẠO VO SCRIPT + GENERATE AUDIO *(12:30 – 13:15, 45 phút)*

| Bước | Hành động | Công cụ |
|:---|:---|:---|
| 5a | Chuyển **Script EN** → Script Note với audio tags | `/tao-script-note` |
| 5b | Chia thành các Part (mỗi Part ≤ 800 từ) | Thủ công |
| 5c | Chạy generate voice trên ElevenLabs (hoặc thu âm) | ElevenLabs |
| 5d | Nghe lướt output → Đánh dấu Part nào cần re-generate | — |

> ☕ **NGHỈ 15 PHÚT**

---

### PHASE 6 — 🎬 TẠO TITLE + THUMBNAIL *(13:30 – 14:00, 30 phút)*

| Bước | Hành động | Công cụ |
|:---|:---|:---|
| 6a | Tạo 5 gợi ý Title (dùng **Script EN**) | `/tao-title` |
| 6b | Chọn Title tốt nhất (ưu tiên: có con số + cliff + emotion) | — |
| 6c | Tạo thumbnail | Canva / AI generate |

---

### PHASE 7 — ✅ KIỂM TRA CHÉO + CẬP NHẬT *(14:00 – 14:15, 15 phút)*

| Bước | Hành động |
|:---|:---|
| 7a | **KIỂM TRA CHÉO HOOK:** So sánh câu Hook cuối video này với TẤT CẢ video khác trên cùng kênh → Không trùng? |
| 7b | Cập nhật trạng thái trong `00-MASTER-SCHEDULE.md` → Đánh dấu "✅ Sẵn sàng" hoặc "✅ Đã lên sóng" |
| 7c | Upload video / Schedule đăng bài trên YouTube Studio |
| 7d | **TÌM IDEA CHO TUẦN SAU (5 phút):** Ghi nhanh 1-2 One-Liner cho các tập tiếp theo nếu chưa có |

**🎉 XONG! Tổng thời gian làm việc thực: ~5.5 tiếng. Thời gian nghỉ: ~1 tiếng.**

---

### 📅 LỊCH TUẦN GỢI Ý (Khi dùng Sprint 1 ngày)

| Ngày | Việc làm | Ghi chú |
|:---|:---|:---|
| **Thứ 2** | 🎬 Sprint Video 1 (cho C1) | 1 ngày hoàn chỉnh |
| **Thứ 3** | ✂️ Edit video 1 + Re-generate VO nếu cần | Hậu kỳ |
| **Thứ 4** | 🎬 Sprint Video 2 (cho C2) | 1 ngày hoàn chỉnh |
| **Thứ 5** | ✂️ Edit video 2 + Đăng video 1 | Hậu kỳ + Upload |
| **Thứ 6** | 📡 Đăng video 2 + Lướt Reddit gom idea | Upload + Pipeline |
| **Thứ 7** | 🧘 Analytics + Đọc comment + Lên kế hoạch | Nghỉ nhẹ |
| **CN** | 🏖️ Nghỉ | — |

> **Tốc độ sản xuất:** 2 video / tuần (1 C1 + 1 C2). Nếu muốn 4 video/tuần: Sprint 4 ngày, Edit 2 ngày, Nghỉ 1 ngày.

---

## 📂 CẤU TRÚC THƯ MỤC & FILE NAMING

```
KICH BAN YT/
├── 00-MASTER-SCHEDULE.md     ← Lịch phát sóng + Hook chain
├── 00-CACH-LAM-VIEC.md       ← File này
│
├── .agent/                    ← Rules + Workflows (agent đọc)
│   ├── rules/
│   │   ├── core/              ← Rules cốt lõi (writing-craft, structure...)
│   │   └── script-phases/     ← Phase rules cho /viet-kich-ban
│   │       ├── phase-1-hook.md
│   │       └── phase-2-body.md
│   └── workflows/             ← Slash commands
│
├── Ideas/                     ← Ý tưởng thô (One-Liner)
├── Dan Y/                     ← Dàn ý (Outline)
├── Kich Ban/                  ← Kịch bản (Script EN + VI) — file chính
├── Review/                    ← Kết quả review
├── Process VO/                ← Script Note cho thu âm
├── Title/                     ← Gợi ý title
│
├── Cau truc final/            ← Pattern Templates (tham khảo, không bắt buộc đọc)
├── Story Patterns/            ← Mẫu HOA sub-genre
├── Research/                  ← Tài liệu nghiên cứu
│
├── _archive/                  ← Backup cũ (gitignored)
├── _tools/                    ← Utility scripts (gitignored)
├── Final/                     ← ⚠️ DEPRECATED (giữ cho backward compatibility)
└── Tom Tat/                   ← Summaries
```

### ~~Quy tắc đặt tên file Final~~ *(DEPRECATED — Phase Final đã bỏ từ v3.0)*

> ⚠️ **Không còn sử dụng.** Script EN đi thẳng sang VO. File Script EN đã là narrative text thuần — đủ cho mọi mục đích.
> Giữ lại phần này để tham khảo cho các file cũ đã tạo trước v3.0.

```
[Mã Kênh]-[Số Tập]-Final-[slug]-EN-V[N].md

Ví dụ:
C1-E01-Final-hoa-halloween-ban-voted-out-EN-V1.md
C2-E03-Final-hoa-karen-pride-lights-EN-V1.md
```

---

## 🔗 QUY TẮC HOOK (Teaser Cuối Video)

### ❌ SAI — Câu sáo rỗng:
- ~~"Subscribe vì video sau còn điên rồ hơn!"~~
- ~~"Câu chuyện tiếp theo sẽ khiến bạn không tin nổi!"~~
- ~~"The strategy is even better."~~

### ✅ ĐÚNG — Tease nội dung cụ thể:
- "Subscribe — vì video sau kể về một bà cụ 74 tuổi bị tịch thu nhà chỉ vì nợ $1,400. Và người mua nhà chính là chủ tịch HOA."
- "Subscribe — vì tập tới là câu chuyện về một ông cụ thợ xây dùng 3 tấm pallet gỗ để lật đổ cả một đế chế HOA."

### Cách viết Hook đúng:
1. Mở file `00-MASTER-SCHEDULE.md`
2. Tìm tập TIẾP THEO của kênh đang viết (VD: đang viết C1-E03 → tìm C1-E04)
3. Lấy nội dung cốt truyện của tập đó
4. Viết 1-2 câu tease chi tiết hấp dẫn nhất (nhân vật + hành động + con số)

---

## 🔄 SLASH COMMANDS — Tham Chiếu Nhanh

| Lệnh | Chức năng | Phase Sprint |
|:---|:---|:---|
| **`/full-pipeline`** | **Pipeline đầy đủ Idea → Script → VO → Title** | **Phase 1-6 (tự động)** |
| `/phan-tich-doi-thu` | Phân tích kịch bản đối thủ | Pre-Sprint — Research |
| `/danh-gia-idea` | Đánh giá idea (scoring) | Phase 1 — Chọn idea |
| `/danh-gia-idea-p2` | Đánh giá idea (phần 2) | Phase 1 — Chấm điểm |
| `/tao-dan-y` | Tạo dàn ý chi tiết | Phase 2 — Outline |
| `/viet-kich-ban` | Viết kịch bản EN + VI | Phase 3 — Script |
| `/review` | Review kịch bản | Phase 4 — QA |
| `/tao-script-note` | Tạo Script Note cho VO (dùng Script EN) | Phase 5 — VO |
| `/tao-title` | Tạo 5 gợi ý title (dùng Script EN) | Phase 6 — Title |

---

## ⚡ CHECKLIST NHANH TRƯỚC KHI ĐĂNG VIDEO

- [ ] Hook cuối video đã tease cụ thể nội dung tập tiếp theo (không sáo rỗng)?
- [ ] Hook cuối KHÔNG trùng với bất kỳ video nào khác trên cùng kênh?
- [ ] Đã cập nhật trạng thái video trong `00-MASTER-SCHEDULE.md`?
- [ ] File Final đã được gắn tiền tố `C[X]-E[XX]`?
- [ ] Title đã được chọn và tối ưu cho CTR?
- [ ] Thumbnail đã tạo?
- [ ] End screen trỏ đúng video tiếp theo trong chuỗi?

---

## 📊 KPI THEO DÕI HÀNG TUẦN

| Chỉ số | Mục tiêu | Ghi chú |
|:---|:---|:---|
| Số video đăng / tuần | 2 (1 C1 + 1 C2) | Tối thiểu |
| Idea mới trong hàng đợi | ≥ 4 (đủ cho 2 tuần) | Pipeline buffer |
| AVD (Average View Duration) | ≥ 50% video length | Analytics |
| CTR (Click Through Rate) | ≥ 5% | Title + Thumbnail |
| End Screen Click Rate | ≥ 3% | Hook quality |

---

## 🚨 CÁC LỖI THƯỜNG GẶP (Đã Xảy Ra — Tránh Lặp Lại)

### Lỗi 1: Hook trùng lặp giữa các kịch bản
**Vấn đề:** 3 kịch bản khác nhau đều tease cùng 1 video (vụ $55,000).
**Giải pháp:** Luôn kiểm tra `00-MASTER-SCHEDULE.md` trước khi viết Hook. Mỗi video chỉ được tease bởi DUY NHẤT 1 video trước nó trong cùng kênh.

### Lỗi 2: Hook quá chung chung
**Vấn đề:** "video sau còn điên hơn" — không tạo tò mò cụ thể.
**Giải pháp:** Hook phải chứa ít nhất: 1 nhân vật + 1 hành động + 1 con số/chi tiết cụ thể.

### Lỗi 3: Không biết thứ tự phát sóng
**Vấn đề:** Không biết video nào ra trước, video nào ra sau.
**Giải pháp:** Dùng mã `C[X]-E[XX]` trên tên file + Bảng `00-MASTER-SCHEDULE.md`.

### Lỗi 4: Quên cập nhật Schedule khi thêm/đổi kịch bản
**Vấn đề:** Schedule cũ không khớp với thực tế.
**Giải pháp:** Mỗi khi thay đổi thứ tự hoặc thêm kịch bản mới → Cập nhật ngay `00-MASTER-SCHEDULE.md` + sửa Hook của tập trước đó.

### Lỗi 5: Lỗi Font / Mã Hoá Ký Tự (Mojibake & Replacement Characters)
**Vấn đề:** Các file kịch bản tự nhiên bị hỏng dấu tiếng Việt (ví dụ: `đ` biến thành `Ä'á»‹nh`, hoặc mất hẳn dấu thành ký tự ``); file tiếng Anh bị lỗi smart quotes. Đây là lỗi double-encoding khi lưu nhầm định dạng (thường là CP1252/Latin-1 thay vì UTF-8).
**Giải pháp & Nguyên tắc phòng ngừa:**
1. **Luôn lưu file ở định dạng UTF-8 (without BOM).**
2. **Không dùng tool lạ / AI prompt can thiệp sai encoding.** Khi copy-paste script, dùng "Paste as Plain Text" (Ctrl+Shift+V).
3. **Cách cấp cứu khi xảy ra lỗi:**
   - Chạy `python _tools/fix_encoding.py --fix --no-backup` để tự động fix.
   - Hoặc dùng `_tools/fix_encoding_safe.py` để xuất file fix và kiểm tra kỹ bằng mắt trước.
   - Luôn duy trì backup (Google Drive Version History hoặc `_archive/`).

---

*File version: 4.0 — 2026-03-19 — Cập nhật /tao-dan-y (2 steps), /viet-kich-ban (3 steps), dọn workspace (_archive/, _tools/), bỏ Cau truc final khỏi pipeline.*
*v3.1: Deprecated Final folder/naming, clarified Cau truc final = Pattern Templates.*
*v3.0: Bỏ Phase Final, Sprint 7 Phase / ~5.5h. Thêm `/full-pipeline`.*
*v2.0: Sprint 1 ngày (8 Phase / ~6h)*
*v1.0: Lịch 7 ngày (mỗi ngày 1 bước)*
*Tác giả: Tự động tạo bởi AI, tùy chỉnh bởi chủ kênh*
