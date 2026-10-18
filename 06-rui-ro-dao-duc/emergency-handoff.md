# Hỗ trợ và chuyển tuyến — ranh giới prototype

**Bản nghiên cứu, chưa phải quy trình vận hành Vinmec.** Demo không đánh giá triệu chứng, không phân loại cấp cứu và không kết nối nhân viên thật. Không dùng cờ xét nghiệm giả lập để quyết định chuyển tuyến.

## Luồng được mô phỏng

1. Người bệnh mở “Hỗ trợ” ở bất kỳ giai đoạn nào.
2. Giao diện hướng dẫn tìm quầy tiếp đón hoặc nhân viên y tế trực tiếp nếu đang tại cơ sở.
3. Nút yêu cầu hỗ trợ ghi một sự kiện trong nhật ký phiên để người điều phối bài thử quan sát.
4. Giao diện nói rõ chưa có nhân viên thật nhận yêu cầu; không hiển thị “đã chuyển tuyến” hoặc “đã gọi cấp cứu”.

Khi cần trợ giúp khẩn cấp, dừng luồng tự động và tìm hỗ trợ y tế trực tiếp. Prototype không thay hệ thống liên hệ khẩn cấp ở nơi người dùng đang có mặt.

## Những việc phải xác minh trước sử dụng thực tế

| Bối cảnh | Cần xác minh | Trạng thái hiện tại |
| --- | --- | --- |
| Trong cơ sở Vinmec | Đầu mối trực, điểm hỗ trợ, giờ hoạt động, phương án khi không phản hồi | Chưa có cơ sở cụ thể; demo chỉ chỉ dẫn chung tới nhân viên |
| Ngoài cơ sở | Kênh khẩn cấp phù hợp địa phương và hướng dẫn từ cơ sở | Chưa xác minh; không tự điền số điện thoại |
| Trong hệ thống thật | Ai tiếp nhận, thời gian phản hồi, xác nhận nhận việc, bàn giao và dự phòng | Chưa tích hợp |

## Kiểm tra trong bài thử

Người thử tìm được mục Hỗ trợ, biết phải tìm người trực tiếp khi cần và hiểu thao tác demo không tạo hỗ trợ thật. Bất kỳ hiểu nhầm “đã gọi người tới” là vấn đề cần sửa trước vòng thử tiếp theo.
