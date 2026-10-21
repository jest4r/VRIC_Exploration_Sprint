# Product brief — hỗ trợ hội chẩn sau kết quả

**Trạng thái:** ý tưởng roadmap, chưa phải tính năng vận hành và chưa được xác thực bằng dữ liệu lâm sàng. P2 mới là solution signal; cần phỏng vấn bác sĩ, điều phối hội chẩn và rà soát chuyên môn trước khi xây.

## 1. Cơ hội

Sau khi các phiếu xét nghiệm/chẩn đoán hình ảnh đã được phát hành và bác sĩ đã đối chiếu, một số ca có thể cần thêm ý kiến liên chuyên khoa. Sản phẩm hiện đã có điểm nối tự nhiên: **kết quả đã có → bác sĩ xem/duyệt → quyết định bước tiếp theo**.

Ý tưởng không phải “AI chẩn đoán thay bác sĩ”. Ý tưởng là một lớp hỗ trợ giúp bác sĩ:

1. Nhận biết ca nào cần cân nhắc hội chẩn dựa trên tín hiệu đã được bác sĩ xác nhận.
2. Đề xuất các chuyên khoa/chức năng phù hợp, kèm lý do và nguồn dữ liệu.
3. Chuẩn bị brief hội chẩn có cấu trúc để hội đồng đọc nhanh.
4. Ghi nhận ý kiến, bất đồng, quyết định và bước tiếp theo trong một nơi.

## 2. Người dùng và trách nhiệm

| Vai trò | Job | Quyền kiểm soát |
| --- | --- | --- |
| Bác sĩ phụ trách | Quyết định có mở hội chẩn không, chỉnh brief, chọn người mời và duyệt đề xuất | Quyết định cuối; có thể sửa/bỏ qua mọi đề xuất |
| Điều phối hội chẩn | Kiểm tra tính đầy đủ, lịch, thành phần và trạng thái cuộc họp | Không tự biến đề xuất AI thành chỉ định |
| Bác sĩ chuyên khoa được mời | Đọc brief, bổ sung ý kiến, nêu bất đồng và đề xuất bước tiếp theo | Chỉ xem dữ liệu được cấp quyền |
| Người bệnh/người nhà | Nhận thông tin đã được bác sĩ quyết định và giải thích khi phù hợp | Không xem bản nháp nội bộ hoặc suy luận chưa duyệt |
| AI | Trích xuất, sắp xếp, gợi ý và nêu điểm thiếu | Không chẩn đoán cuối, không tự mời hội đồng, không tự gửi kết luận |

## 3. Luồng đề xuất sau khi có kết quả

```text
Phiếu nguồn đã phát hành
        ↓
Bác sĩ đối chiếu và chọn “Cân nhắc hội chẩn”
        ↓
Chọn lý do / câu hỏi cần hội chẩn + phạm vi dữ liệu
        ↓
AI tạo brief nháp và đề xuất chuyên khoa
        ↓
Bác sĩ sửa, bỏ qua hoặc thêm người; xác nhận gửi điều phối
        ↓
Điều phối kiểm tra quyền truy cập, lịch và thành phần
        ↓
Hội đồng xem brief, thảo luận, ghi ý kiến/bất đồng
        ↓
Bác sĩ phụ trách duyệt quyết định và bước tiếp theo
        ↓
Cập nhật hồ sơ; chỉ phần được duyệt mới có thể giải thích cho người bệnh
```

### Trạng thái tối thiểu

`not_requested` → `draft` → `clinician_review` → `coordinator_review` → `scheduled` → `in_discussion` → `decision_pending` → `approved` → `closed`

Có thể chuyển sang `cancelled` hoặc `needs_more_data` ở các bước trước khi duyệt. Mọi chuyển trạng thái cần người thực hiện, thời điểm và lý do.

## 4. Hai nhóm tính năng

### A. Đề xuất hội đồng phù hợp

Input tối thiểu:

- Câu hỏi lâm sàng do bác sĩ viết hoặc chọn, không để AI tự đặt mục tiêu mơ hồ.
- Các kết quả đã được bác sĩ chọn đưa vào ca.
- Chuyên khoa đã tham gia và lý do cần thêm ý kiến.
- Danh mục chuyên khoa/chuyên gia được bệnh viện quản lý: chuyên môn, phạm vi, lịch, trạng thái sẵn sàng.
- Các ràng buộc quyền truy cập và dữ liệu được phép chia sẻ.

Output nháp:

- 2–3 chuyên khoa/chức năng có thể phù hợp.
- Lý do cho từng đề xuất, trỏ về dữ liệu nguồn hoặc quy tắc cấu hình.
- Điểm thiếu dữ liệu và câu hỏi cần làm rõ.
- Xung đột lịch hoặc ràng buộc điều phối nếu có.

AI không trả “bác sĩ tốt nhất” như một sự thật, không tự xếp hạng cá nhân bằng dữ liệu hiệu suất chưa được phê duyệt, và không tự gửi lời mời.

### B. Hỗ trợ trong hội chẩn

Brief nháp nên có các phần cố định:

1. Câu hỏi hội chẩn.
2. Tóm tắt bối cảnh và mục tiêu của ca.
3. Kết quả liên quan, giữ nguyên giá trị/đơn vị/thời điểm/nguồn.
4. Diễn biến hoặc dữ liệu còn thiếu.
5. Các điểm cần xác nhận, không chắc chắn hoặc mâu thuẫn.
6. Các câu hỏi gợi ý cho từng chuyên khoa.
7. Các phương án được thảo luận, lý do ủng hộ/phản đối.
8. Quyết định của bác sĩ và bước tiếp theo do con người nhập.

Mỗi phần do AI tạo phải có nhãn `bản nháp`, nguồn tham chiếu và thao tác mở nguồn. Ý kiến bác sĩ phải tách khỏi text AI để không tạo ấn tượng AI đã quyết định.

## 5. MVP có thể phát triển từ sản phẩm hiện tại

Không bắt đầu bằng dự đoán chẩn đoán hoặc tự động chọn người. MVP nên là **brief hội chẩn có nguồn + đề xuất chuyên khoa theo danh mục cấu hình**.

### User stories

- Là bác sĩ phụ trách, tôi muốn đánh dấu một ca cần cân nhắc hội chẩn sau khi xem kết quả, để mở đúng quy trình mà không phải chép dữ liệu sang nơi khác.
- Là bác sĩ phụ trách, tôi muốn nhận một brief nháp có nguồn và điểm thiếu dữ liệu, để chuẩn bị câu hỏi nhanh hơn nhưng vẫn tự kiểm tra.
- Là điều phối viên, tôi muốn thấy lý do, chuyên khoa đề xuất và quyền truy cập, để kiểm tra trước khi gửi lời mời.
- Là bác sĩ chuyên khoa, tôi muốn ghi ý kiến và bất đồng riêng, để quyết định cuối cùng không bị biến thành một câu trả lời AI duy nhất.
- Là bác sĩ phụ trách, tôi muốn duyệt quyết định và bước tiếp theo, để chỉ nội dung đã xác nhận mới quay lại luồng người bệnh.

### Acceptance criteria cho MVP

- Chỉ bác sĩ/phân quyền phù hợp mới có thể tạo hoặc xem ca hội chẩn.
- Không tạo ca hội chẩn chỉ từ một cờ H/L hoặc một output AI chưa được bác sĩ xem.
- Mọi đề xuất chuyên khoa đều có lý do, nguồn hoặc quy tắc cấu hình; thiếu nguồn thì hiển thị “chưa đủ dữ liệu”.
- Bác sĩ có thể sửa toàn bộ brief, bỏ đề xuất, thêm người và gửi lại.
- AI không được tạo giá trị xét nghiệm, chẩn đoán, chỉ định điều trị hoặc kết luận cuối.
- Bất đồng của chuyên gia được lưu riêng, không bị AI gộp thành đồng thuận giả.
- Bản nháp không hiển thị cho người bệnh; chỉ quyết định đã duyệt mới được chọn để giải thích.
- Nếu AI lỗi, hồ sơ nguồn và thao tác thủ công vẫn dùng được.
- Mọi truy cập, chỉnh sửa, duyệt, gửi và hủy đều có audit log.

## 6. Dữ liệu và kiến trúc gợi ý

Tái sử dụng các khái niệm hiện có `sourceVersion`, phiếu nguồn, bản nháp, duyệt và revision; không đưa dữ liệu hội chẩn vào summary người bệnh trước khi duyệt.

```text
consultationCase
  id, visitId, clinicalQuestion, status, createdBy
  includedSourceIds[], specialties[], accessPolicy
  briefDraft, draftVersion, approvedDecision
  participants[], comments[], auditEvents[]
```

Tách ba lớp dữ liệu:

- **Nguồn:** kết quả, ghi chú và dữ liệu đã được phép đưa vào ca.
- **Suy luận nháp:** đề xuất chuyên khoa, brief, câu hỏi; có version và nguồn.
- **Quyết định:** nội dung do bác sĩ/chuyên gia xác nhận, có người duyệt và thời điểm.

Không gửi toàn bộ bệnh án cho model theo mặc định. Dùng allowlist trường dữ liệu, masking, retention policy và phạm vi truy cập theo vai trò.

## 7. Metrics học được

Không đo thành công bằng số ca AI tạo ra. Đo theo tầng:

- **Workflow:** thời gian chuẩn bị brief; tỷ lệ brief được bác sĩ sửa lớn; tỷ lệ đề xuất bị bỏ qua; thời gian từ mở ca đến đủ thành phần.
- **Chất lượng hỗ trợ:** citation/source coverage; lỗi bỏ sót dữ liệu quan trọng; độ chính xác của đề xuất chuyên khoa theo đánh giá chuyên gia.
- **An toàn:** số lần AI tạo thông tin không có nguồn; truy cập sai quyền; số quyết định bị thu hồi; tỷ lệ escalation.
- **Giá trị:** bác sĩ có dùng lại không; hội đồng có thấy brief giúp chuẩn bị tốt hơn không; chưa suy ra giảm thời gian điều trị hoặc kết quả lâm sàng nếu chưa có thiết kế nghiên cứu phù hợp.

## 8. Experiment trước khi xây MVP

Cùng một ca giả lập và cùng dữ liệu, so sánh ba cơ chế:

- **A — User-led:** bác sĩ tự chọn chuyên khoa từ danh mục và tự viết brief.
- **B — Collaborative:** hệ thống đề xuất 2–3 chuyên khoa và hỏi bác sĩ xác nhận/sửa lý do.
- **C — Proactive:** hệ thống tự mở gợi ý sau khi bác sĩ đánh dấu cần hội chẩn.

Quan sát: bác sĩ chọn gì đầu tiên, có mở nguồn không, sửa gì, bỏ qua gì, mất bao lâu, có phát hiện đề xuất sai không và recovery ra sao. Không hỏi riêng “ý tưởng có hay không” rồi coi là evidence.

## 9. Go / no-go

**Conditional go** cho prototype nội bộ dùng dữ liệu giả lập, với human-in-the-loop và chuyên gia đánh giá. **No-go** nếu chưa có phân quyền dữ liệu, audit log, fallback thủ công, owner chịu trách nhiệm, tiêu chí đánh giá chuyên môn và cơ chế chuyển bác sĩ khi AI không chắc chắn.

Giai đoạn đầu chỉ nên hỗ trợ **tổng hợp có nguồn và điều phối**, chưa làm dự đoán chẩn đoán, tự chọn cá nhân hoặc tư vấn trực tiếp cho người bệnh.
