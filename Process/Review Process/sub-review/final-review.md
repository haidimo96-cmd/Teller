# ✅ FINAL REVIEW CHECKLIST
# Dùng ở Step 3 sau khi ghép Hook + Body thành 1 file.
# Chỉ check FORMAT, CONSISTENCY, và các rules cần TOÀN BỘ SCRIPT.
# (Hook đã review ở Step 1, Body đã review ở Step 2)

---

## A. FORMAT & CẤU TRÚC FILE

- [ ] Prose liền mạch? KHÔNG có tiêu đề, ghi chú kỹ thuật, chia phần?
- [ ] Chỉ dùng `---` ngăn sections (chuyển bối cảnh/thời gian)?
- [ ] Không headers, labels, metadata, markers?
- [ ] Reddit Synopsis trong `<!-- PRODUCTION ONLY -->` nằm đúng vị trí?
- [ ] Present tense cho narration xuyên suốt? (không lẫn past tense)

## B. TRANSITIONS (hook → body)

- [ ] Chuyển từ Hook → P2 mượt? Không giật?
- [ ] Các transitions giữa P2 → P3 → ... → P9 tự nhiên?
- [ ] KHÔNG lặp scene đã kể ở Hook?

## C. FULL-SCRIPT RULES (cần đọc toàn bộ script)

### KT5 Motif Callback
- [ ] ≥1 chi tiết xuất hiện 3 lần với 3 ý nghĩa khác (giới thiệu → mất mát → closure)?

### KT11 Numeric Clarity (quét toàn script)
- [ ] TẤT CẢ số viết bằng chữ số? Tiền dùng $X,XXX?
- [ ] Không có "ba mươi mốt tuổi" → phải là "31 tuổi"?

### KT12 Terminology Consistency (quét toàn script)
- [ ] Mỗi khái niệm chỉ dùng 1 thuật ngữ xuyên suốt?
- [ ] Không lẫn "khu dân cư" / "khu phố" / "xóm" cho cùng 1 thứ?

### KT14 Dialogue Callback (toàn script)
- [ ] ≥1 câu thoại villain nói → hero dùng lại ở climax?
- [ ] Câu ≤15 từ? Power shift rõ ràng? Lần 3 trước công chúng?

### Hero Signature Line (tùy chọn)
- [ ] Có cụm từ đặc trưng hero lặp ≥3 lần? Weight thay đổi qua story?

## D. ANTI-PATTERNS QUÉT TOÀN SCRIPT

- [ ] ⛔ Tên nhân vật nhất quán EN ↔ VI?
- [ ] ⛔ Không dùng từ EN khi có từ Việt tương đương? (cho bản VI)
- [ ] ⛔ Hero bị động? (ally cứu hoàn toàn → sửa)
- [ ] ⛔ Prejudice vòng vo? (khi cốt lõi → nói thẳng)
- [ ] ⛔ Nhồi nhét cliffhanger? (mỗi cái phải tạo info gap thật)
- [ ] ⛔ Forward reference lộ bài?
- [ ] ⛔ So sánh thay hành động? (ưu tiên hành động cụ thể)

## E. WORD COUNT & TỔNG QUAN

- [ ] Word Count: 4.500–6.000 từ (EN)? Target: video 30-50 phút (~135 WPM)
- [ ] Ngôi kể nhất quán?
- [ ] Không kéo dài / thêm từ vô nghĩa?

## F. BẢNG SỬA LỖI TỪ NGỮ VI

- [ ] Đã kiểm tra `rules/script-wording-formula.md`? Sửa các từ ngữ phổ biến sai?

### 📋 Thuật ngữ pháp lý bản VI (từ Cau truc final)
- [ ] Mọi thuật ngữ Mỹ (lien, CC&Rs, foreclosure, cease & desist...) đều được giải thích inline 3 bước?
  1. Dramatic Beat: 1 câu ngắn tạo tension
  2. Giải thích đời thường: 1-2 câu dịch ý nghĩa
  3. Emotional Impact: 1 câu cảm xúc
- [ ] KHÔNG có thuật ngữ trần ("Rồi cái lien.") → viewer VN sẽ confused?

## G. ENCODING (cho file VI)

- [ ] Đọc lại file → không bị mojibake?
- [ ] Nếu mojibake → `python _tools/fix_encoding.py --fix --no-backup`

---

## OUTPUT

- Lưu file VI: `Kich Ban/VI/[PATTERN]/Script-[slug]-VI-V1.md`
- **🛑 DỪNG. Gửi script VI cho user duyệt.**
- Chờ user ra lệnh dịch EN → mới tiếp Step 4.
