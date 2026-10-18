# Thử nghiệm online trên điện thoại

## Chuẩn bị

Mở `private/LINKS-RIENG.html` trên máy người điều phối. File này chứa link người bệnh và link nhân viên/bác sĩ của T1–T3. Chỉ gửi **link người bệnh của đúng mã T** cho từng người; giữ link nhân viên riêng. Mỗi link là quyền truy cập vào một phiên, không có bước đăng nhập tài khoản thật. Ai được chuyển tiếp link có thể dùng quyền tương ứng.

Người thử có thể dùng Safari/Chrome trên điện thoại, Wi-Fi bất kỳ hoặc 4G/5G. Không cần cùng Wi-Fi và máy tính của người điều phối không cần bật server. Người điều phối vẫn phải mở màn hình nhân viên để mô phỏng từng bước; demo không tự chạy hết hành trình.

Phiên có hạn **7 ngày từ lúc tạo**. Đặt lại không gia hạn. Chỉ dùng dữ liệu giả lập. Bản online dùng nội dung mẫu, không gọi AI thật; bước bác sĩ duyệt cũng là mô phỏng. Không nhập tên, kết quả xét nghiệm hoặc thông tin bệnh thật.

## Bản tối giản: thử đọc và duyệt kết quả trước

Màn hình bác sĩ hiện ưu tiên **Tổng hợp sơ bộ → Chỉ số cần chú ý → Duyệt & gửi**. Khi phiên chưa có phiếu, bấm **Nạp kết quả mẫu** để tới ngay bước đọc kết quả. Nút này chỉ bổ sung dữ liệu giả lập còn thiếu, không ghi đè phiếu hoặc nội dung đã duyệt. Chỉ bác sĩ/nhân viên có quyền nạp mẫu.

1. Đọc phần tổng hợp và nêu chỉ số cần chú ý. Cờ H/L/CRITICAL, số liệu, đơn vị và phiên bản đều lấy từ phiếu nguồn; không có ngưỡng hoặc chẩn đoán AI tự thêm.
2. Mở **Đối chiếu phiếu gốc** khi cần kiểm tra. Mẫu chưa có khoảng tham chiếu nên không thể diễn giải ý nghĩa lâm sàng của chỉ số.
3. Mở **Xem / sửa giải thích gửi người bệnh** nếu muốn sửa; bấm **Duyệt & gửi · mô phỏng** khi đã kiểm tra.
4. Mở link người bệnh cùng mã T: mặc định vào Kết quả, chỉ thấy giải thích sau duyệt. Hành trình và Hỗ trợ vẫn có trong tab riêng.
5. Điều phối phòng, sửa JSON phiếu và nhật ký nằm trong phần mở rộng cuối trang. Khi muốn chạy thử toàn hành trình, dùng phần hướng dẫn phía dưới.

Đo thêm: thời gian tìm chỉ số có cờ, khả năng chỉ ra nguồn/giới hạn diễn giải, khả năng đối chiếu và duyệt. Đây vẫn là thử khả dụng với dữ liệu giả lập, không đánh giá năng lực chẩn đoán.

## Chạy từ đầu đến cuối (15–20 phút/người)

1. **Ghép đúng phiên:** người bệnh mở link T1; người điều phối mở link nhân viên T1. Tương tự T2/T3, mỗi người độc lập. Nếu đã chạy thử trước đó, đặt lại ở màn hình nhân viên và xác nhận đặt lại.
2. **Giao bối cảnh:** “Bạn đã khám ban đầu và được chỉ định lấy mẫu xét nghiệm, chẩn đoán hình ảnh rồi quay lại bác sĩ. Hãy sử dụng màn hình này để tìm bước tiếp theo. Đây là dữ liệu giả lập.” Không hướng dẫn vị trí nút trước khi họ thử.
3. **Lấy mẫu:** chuyển sang tab Hành trình.  yêu cầu người thử tìm phòng tiếp theo, đọc vị trí/tầng/điều kiện và bấm “Đã thực hiện tại phòng” sau khi giả định đã lấy mẫu. Quan sát họ có hiểu đây chỉ là xác nhận của người bệnh. Nhân viên bấm xác nhận hoàn tất dịch vụ lấy mẫu.
4. **Đi tiếp khi kết quả còn chờ:** chưa phát hành kết quả máu. Hỏi người thử sẽ làm gì tiếp theo. Họ cần nhận ra có thể đi chẩn đoán hình ảnh khi dịch vụ trước đã hoàn tất và điều kiện đã đáp ứng. Kết quả máu vẫn ở trạng thái chờ.
5. **Chẩn đoán hình ảnh:** người thử đọc chỉ dẫn phòng tiếp theo và xác nhận đã thực hiện; nhân viên xác nhận dịch vụ hoàn tất. Có thể mô phỏng phòng chưa sẵn sàng hoặc đổi phòng trong bảng cấu hình, rồi quan sát thông tin cập nhật.
6. **Kết quả về khác thứ tự:** nhân viên phát hành kết quả hình ảnh trước, sau đó kết quả máu. Người bệnh mở Kết quả: thấy phiếu nguồn và trạng thái giải thích đang chờ duyệt; chưa thấy bản nháp giải thích.
7. **Duyệt:** ở màn hình bác sĩ, đối chiếu phiếu nguồn với bản nháp, sửa phần giải thích nếu cần rồi duyệt mô phỏng. Người bệnh thấy giải thích đã duyệt sau lần tự cập nhật tiếp theo. Hỏi họ phân biệt số liệu nguồn, cờ bất thường và giải thích như thế nào.
8. **Quay lại bác sĩ:** người thử xác định phòng tư vấn tiếp theo khi các điều kiện đã đủ, xác nhận đã thực hiện; nhân viên hoàn tất bước tư vấn. Kết thúc lượt khám mô phỏng.
9. **Hỗ trợ và khôi phục:** yêu cầu người thử tìm Hỗ trợ, sau đó tải lại trang. Yêu cầu hỗ trợ chỉ được ghi trong demo, không có nhân viên y tế thật nhận. Tải lại phải giữ tiến độ.
10. **Ghi chép:** ghi quan sát và lời nói nguyên văn trước khi đặt lại. Có thể chụp màn hình khi người thử đồng ý. Không coi lỗi kỹ thuật hoặc dữ liệu mẫu là kết quả khảo sát.

## Tác vụ và cách đo

| Tác vụ giao người thử | Ghi nhận |
|---|---|
| Tìm phòng tiếp theo | Hoàn thành/không; số giây từ lúc giao tác vụ đến khi nêu đúng phòng; số lần chọn sai |
| Đi tiếp khi kết quả máu còn chờ | Có tự làm được; có nhầm “hoàn tất dịch vụ” với “có kết quả” |
| Xác định giải thích đã được duyệt chưa | Nêu đúng trạng thái và ai duyệt; không đo hiểu biết y khoa |
| Tìm hỗ trợ, tải lại trang | Tìm được; hiểu phạm vi mô phỏng; tiến độ còn được giữ |

Ghi mỗi người theo mã T1–T3, thời điểm, thiết bị, tác vụ, kết quả, thời gian, số lỗi, lời nói và điểm cần sửa. Hỏi cuối buổi: “Chỗ nào làm bạn bối rối nhất?”, “Bạn nghĩ bây giờ nên tới đâu?”, “Bạn tin hoặc chưa tin phần giải thích nào, vì sao?”. Không điền thay lời người thử. Ba phiên là thử khả dụng quy mô nhỏ, chưa chứng minh hiệu quả tiết kiệm thời gian hoặc tính đúng y khoa.

## Kiểm tra thêm do người điều phối thực hiện

- Sau khi duyệt, sửa/phát hành lại phiếu nguồn: giải thích cũ phải bị thu hồi, cần duyệt lại.
- Mở link người bệnh và thử đổi đường dẫn sang `/staff`: phải bị từ chối; không dùng link nhân viên gửi cho người thử.
- Nếu hai màn hình cập nhật cùng lúc gây báo xung đột: tải lại trạng thái rồi thử thao tác lại.
- Nếu hết hạn: cần tạo bộ link mới; tải lại hay đặt lại không gia hạn.

## Xử lý nhanh

- “Chưa mở được phiên”: mở lại toàn bộ link mời, gồm phần `#access=...`; không chỉ gửi URL trang chủ hoặc mã phiên.
- Nếu mất mạng: kết nối lại rồi tải lại. Tiến độ đã xác nhận được lưu trên hosting.
- Nếu trang chỉ hiện lời mời: đó là trang chủ; cần link người bệnh riêng của T1/T2/T3.
- Không chia sẻ `private/sessions.json` hoặc cả bảng link riêng. Khi cần ngừng buổi thử công khai, có thể chuyển quyền truy cập site về riêng tư; việc này phải thực hiện trên hosting.
