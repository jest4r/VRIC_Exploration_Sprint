# Need statement — dự thảo cần kiểm chứng

> AI hỗ trợ diễn đạt từ phạm vi người thực hiện đã chọn và nghiên cứu bàn. P1–P3 đã có tóm tắt phỏng vấn, nhưng chủ yếu là solution signals; chưa có problem evidence đủ để xác thực need statement này.

**Cách để người bệnh ngoại trú có nhiều chỉ định cận lâm sàng chủ động hoàn thành các bước khám, giảm việc chờ không rõ tiến độ và đi lại nhầm khi chưa biết trạng thái kết quả hoặc nơi cần đến tiếp theo.**

| Thành phần Biodesign | Nội dung | Căn cứ / giới hạn |
| --- | --- | --- |
| Problem | Thiếu thông tin hành động về tiến độ, điều kiện và điểm đến tiếp theo trong đoạn thực hiện–chờ–nhận kết quả | Giả thuyết H01–H04, chưa xác thực |
| Population | Người trưởng thành khám ngoại trú có nhiều chỉ định, tự di chuyển giữa phòng; người nhà hỗ trợ là nhóm phụ cần khảo sát | Lựa chọn phạm vi nghiên cứu, chưa đại diện mọi người bệnh |
| Outcome | Chủ động hoàn thành các bước, biết lúc nào đi tiếp, giảm nhầm phòng và hỏi lại vì thiếu thông tin | Cần đo bằng tác vụ; chưa có mức nền |

## Lập luận và chuỗi truy vết

[V01–V03](../04-best-practice/sources.md) → đã có thủ tục khám và kênh hồ sơ/kết quả số → **suy luận thiết kế:** cần kiểm chứng thông tin có đủ giúp người bệnh hành động giữa các phòng không → H01–H04 trong [journey map](../02-journey-map/journey-map.md) → need statement dự thảo.

V04 cho thấy quản lý kỳ vọng chờ có liên quan đến trải nghiệm, nhưng không chứng minh pain point xét nghiệm. P1–P3 gợi ý các hướng AI khác nhau, không ghi đủ event–behavior–workaround–consequence để xác thực H01–H04. Cần problem interview tiếp theo trước khi điều chỉnh nhóm/phạm vi; không dùng đề xuất AI làm bằng chứng nhu cầu.

## Đo kiểm chứng

| Outcome | Cách đo trong prototype | Tiêu chí thử ban đầu, không phải kết quả |
| --- | --- | --- |
| Biết điểm đến tiếp | Thời gian từ giao tác vụ đến chỉ đúng phòng/tầng | Ít nhất 2/3 người tìm đúng trong 30 giây, không được chỉ đường click |
| Hiểu thực hiện khác có kết quả | Người tham gia giải thích trạng thái sau lấy mẫu | Ít nhất 2/3 hiểu có thể sang phòng tiếp khi được phép dù kết quả chưa có |
| Hiểu quyền duyệt | Hỏi ai soạn, ai duyệt, có phải xác nhận y khoa thật không | Mọi người thử phân biệt bản mẫu/AI, duyệt mô phỏng và kết luận bác sĩ thật |
| Tránh bỏ sót bước | Hoàn thành luồng và xác định việc còn lại | Ít nhất 2/3 không chọn sai điểm đến; ghi tất cả lỗi, không chỉ lỗi đã sửa |

Nếu chỉ có 2 người thử, báo phân số thực tế; không diễn giải thành tỷ lệ trên mẫu 3. So sánh trước/sau sửa chỉ mô tả bài thử; không suy ra giảm thời gian xử lý xét nghiệm hay tiết kiệm thời gian bác sĩ ngoài thực tế.

## Các hướng đã cân nhắc

- Tối ưu đặt lịch: nằm ngoài khoảnh khắc đang chọn; lưu ghi chú trong phần dùng thử app.
- AI tự đọc/diễn giải kết quả thay bác sĩ: không chọn; phạm vi là hỗ trợ soạn và có bước duyệt.
- Tăng tốc máy xét nghiệm: không nằm trong khả năng kiểm chứng của bài tập.

Need statement không chứa công nghệ hoặc giải pháp bắt buộc. Chức năng AI và chỉ đường là phương án kiểm chứng nhu cầu, có thể thay đổi sau nghiên cứu. Các hướng AI từ P1–P3 được giữ ở solution backlog, chưa đưa vào need statement này.
