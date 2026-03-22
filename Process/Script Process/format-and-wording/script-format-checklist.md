# ⛔ SCRIPT FORMAT CHECKLIST — ĐỌC MỖI LẦN VIẾT KỊCH BẢN

> **Mục đích:** File này chỉ chứa FORMAT OUTPUT — cách trình bày file script.
> Không chứa rules nội dung (KT techniques, storytelling). Đọc 30 giây. Không skip.
>
> **Khi nào đọc:** MỖI LẦN trước khi viết script mới hoặc sửa script.

---

## TRƯỚC KHI VIẾT — BẮT BUỘC:

- [ ] Mở 1 file script hoàn chỉnh trong `Kich Ban/` → đọc 20 dòng đầu + 20 dòng cuối → nắm format
- [ ] Xác nhận: file script đọc như TRUYỆN NGẮN, không như tài liệu kỹ thuật

---

## FORMAT BẮT BUỘC:

| Yếu tố | ✅ Đúng | ❌ Sai |
|---------|---------|--------|
| **Cấu trúc** | Văn xuôi liền mạch, prose chảy liên tục | Headers (`## PART 1:`, `### HOOK`) |
| **Ngăn cách** | Chỉ dùng `---` (chuyển bối cảnh/thời gian) | Heading markdown, bullet list |
| **Narrator** | Nói tự nhiên TRONG dòng văn | Labels `[NARRATOR]`, `[VO]` |
| **CTA** | Viết liền cuối file, prose bình thường | Tách block `[NARRATOR — CTA]` |
| **Reddit Synopsis** | `<!-- PRODUCTION ONLY -->` HTML comment ở đầu file | `## REDDIT SYNOPSIS` heading |
| **Metadata** | KHÔNG CÓ — file sạch hoàn toàn | `*Word count:*`, `*KTs used:*`, `*Pattern:*` ở cuối |
| **Emotion/Goal notes** | KHÔNG CÓ trong script | `**AUDIENCE EMOTION:**`, `**GOAL:**`, `**WHY IT WORKS:**` |
| **Dialogue** | Nằm trong dòng văn, dùng `"..."` | Tách riêng thành block quote |

---

## KHÔNG BAO GIỜ:

- ❌ Copy cấu trúc outline (headers, labels, tags) sang script
- ❌ Dùng bullet points / numbered lists trong script body
- ❌ Để production notes / meta-commentary trong script text
- ❌ Dùng bold cho emotion labels (`**AUDIENCE EMOTION:**`)
- ❌ Kết file bằng metadata block

---

## MẪU ĐẦU FILE:

```markdown
<!-- PRODUCTION ONLY - KHÔNG đọc VO -->
**[REDDIT SYNOPSIS]**
r/FuckHOA — Title: "..."

[Nội dung 150-250 từ, ngôi 1, casual, có twist]
<!-- END PRODUCTION ONLY -->

---

"Câu đầu tiên của script — villain line hoặc action line." [Prose bắt đầu ngay]
```

## MẪU CUỐI FILE:

```markdown
[...dòng cuối của câu chuyện. Prose. Không label.]

---

Nếu bạn từng [CTA liên quan]... bình luận đi. Kể cho tôi nghe.

Tuần sau: [sequel tease]. Đăng ký — bạn không muốn bỏ lỡ.

[Câu đóng memorable. Không metadata. Không tags. Hết.]
```

---

## PHÂN BIỆT: OUTLINE vs SCRIPT

| | Outline (Dàn ý) | Script (Kịch bản) |
|--|------------------|-------------------|
| **Mục đích** | Kế hoạch cho người viết | Tác phẩm cho người nghe |
| **Headers** | ✅ Có (`### PART 1:`) | ❌ Không |
| **Labels** | ✅ Có (`MINI ARC QUESTION:`) | ❌ Không |
| **Meta notes** | ✅ Có (`WHY IT WORKS:`) | ❌ Không |
| **Format** | Tài liệu kỹ thuật | Truyện ngắn văn học |
| **Đọc bởi** | Agent/người viết | Narrator/viewer |

> **Quy tắc vàng:** Nếu bạn đọc to file script và nghe thấy "PART ONE, COLON, HOOK" — file đó SAI FORMAT.

---

*Tạo: 19/03/2026*
*Nguồn lỗi: Script treehouse-war V1 viết sai format (copy outline headers vào script)*
