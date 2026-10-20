# Prompt và khai báo AI

Ngày 20/10/2026. Codex hỗ trợ nghiên cứu bàn, viết tài liệu, giao diện, mã và test. P1–P3 có tóm tắt do người thực hiện cung cấp, nhưng chưa đủ problem evidence/trích dẫn nguyên văn để xác thực need; mã cũng chưa được đánh giá chuyên môn y khoa.

## PROMPT-01 — yêu cầu triển khai của người thực hiện

Tóm tắt yêu cầu thực tế: tham khảo quy trình Vinmec; hoàn thiện journey map, need statement, best practice và prototype theo luồng phân phối phòng → thực hiện → kết quả → tổng hợp/giải thích → đi tiếp; AI soạn, bác sĩ duyệt; demo trước, AI thật tùy chọn.

Ràng buộc đã chốt: ngoại trú nhiều chỉ định, đi tiếp khi được phép, hai giao diện. Kế hoạch được người thực hiện yêu cầu triển khai trong chat. Đây là tóm tắt yêu cầu, không tuyên bố là bản chép nguyên văn đầy đủ.

Đầu ra: tài liệu ở 02–07, README, dàn ý slide và mã nguồn prototype. Kiểm tra: nguồn chính thức có ghi giới hạn; test luồng/API và kiểm tra giao diện. P1–P3 mới có tóm tắt solution signal; T1–T3 chưa có test người dùng hoàn chỉnh.

## PROMPT-02 — prompt AI chạy trong sản phẩm

**Nguồn nguyên văn có hiệu lực:** hằng `instructions` trong [lib/ai.mjs](lib/ai.mjs). Không sao chép prompt ra nhiều nơi để tránh sai phiên bản.

- Input: các phiếu nguồn giả lập đang có, ID, tên dịch vụ, chỉ số/đơn vị/cờ nguồn hoặc mô tả; `syntheticDataOnly: true`.
- Nhiệm vụ: soạn tiếng Việt dễ hiểu, chỉ giải thích thuật ngữ/tóm lược nguồn, không tự phân loại bệnh hoặc tư vấn điều trị.
- Output: JSON `sections: [{resultId, explanation}]` theo strict schema. Mỗi phiếu đúng một mục, không tạo nguồn mới.
- Số liệu được hiển thị nguyên trạng từ nguồn; giải thích không chứa chữ số, tránh AI tạo/lặp sai giá trị.
- Trước khi vào hàng duyệt: kiểm tra định dạng, nguồn, trùng mục, độ dài, chữ số và một số mẫu tư vấn vượt phạm vi. Chưa có kiểm định chuyên môn.
- Sau khi soạn: bản nháp chỉ hiện ở vai nhân viên; bác sĩ mô phỏng sửa/duyệt hoặc từ chối. Phiếu đổi thì bản duyệt cũ mất hiệu lực.

## PROMPT-03 — mô phỏng đầu ra AI

Demo không gửi prompt đến LLM. `generateSections(..., 'demo')` trong cùng file trả nội dung mẫu do Codex soạn sẵn cho loại phiếu. Đầu ra dùng để thử luồng và quyền hiển thị, không làm bằng chứng về độ chính xác AI.

## Nhật ký chạy AI thật

**Chưa có lượt gọi OpenAI thật được xác nhận.** Các test API dùng hàm giả lập phản hồi để kiểm tra adapter.

| Ngày / mã phiên giả lập | Công cụ/model cấu hình | Phiên bản nguồn | Người kiểm tra / lỗi và sửa | Thời gian/chi phí quan sát |
| --- | --- | --- | --- | --- |
| Chưa chạy | — | — | — | — |

Khi chạy thật, cập nhật hàng mới, không ghi API key. Chỉ ghi số liệu đã đo và đánh dấu phần chưa kiểm tra.
