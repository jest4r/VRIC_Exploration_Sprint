# Rủi ro và đạo đức — bản prototype 0.1.0

AI hỗ trợ phân tích ngày 17/10/2026. Mức độ dưới đây là đánh giá thiết kế ban đầu; không phải tỷ lệ sự cố đo được. Giảm thiểu kỹ thuật đã được kiểm tra không đồng nghĩa đủ điều kiện vận hành y tế.

| Mã | Rủi ro / mức ảnh hưởng dự kiến | Giảm thiểu trong demo | Kiểm tra / giới hạn còn lại |
| --- | --- | --- | --- |
| R01 | Nhầm “đã thực hiện” với “đã có kết quả” — cao | Ba trạng thái riêng; tick người bệnh không hoàn tất dịch vụ | Test luồng đạt; khả năng hiểu của người thật còn chờ |
| R02 | Đi nhầm vì phòng/hướng dẫn cũ — cao | Lưu cả phòng, tầng, hướng dẫn; cập nhật đồng bộ; phòng bận có lý do chặn | Test đổi phòng; bản đồ thực tế chưa được xác minh |
| R03 | AI tạo số liệu hoặc nguồn mới — cao | Số liệu/đơn vị/cờ hiển thị từ nguồn; explanation không chứa chữ số; kiểm tra ID/số mục | Test kỹ thuật đạt; không bảo đảm mọi diễn giải đúng nghĩa |
| R04 | Cờ nguồn bị hiểu là chẩn đoán AI — cao | Ghi rõ cờ chép từ nguồn giả lập; không có ngưỡng tự đánh giá bệnh | Nội dung cần kiểm tra chuyên môn và test hiểu; không suy luận mức độ khẩn cấp từ cờ |
| R05 | Bản nháp chưa duyệt hoặc duyệt cũ đến người bệnh — cao | Lọc ở API người bệnh; gắn phiên bản nguồn; thay nguồn hủy duyệt, chặn phản hồi đến muộn | Test API/đồng thời đạt; vai bác sĩ trong demo không xác thực thật |
| R06 | Dữ liệu nhận diện/sức khỏe thật bị lưu hoặc gửi API — cao | Toàn dữ liệu mẫu, không tải hồ sơ; .env và .local bị bỏ qua Git; API key ở máy chủ | Không nhập dữ liệu thật vào editor; cần cơ chế dữ liệu/quyền truy cập riêng trước triển khai |
| R07 | Nhầm duyệt mô phỏng thành duyệt y khoa thật — cao | Gắn “mô phỏng” ở cả hai màn hình; chưa có tuyên bố đạt chuyên môn | Chưa có bác sĩ thật đánh giá. Demo chỉ kiểm tra quy trình |
| R08 | AI lỗi làm gián đoạn đi khám — vừa/cao | Giữ phiếu nguồn; luồng phòng không phụ thuộc bản tóm tắt; lỗi hiển thị và thử lại | Test mất cấu hình, HTTP lỗi, refusal, sai schema; chưa gọi API thật |
| R09 | Yêu cầu khẩn cấp bị hiểu là đã chuyển nhân viên — cao | Hỗ trợ ghi rõ chỉ mô phỏng; hướng người dùng tìm hỗ trợ trực tiếp | [Đường hỗ trợ](emergency-handoff.md); không có dispatch thật |
| R10 | Người ít kỹ năng số khó sử dụng — vừa/cao | Chữ dễ đọc, nhãn kèm biểu tượng, cách tìm hỗ trợ trực tiếp | Cần test với nhóm phù hợp; không tuyên bố đạt chứng nhận accessibility |
| R11 | Vai nhân viên bị dùng như phân quyền thật — cao | Mặc định localhost; chế độ điện thoại dùng IP mạng nội bộ có chủ đích; chỉ phục vụ file public theo danh sách; role header là mô phỏng | Chưa có đăng nhập, RBAC hay audit người thật; không public hosting |

## Quy tắc phỏng vấn và thử nghiệm theo đề

Xin đồng ý trước mỗi phiên; cho phép dừng/bỏ qua. Chỉ hỏi trải nghiệm dịch vụ. Không hỏi tên, chẩn đoán, bệnh án hoặc tình trạng sức khỏe; không chụp người/giấy tờ y tế. Không ghi âm nếu chưa được đồng ý riêng. Chỉ dùng mã P…/T… và trích dẫn được phép. Không đưa lời khuyên y khoa. Công khai phần AI tạo.

Đề xuất quản lý ghi chép: người làm bài giữ bản ẩn danh, rà trước khi đưa repo; không lưu bản ghi âm trong repo. Thời gian lưu/xóa cụ thể và người chịu trách nhiệm cần người thực hiện chốt với người tham gia. Không suy diễn đồng ý phỏng vấn thành đồng ý công khai dữ liệu sức khỏe.
