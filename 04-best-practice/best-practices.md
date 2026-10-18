# Ba best practice quốc tế

Nghiên cứu bàn ngày **17/10/2026**, AI hỗ trợ tóm lược. Chọn ba mô hình bổ sung cho nhau; chưa có mô hình nào trong bộ nguồn chứng minh trọn vẹn giải pháp điều phối đề xuất. Chi tiết tài liệu: [sổ nguồn](sources.md).

## BP-01 — ESNEFT MyChart: tập trung thông tin và hỗ trợ

**Nguồn B01, Anh:** [MyChart patient app](https://www.esneft.nhs.uk/mychart/), không thấy ngày xuất bản; truy cập 17/10/2026.

- Đã triển khai: xem lịch và kết quả, check-in trước khi tới, nhắn nhóm chăm sóc và nhận bình luận của nhân viên về kết quả.
- Bằng chứng: nguồn mô tả chức năng và lợi ích dự kiến; không đưa số phút chờ giảm được. Không khẳng định có điều phối từng phòng.
- **Ứng dụng đề xuất cho Vinmec:** đặt trạng thái dịch vụ, kết quả và kênh hỗ trợ trong một lượt khám; giữ phiếu gốc bên cạnh phần giải thích.
- Điều kiện: liên kết đúng hồ sơ, quyền xem rõ ràng, có phương án hỗ trợ người ít kỹ năng số. Trong demo chỉ dùng mã phiên giả lập.
- Liên hệ nhu cầu: H02–H03, biết thông tin nào đã có và đâu là bước tiếp theo.

## BP-02 — Epsom/St George’s MazeMap: chỉ dẫn tới điểm đến

**Nguồn B02, Anh:** [Find your way around our hospitals](https://www.epsom-sthelier.nhs.uk/find-your-way-around-our-hospitals), không thấy ngày xuất bản; truy cập 17/10/2026.

- Đã triển khai: tìm phòng/khoa và chỉ đường từng bước; mở trên trình duyệt, không bắt buộc cài app hoặc tạo tài khoản.
- Bằng chứng: mô tả dịch vụ, chưa có số liệu đánh giá đi nhầm hay thời gian tìm đường. Đây là wayfinding, không phải thuật toán xếp chỉ định.
- **Ứng dụng đề xuất cho Vinmec:** điểm đến kế tiếp kèm tầng, phòng, mốc định hướng; thay đổi chỉ dẫn cùng lúc khi đổi phòng.
- Điều kiện: bản đồ, tên phòng và tuyến tiếp cận được cơ sở xác nhận. Demo dùng sơ đồ giả lập, không định vị trong nhà.
- Liên hệ nhu cầu: H01–H04, giảm công sức chuyển danh sách chỉ định thành hành động di chuyển.

## BP-03 — Stanford: AI soạn, bác sĩ kiểm tra và duyệt

**Nguồn B03, Mỹ:** [AI tool assists doctors in sharing lab results](https://med.stanford.edu/news/all-news/2025/01/ai-test-results.html), 10/01/2025; truy cập 17/10/2026.

- Đã triển khai: AI soạn giải thích kết quả dễ hiểu; bác sĩ xem, sửa khi cần và gửi. Bản nháp không gửi thẳng người bệnh.
- Bằng chứng: bài giới thiệu mô tả hai đợt pilot và phản hồi ban đầu; chưa công bố thời gian tiết kiệm hoặc hiệu quả lâm sàng định lượng.
- **Ứng dụng đề xuất cho Vinmec:** gắn bản nháp với nguồn, cho bác sĩ so sánh và duyệt; thay nguồn thì hủy hiệu lực duyệt cũ.
- Điều kiện: đánh giá chất lượng chuyên môn thật trước sử dụng thực tế; quyền duyệt trong demo chỉ mô phỏng.
- Liên hệ nhu cầu: H03, giúp tiếp cận thông tin có ngữ cảnh; việc giảm tải bác sĩ vẫn là giả thuyết cần nghiên cứu riêng.

## Quyết định thiết kế từ tổng hợp

Ba mô hình dẫn tới ba thành phần kiểm chứng: **một nơi theo dõi → một điểm đến rõ ràng → một bản giải thích có bước duyệt**. Quy tắc phân phối phòng do người làm bài thiết kế cho demo, không phải thuật toán được ba nguồn công bố hoặc quy trình đã được Vinmec xác nhận.
