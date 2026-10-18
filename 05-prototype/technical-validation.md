# Báo cáo kiểm tra kỹ thuật — 0.1.0

**Kiểm tra 17–18/10/2026, Node.js 24.18.1 trên Windows.** Do Codex thực hiện với dữ liệu giả lập. Đây không phải log phỏng vấn, test người dùng hoặc đánh giá chuyên môn y khoa.

## Kiểm tra tự động

Lệnh từ repo gốc: `npm.cmd --prefix 05-prototype test`. **18 test đạt, 0 lỗi.** Các test tạo máy chủ trên cổng tạm và dùng file tạm riêng, không dựa vào phiên demo đang mở.

| Nhóm | Trường hợp được kiểm tra |
| --- | --- |
| Điều phối | Tick người bệnh không hoàn tất dịch vụ; lấy mẫu hoàn tất cho phép đi tiếp dù kết quả chưa có; phòng bận, ưu tiên và điều kiện phụ thuộc |
| Kết quả | Phiếu hình ảnh về trước xét nghiệm; chỉ phát hành sau thực hiện; nguồn trống không hợp lệ; số liệu, đơn vị và cờ giữ nguyên |
| Soạn/duyệt | Chưa có nguồn không soạn; bản nháp/từ chối không hiện phía người bệnh; chỉ duyệt bản hiện hành; thay nguồn hủy duyệt cũ |
| Đồng thời/khôi phục | Revision cũ trả 409; nguồn đổi hoặc reset khi AI đang chạy chặn kết quả đến muộn; lưu và đọc lại phiên từ file |
| Adapter AI | Thiếu cấu hình, mất kết nối, HTTP lỗi, từ chối, chưa hoàn tất, JSON/schema sai; kiểm tra request strict schema và `store:false` bằng fetch giả lập |
| HTTP | Luồng từ đầu đến cuối, hỗ trợ/reset; vai người bệnh không thực hiện thao tác nhân viên; file ngoài danh sách public không được phục vụ |

Không có lượt gọi OpenAI thật được xác nhận. Test adapter sử dụng phản hồi giả lập, không chứng minh quyền truy cập model, độ trễ, chi phí hoặc độ chính xác AI thực tế. Phần lọc câu vượt phạm vi không phải bộ kiểm định y khoa.

## Kiểm tra trên trình duyệt

Đã thao tác bằng hai tab cùng phiên trên trình duyệt trong Codex; kiểm tra chiều rộng điện thoại 390px và desktop 1280px. Không thấy tràn ngang ở các trang đã kiểm tra.

- Tick tại L01 giữ trạng thái chờ nhân viên; xác nhận nhân viên mở C02 khi xét nghiệm chưa có kết quả.
- Phát hành hình ảnh trước xét nghiệm tạo bản nháp tự động; người bệnh chỉ xem nguồn, chưa thấy bản nháp.
- Duyệt mô phỏng cho phép xem giải thích. Phát hành bản sửa thay giá trị nguồn, phần giải thích cũ bị ẩn tới khi duyệt lại.
- Đổi K03 thành K04 và sửa chỉ dẫn: điểm đến, lộ trình và sơ đồ đều hiện K04. Sau reset trở lại cấu hình mẫu ban đầu.
- Hoàn tất tư vấn hiển thị đã hoàn tất lộ trình. Mục hỗ trợ ghi rõ chỉ là yêu cầu trong demo.
- Xác nhận đặt lại trong trang có lựa chọn giữ phiên hoặc xác nhận; đã kiểm tra cả hủy và đặt lại. Phiên đang mở được để ở trạng thái đầu cho người thực hiện thử.
- Tải lại trang giữ mã phiên và tiến độ trên cùng máy chủ.

## Minh chứng giao diện

Các ảnh là **QA với dữ liệu giả lập**, không phải ảnh test người dùng. Một số ảnh chụp tại các trạng thái khác nhau của cùng phiên trước khi đặt lại.

| Ảnh | Nội dung |
| --- | --- |
| [Người bệnh desktop](evidence/patient-desktop.jpg) | Bắt đầu lượt khám, điểm đến và sơ đồ |
| [Người bệnh điện thoại](evidence/patient-mobile.jpg) | Điểm đến tiếp theo và các trạng thái tách biệt |
| [Phiếu nguồn trên điện thoại](evidence/patient-results.jpg) | Giá trị/đơn vị/cờ từ nguồn giả lập |
| [Giải thích đã duyệt trên điện thoại](evidence/approved-mobile.jpg) | Nhãn duyệt mô phỏng và nội dung giải thích |
| [Bảng nhân viên desktop](evidence/staff-desktop.jpg) | Điều phối và đối chiếu nguồn/bản tóm tắt |

## Sửa từ kiểm tra kỹ thuật

1. Sơ đồ lấy nhãn phòng/tầng từ cấu hình thay vì tên cố định, tránh lệch sau đổi phòng.
2. Nút soạn mẫu được mở lại sau khi kết thúc yêu cầu, tránh giữ trạng thái disabled do render khi đang bận.
3. Xác nhận reset chuyển từ hộp thoại trình duyệt sang xác nhận trong trang; có nút hủy và focus vào lựa chọn xác nhận.
4. Môi trường công cụ có giới hạn ghi khi working directory nằm trong thư mục con; đã xác nhận chạy từ repo gốc lưu phiên được, bổ sung lệnh thay thế trong README.

## Chưa được xác minh

P1–P3, T1–T3; trải nghiệm MyVinmec thực tế; tính đúng y khoa; bản đồ và quy tắc điều phối của cơ sở; giảm thời gian khám/bác sĩ; API thật; kết nối từ điện thoại thật trên mạng Wi-Fi; quy trình chuyển tuyến hoặc nhân viên hỗ trợ thật. Giữ các phần này ở trạng thái chưa có bằng chứng.

## Bổ sung thử qua điện thoại — 18/10/2026

- Bốn test mới: chọn card mạng vật lý, cặp link dùng chung phiên, route hướng dẫn và kiểm tra origin, cách ly tiến độ T1–T3. Tổng 18/18 đạt.
- Máy chủ điện thoại chạy trên IP Wi-Fi riêng, cổng 4174; có 3 cặp link riêng và lưu dữ liệu tách khỏi server localhost.
- Đã kiểm tra URL LAN và các API từ chính máy tính. Chưa xác nhận kết nối từ điện thoại thật hoặc vượt qua tường lửa/router của buổi thử.
- Gói ZIP được kiểm tra có mã nguồn/hướng dẫn/launcher và không chứa `.env` hoặc `.local`. Hướng dẫn HTML xuất riêng có QR tới trang test của mạng hiện tại.

## Bản hosting online — 18/10/2026

- Source tại `../sites/nhip-kham-online`; Sites/Vinext + D1, migration chỉ có schema. Runtime secret bảo vệ tạo phiên, không đưa secret vào source.
- Bốn test cho API hosting: tạo phiên có bảo vệ; cách ly người bệnh/nhân viên và T1–T3; luồng kết quả, duyệt, thu hồi và reset; link hết hạn/origin/revision/AI thật bị từ chối. Tổng cả local/LAN/hosting **22/22 đạt**.
- TypeScript và build Worker thành công. Preview Worker đã phục vụ HTML người bệnh, CSS/JS và API config, migration D1 cục bộ áp dụng thành công.
- Link phiên có quyền riêng theo vai, D1 chỉ lưu hash của mã mời, hết hạn sau 7 ngày. Link mời là quyền truy cập, không phải xác thực người thật. Bản online không có AI thật hay dữ liệu y tế thật.
- Kiểm tra HTTP sau triển khai nằm tại `../output/online-demo/host-check.json` nếu có; chỉ là bằng chứng kỹ thuật. Kết nối điện thoại thật qua 4G/5G, T1–T3 và hiệu quả sử dụng vẫn cần người thực hiện xác minh.

- Hosting đã xuất bản; tám kiểm tra HTTPS trong `host-check.json` đạt. Hai giao diện người bệnh/nhân viên đã tải đúng trên trình duyệt qua URL online. Các phiên còn ở trạng thái ban đầu sau kiểm tra.

## Giao diện online tập trung đọc kết quả — 19/10/2026

- Màn hình bác sĩ ưu tiên tổng hợp sơ bộ, chỉ số có cờ nguồn và duyệt; nguồn, sửa giải thích, điều phối và nhật ký thu gọn. Người bệnh mở mặc định ở Kết quả.
- Thêm thao tác nạp phiếu mẫu một lần với quyền nhân viên, không ghi đè dữ liệu/duyệt có sẵn; bổ sung kiểm tra giá trị/đơn vị/cờ và giới hạn thông tin. Tổng **25/25 test đạt**, TypeScript và build đạt.
- Đã kiểm tra trực tiếp trên hosting thao tác nạp mẫu và phân quyền; bấm duyệt ở UI rồi xác nhận giải thích xuất hiện cho người bệnh. T3 được soạn lại thành bản nháp để người thực hiện tự thử bước duyệt.
- Preview Worker trên Windows trả lỗi 503 khi xử lý một request; kiểm tra UI tiếp tục trên hosting. Không dùng lỗi môi trường preview làm bằng chứng người dùng.
- Dữ liệu và nội dung AI vẫn giả lập; chưa có đánh giá y khoa hoặc test khả dụng với người tham gia thật.
