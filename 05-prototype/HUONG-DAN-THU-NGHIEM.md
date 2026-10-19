# Hướng dẫn thử Nhịp khám từ đầu đến cuối

Dành cho **người điều phối**, ngày 18/10/2026. Người thử dùng giao diện người bệnh; bạn dùng bảng nhân viên/bác sĩ trên máy tính. Tất cả dịch vụ, phòng, kết quả và phê duyệt đều giả lập. Buổi thử đánh giá khả năng hiểu và sử dụng quy trình, không đánh giá sức khỏe.

## 1. Mở trên điện thoại

Cần Node.js 24 trên máy tính; điện thoại không cần cài ứng dụng hoặc Node. Kết nối máy tính và điện thoại vào cùng Wi-Fi.

Từ thư mục repo, chạy PowerShell:

```powershell
cd D:\VIN\VRIC
node --env-file-if-exists=05-prototype/.env 05-prototype/phone-server.mjs
```

Hoặc trong thư mục `05-prototype`, chạy `npm run start:phone`. Nếu nhận gói ZIP, giải nén rồi chạy `start-phone.cmd` hoặc lệnh npm trên. Giữ cửa sổ chạy trong cả buổi, nhấn Ctrl+C khi kết thúc.

Máy chủ in URL dạng `http://IP-WI-FI:4174/test-guide`. Mở chính URL này trên điện thoại. **Không dùng 127.0.0.1/localhost trên điện thoại**, vì đó là chính điện thoại chứ không phải máy tính.

Trang hướng dẫn có ba hàng **T1, T2, T3**, mỗi hàng gồm hai link cùng mã phiên. Mở link người bệnh trên điện thoại; mở link nhân viên/bác sĩ **cùng hàng** trên máy tính. Nếu IP Wi-Fi đổi, dừng và chạy lại để lấy URL mới. Các phiên được giữ khi khởi động lại.

Nếu Windows hiện yêu cầu cho Node truy cập mạng, cho phép trên mạng riêng đáng tin cậy để điện thoại cùng Wi-Fi kết nối. Không tắt tường lửa toàn bộ. Nếu không thấy yêu cầu hoặc không truy cập được, xem mục xử lý lỗi bên dưới. Cách này chỉ dùng qua mạng nội bộ; không tạo link Internet công khai.

## 2. Chạy thử một vòng trước khi mời người thật

### Phiếu thử nghiệm mẫu

Phiên mới tạo sẵn là dữ liệu giả lập của **Trần Đức Đăng Khôi**, chuyên khoa **Sản khoa**. Trên điện thoại, người thử đọc hướng dẫn ngay đầu tab Hành trình: đọc phòng và chỉ dẫn, bấm xác nhận đã thực hiện, rồi chờ nhân viên xác nhận. Không nhập thêm tên, bệnh hoặc kết quả thật.

Trọng tâm buổi thử là **siêu âm**. Khi phiếu siêu âm được phát hành, hãy kiểm tra các phép đo hiển thị nguyên trạng và nhận định hỗ trợ riêng của phiếu. Xét nghiệm được dùng để thử cách giải thích theo cờ/nguồn, không yêu cầu AI suy luận chẩn đoán. Bác sĩ phải đối chiếu nguồn và bối cảnh trước khi duyệt; “nhận định hỗ trợ” không phải chẩn đoán.

Mở T1 hai phía. Ở giao diện người bệnh, bấm “Đặt lại demo ↻” → “Xác nhận đặt lại” để bắt đầu từ trắng. Đây là bước diễn tập; trước test T1 thật cần đặt lại lần nữa.

| Bước | Điện thoại — người bệnh | Máy tính — nhân viên/bác sĩ | Kết quả cần thấy |
| --- | --- | --- | --- |
| 1. Tìm phòng | Xem điểm đến L01, tầng và ba bước chỉ dẫn | Chưa thao tác | Lấy mẫu là điểm đầu; hình ảnh còn bị chặn |
| 2. Tick lấy mẫu | Bấm “Đã thực hiện tại phòng” | Chưa xác nhận vội | Hiện “Đã ghi nhận · chờ nhân viên”; dịch vụ vẫn chưa hoàn tất |
| 3. Xác nhận lấy mẫu | Quan sát lại Hành trình | Tại thẻ Lấy mẫu, bấm “Xác nhận hoàn tất · mô phỏng”; **chưa phát hành kết quả** | Điểm tiếp theo là C02; xét nghiệm còn chưa có kết quả |
| 4. Thực hiện hình ảnh | Đọc chỉ dẫn C02 rồi tick đã thực hiện | Xác nhận hoàn tất tại thẻ Chẩn đoán hình ảnh | Hai dịch vụ đã thực hiện; chưa đủ điều kiện quay lại bác sĩ nếu thiếu kết quả |
| 5. Kết quả về lệch thứ tự | Mở Kết quả | Phát hành kết quả mẫu **hình ảnh trước** | Có phiếu hình ảnh; xét nghiệm còn chờ; bản nháp tự tạo nhưng chưa hiển thị cho người bệnh |
| 6. Có thêm xét nghiệm | Quan sát phiếu gốc, cờ và trạng thái giải thích | Phát hành mẫu ở thẻ Lấy mẫu | Có đủ hai phiếu; tự soạn lại tổng hợp; phần giải thích vẫn chờ duyệt |
| 7. Duyệt giải thích | Giữ mục Kết quả mở | Ở Tổng hợp và duyệt, đọc nguồn cạnh bản nháp, có thể sửa câu rồi bấm “Duyệt & gửi · mô phỏng” | Điện thoại xuất hiện giải thích, nhãn duyệt mô phỏng và nhãn mẫu tạo sẵn |
| 8. Kiểm tra thay nguồn | Xem phần giải thích đang có | Ở thẻ Lấy mẫu, bấm “Phát hành mẫu phiên bản mới” | Phiếu nguồn lên bản mới; giải thích cũ bị ẩn; bản nháp mới cần duyệt lại |
| 9. Duyệt lại | Quan sát Kết quả | Đọc bản mới rồi duyệt lại | Giải thích được hiển thị lại, gắn phiên bản nguồn mới |
| 10. Quay lại bác sĩ | Về Hành trình, tìm K03 và tick đã thực hiện | Xác nhận hoàn tất ở thẻ Quay lại bác sĩ | 3/3 dịch vụ; hiện hoàn tất lộ trình demo |
| 11. Hỗ trợ | Mở Hỗ trợ, bấm gửi yêu cầu trong demo | Xem Nhật ký phiên | Có sự kiện yêu cầu; không có nhân viên thật được kết nối |

Hai màn hình tự kiểm tra thay đổi khoảng 2,5 giây/lần. Nếu vừa thao tác mà chưa thấy cập nhật, đợi khoảng 3 giây hoặc tải lại. Khi con trỏ đang ở biểu mẫu nhân viên, tự cập nhật tạm dừng để tránh mất phần đang nhập; lưu biểu mẫu hoặc tải lại khi phù hợp. Nếu có thông báo phiên vừa thay đổi, đọc trạng thái mới rồi thực hiện lại thao tác cần thiết.

**Phân biệt ba việc:** tick của người bệnh ≠ nhân viên xác nhận đã thực hiện ≠ kết quả đã phát hành. Bản nháp AI/mẫu cũng khác bản đã duyệt. Bác sĩ trong demo chỉ là vai mô phỏng.

## 3. Thử các tình huống bổ sung

- **Đổi phòng:** mở “Điều phối phòng và hàng đợi” trên thẻ Quay lại bác sĩ. Đổi K03 thành K04, sửa cả chỉ dẫn chứa tên phòng rồi lưu. Điện thoại phải cập nhật điểm đến, lộ trình và sơ đồ.
- **Phòng chưa sẵn sàng:** trước khi thực hiện dịch vụ, bỏ chọn “Phòng sẵn sàng” rồi lưu. Điện thoại phải nói lý do chờ; bật lại để tiếp tục.
- **Từ chối bản nháp:** khi bản nháp còn chờ, bấm “Từ chối bản nháp”. Điện thoại không thấy giải thích; bấm “Soạn bản nháp mẫu” để có bản mới rồi duyệt.
- **Khôi phục phiên:** tải lại hoặc đóng/mở lại đúng link. Tiến độ phải còn; mở cùng link trên thiết bị khác vẫn thấy cùng phiên.
- **Reset:** thử “Giữ phiên hiện tại” để hủy; chỉ “Xác nhận đặt lại” mới xóa tiến độ của phiên đang chọn. Không reset khi chưa ghi xong kết quả test.

## 4. Chuẩn bị 2–3 người

Dùng T1 cho người thứ nhất, T2 cho người thứ hai, T3 nếu có người thứ ba. Nên thử lần lượt với một người điều phối. Các phiên độc lập; không cho nhiều người cùng dùng một hàng T… vì sẽ đổi trạng thái của nhau.

Trước mỗi phiên, ghi mã T…, ngày, thiết bị và đồng ý tham gia. Giải thích: chỉ nghiên cứu trải nghiệm dịch vụ; dữ liệu giả lập; có thể bỏ câu hỏi hoặc dừng; không cần tên, bệnh, giấy tờ hoặc kết quả thật. Không ghi âm thiếu đồng ý riêng.

**Không đưa người thử bảng thao tác nhân viên hoặc đọc lời giải click.** Chỉ gửi link người bệnh cùng hàng. Dùng các câu giao tác vụ trung lập sau; bạn vận hành tab nhân viên ở thời điểm tương ứng.

1. “Bạn vừa nhận danh sách dịch vụ. Hãy cho biết bạn cần tới đâu và làm gì tiếp.”
2. “Bạn đã lấy mẫu. Bạn sẽ ghi nhận việc đó thế nào và tiếp tục ra sao?”
3. “Một kết quả đã có. Hãy cho biết thông tin nào có, điều gì còn chờ.”
4. “Bạn muốn xem giải thích kết quả. Theo bạn, ai soạn và ai đã kiểm tra phần đó?”
5. “Phòng tiếp theo thay đổi. Bạn sẽ đi đâu?”
6. “Nếu chưa rõ cần làm gì, bạn tìm hỗ trợ ở đâu?”

Bấm giờ từ khi đọc xong tác vụ đến khi người thử tìm đúng bước/phòng; ghi số lần chọn sai, phải hỏi hoặc được trợ giúp. Hỏi người thử tự diễn đạt ba trạng thái và ý nghĩa “duyệt mô phỏng”. Ghi trích dẫn thật, không gợi câu trả lời.

Sau mỗi phiên, điền `test-log.md`: hoàn thành độc lập/có trợ giúp/chưa hoàn thành, thời gian thực đo, câu nói, vấn đề và thay đổi dự kiến. Ưu tiên sửa một trở ngại chính, thử lại và ghi `changelog.md`. Đây là mẫu 2–3 người; không suy rộng thành hiệu quả điều trị hay số phút xét nghiệm/bác sĩ tiết kiệm.

## 5. AI đang chạy thế nào?

Trong vòng đầu nên dùng mẫu mặc định để kiểm tra luồng. Phát hành nguồn tự soạn bản nháp mẫu; không gọi LLM. “Soạn bằng AI thật” chỉ mở khi cấu hình máy chủ theo README, và có thể phát sinh phí API. Dù ở chế độ nào, cần bước duyệt mô phỏng trước khi giải thích tới người bệnh. Test luồng bằng mẫu chưa chứng minh chất lượng AI thật.

## 6. Nếu điện thoại không mở được

1. Xác nhận máy tính còn chạy và mở được URL IP Wi-Fi trên chính máy tính.
2. Điện thoại và máy tính cùng Wi-Fi; không dùng Wi-Fi khách có chặn thiết bị với nhau. VPN có thể làm đổi đường kết nối.
3. Dùng đúng `http://`, IP và cổng do cửa sổ vừa in; IP có thể đổi sau khi đổi mạng.
4. Nếu máy tính mở được nhưng điện thoại không mở được, kiểm tra quyền mạng riêng của Node/tường lửa hoặc chế độ cô lập thiết bị trên router. Không cần công khai cổng ra Internet.
5. Nếu chọn nhầm card mạng ảo, đặt `LAN_IP` bằng địa chỉ Wi-Fi trong `ipconfig`, rồi chạy lại. Nếu cổng bận, dùng link của tiến trình đang chạy hoặc chọn `LAN_PORT` khác.

```powershell
$env:LAN_IP = 'DIA-CHI-IP-WIFI-CUA-MAY'
$env:LAN_PORT = '4174'
node --env-file-if-exists=05-prototype/.env 05-prototype/phone-server.mjs
```

Người có link trên cùng mạng có thể mở cả vai nhân viên vì đây là demo chưa có đăng nhập thật. Chỉ dùng dữ liệu giả lập và dừng máy chủ sau buổi thử. Gói ZIP cần được chạy trên máy tính; mở file HTML trên điện thoại riêng lẻ không thay thế máy chủ lưu và đồng bộ hai màn hình.
