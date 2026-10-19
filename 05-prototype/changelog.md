# Thay đổi và lý do

## 19/10/2026 — checklist trải nghiệm

- Hoàn thiện phiên giả lập Trần Đức Đăng Khôi, chuyên khoa Sản khoa.
- Ưu tiên siêu âm với phép đo CRL, NT, tim thai và tuổi thai; thêm nhận định hỗ trợ và mức tin cậy trước bước bác sĩ duyệt.
- Bổ sung hướng dẫn thao tác trực tiếp trên màn hình bệnh nhân.
- Thêm test riêng cho luồng siêu âm; toàn bộ 19 test prototype đạt.

## 0.1.0 — 17/10/2026

Thay đổi từ scaffold sang prototype có thể chạy; **chưa có thay đổi dựa trên test người dùng**.

| Mã | Bằng chứng / yêu cầu | Thay đổi | Cách kiểm tra |
| --- | --- | --- | --- |
| BUILD-01 | Kế hoạch đã chốt: đi tiếp khi được phép | Tách tick người bệnh, xác nhận dịch vụ, kết quả và duyệt | Test trạng thái và API |
| BUILD-02 | Kết quả có thể về lệch thứ tự | Theo dõi kết quả độc lập; bản nháp tổng hợp các phiếu đã có | Test kết quả hình ảnh về trước xét nghiệm |
| BUILD-03 | Bản duyệt phải khớp nguồn | Mỗi thay nguồn hủy duyệt cũ; phản hồi AI cũ không phát hành | Test phiên bản và cập nhật đồng thời |
| BUILD-04 | Cần demo không cần API key | Tự soạn mẫu khi phát hành phiếu; AI thật là thao tác riêng có nhãn | Test không cấu hình, lỗi API, từ chối |
| BUILD-05 | Cần khôi phục phiên | Lưu máy chủ, giữ mã phiên hai tab; revision chống ghi đè | Test lưu/khôi phục và phiên bản cũ |

## Sau test người thật

| Mã | Nguồn T…/tác vụ | Trước | Sau | Lý do ưu tiên | Kiểm tra lại |
| --- | --- | --- | --- | --- | --- |
| CHANGE-01 | Chưa có | — | — | — | — |

## Rà soát kỹ thuật — 18/10/2026

- Sơ đồ phản ánh phòng/tầng được cấu hình, không giữ nhãn phòng cũ.
- Nút soạn bản nháp mẫu không bị giữ disabled sau khi request kết thúc.
- Reset có xác nhận/hủy ngay trong trang; đã kiểm tra trên trình duyệt.
- Bổ sung ảnh QA và [báo cáo kiểm tra kỹ thuật](technical-validation.md). Các thay đổi này không xuất phát từ T1–T3.

## Bộ chạy thử qua điện thoại — 18/10/2026

- Thêm launcher Wi-Fi, ba cặp phiên T1–T3 độc lập và trang `/test-guide` có link hai vai cùng mã phiên.
- Tách dữ liệu phiên điện thoại khỏi tiến trình localhost để tránh hai máy chủ cùng ghi một file.
- Thêm hướng dẫn diễn tập và quy trình thử 2–3 người, lệnh khởi chạy và lựa chọn `LAN_IP`/`LAN_PORT`.
- Thêm test chọn card mạng, link theo phiên, route hướng dẫn và cách ly tiến độ người thử.
