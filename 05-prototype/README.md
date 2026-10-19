# Nhịp khám — prototype điều phối khám ngoại trú

**Bản 0.1.0, 17/10/2026.** Prototype nghiên cứu độc lập; không phải MyVinmec chính thức. Giao diện người bệnh ưu tiên điện thoại, bảng điều phối và duyệt riêng. Tất cả phòng, kết quả, thời gian chờ và phê duyệt là giả lập.

## Chạy cục bộ

Cần Node.js **24 trở lên** (đã kiểm tra trên Node 24.18.1). Không có dependency bên ngoài, không cần `npm install`.

```powershell
cd D:\VIN\VRIC\05-prototype
npm start
```

Mở [giao diện người bệnh](http://127.0.0.1:4173/patient). Bấm “Màn hình nhân viên” để mở tab dùng **cùng mã phiên**. Có thể đổi giao diện về từ link ở đầu trang.

Nếu công cụ chạy lệnh bị giới hạn quyền ghi khi đặt working directory vào thư mục con, chạy từ thư mục repo:

```powershell
cd D:\VIN\VRIC
node --env-file-if-exists=05-prototype/.env 05-prototype/server.mjs
```

Lệnh `npm start` phục vụ tại `127.0.0.1`; chế độ điện thoại bên dưới phục vụ qua IP mạng nội bộ. Chưa triển khai công khai. Mã phiên lưu trong URL/localStorage; tiến độ lưu tại `.local/visits.json`, đã loại khỏi Git. Không nhập dữ liệu thật vào file hoặc giao diện. “Đặt lại demo” xóa tiến độ của phiên hiện tại, giữ mã phiên để hai tab tiếp tục đồng bộ. Không xóa phiên khác.

## Thử trên điện thoại và hai màn hình

Xem [hướng dẫn từng bước cho người điều phối](HUONG-DAN-THU-NGHIEM.md). Máy tính và điện thoại cùng Wi-Fi. Từ repo gốc chạy:

```powershell
node --env-file-if-exists=05-prototype/.env 05-prototype/phone-server.mjs
```

Hoặc `npm run start:phone` trong thư mục prototype, hoặc `start-phone.cmd` từ gói giải nén. Mở URL `/test-guide` máy chủ vừa in. Chọn cùng hàng T1/T2/T3 cho người bệnh trên điện thoại và nhân viên/bác sĩ trên máy tính; ba hàng là ba phiên độc lập. Không dùng localhost trên điện thoại. Giữ cửa sổ chạy; Ctrl+C để dừng.

Chế độ điện thoại mặc định dùng cổng 4174, chọn IP card Wi-Fi/Ethernet và lưu riêng `.local/phone-visits.json`. Có thể chọn `LAN_IP` và `LAN_PORT`. Link chỉ dùng trên mạng nội bộ; người có link mở được cả hai vai, chỉ dùng dữ liệu giả lập. Chưa xác nhận truy cập từ điện thoại thật của bạn. Xem mục xử lý lỗi trong hướng dẫn nếu Wi-Fi/tường lửa chặn kết nối.

## Kịch bản xem nhanh

**Phiếu thử nghiệm ưu tiên:** phiên mới tạo sẵn hồ sơ giả lập **Trần Đức Đăng Khôi · Sản khoa**. Siêu âm là kết quả trọng tâm: phiếu có các phép đo CRL, NT, tim thai và tuổi thai để thử nhận định hỗ trợ. Xét nghiệm được giải thích theo giá trị/cờ nguồn; không cần AI để suy luận thêm. Nhận định hỗ trợ không phải chẩn đoán và chỉ được gửi sau khi bác sĩ đối chiếu, chỉnh sửa nếu cần và duyệt.

1. Người bệnh xem phòng L01, chỉ dẫn và bấm “Đã thực hiện tại phòng”. Đây chỉ là xác nhận của người dùng.
2. Tại màn hình nhân viên cùng phiên, xác nhận hoàn tất lấy mẫu. Người bệnh được chỉ tới C02 dù xét nghiệm chưa có kết quả.
3. Xác nhận thực hiện chẩn đoán hình ảnh. Phát hành kết quả mẫu hình ảnh trước xét nghiệm để thử thứ tự về khác thứ tự thực hiện.
4. Khi mỗi phiếu được phát hành, máy chủ **tự soạn lại bản nháp mẫu**, tổng hợp các kết quả đang có. Bản nháp siêu âm ưu tiên nhận định các phép đo; bản nháp xét nghiệm chỉ giải thích theo nguồn/cờ. Người bệnh chỉ thấy phiếu gốc; nhận định và giải thích vẫn chờ duyệt.
5. Phát hành kết quả xét nghiệm; bác sĩ mô phỏng so sánh nguồn với bản nháp, sửa nếu cần, bấm “Duyệt & gửi · mô phỏng”. Sau đó người bệnh mới thấy giải thích.
6. Sửa một phiếu nguồn hoặc phát hành mẫu phiên bản mới: bản duyệt cũ mất hiệu lực; bản nháp mẫu mới cần duyệt lại.
7. Khi các dịch vụ và kết quả cần thiết đã đủ, người bệnh được chỉ về K03. Xác nhận tư vấn hoàn tất để kết thúc lộ trình demo.
8. Thử đóng/mở lại trang, đổi phòng và hướng dẫn, tắt sẵn sàng phòng, gửi hỗ trợ và đặt lại phiên.

## Chế độ AI

**Demo mặc định:** đoạn giải thích tạo sẵn do Codex soạn được lắp ghép theo phiếu nguồn; không gọi LLM và không kiểm chứng chất lượng AI thực tế. Nút soạn lại bản mẫu không tiêu phí API.

**AI thật tùy chọn:** sao chép `.env.example` thành `.env` trong thư mục này, điền `OPENAI_API_KEY` và `OPENAI_MODEL` có quyền sử dụng và hỗ trợ Structured Outputs, rồi khởi động lại. Khóa chỉ ở máy chủ. Không dùng model giả trong test làm cấu hình thật.

Chỉ khi bấm “Soạn bằng AI thật”, máy chủ gửi dữ liệu giả lập qua Responses API và có thể phát sinh phí tài khoản API. Không tự gọi AI thật sau mỗi phiếu; bản nháp tự động mặc định vẫn là demo và có nhãn rõ. Lỗi AI thật không tự chuyển sang mẫu để giả thành thành công.

Prompt thực thi: [lib/ai.mjs](lib/ai.mjs). AI trả các mục `{resultId, assessment, confidence, explanation}`; số liệu, đơn vị, cờ và nguồn được giữ trong dữ liệu gốc. `assessment` là nhận định hỗ trợ, không phải chẩn đoán; `confidence` là nhãn định tính, không phải xác suất. Kiểm tra schema, nguồn, độ dài và nội dung vượt phạm vi chỉ là lớp kỹ thuật; không chứng minh nội dung đúng y khoa. Xem [prompt log](prompts.md).

## Quy tắc và giới hạn

- Cấu hình demo: lấy mẫu → hình ảnh được mở khi lấy mẫu hoàn tất → bác sĩ khi cả hai dịch vụ và kết quả đã đủ. Đây là quan hệ phụ thuộc **giả lập**, không phải yêu cầu lâm sàng Vinmec.
- Thứ tự chọn phòng: đủ điều kiện, sẵn sàng, ưu tiên số nhỏ trước; cùng ưu tiên chọn thời gian chờ nhỏ hơn. Không có tối ưu hóa lịch thực hoặc định vị trong nhà.
- Trạng thái dịch vụ, kết quả và duyệt tách biệt. Bác sĩ xem kết quả gốc vẫn được khi AI lỗi; bản duyệt AI không phải điều kiện để quay lại bác sĩ.
- Cờ H/L/CRITICAL chỉ sao chép từ phiếu nguồn giả lập; không có ngưỡng suy luận bệnh. Không đọc ảnh, chẩn đoán hoặc tư vấn điều trị.
- Có lưu phiên, kiểm tra phiên bản chống ghi đè, chặn phản hồi AI đã cũ và giới hạn kích thước yêu cầu.
- `X-Demo-Role` là bộ chọn vai **mô phỏng**, ai dùng demo cũng mở được màn hình nhân viên. Chưa có xác thực thật hoặc audit theo danh tính; không dùng như hệ thống bệnh viện.
- Chức năng hỗ trợ chỉ ghi sự kiện demo. Không có SMS, gọi điện, thông báo hệ điều hành hoặc nhân viên thật nhận yêu cầu.

## API nội bộ

| Phương thức / đường dẫn | Nội dung |
| --- | --- |
| `GET /api/config` | Báo có đủ cấu hình AI thật hay không; không trả khóa/model |
| `POST /api/visits` | Tạo phiên giả lập |
| `GET /api/visits/:id` | Trạng thái dành cho người bệnh; không trả bản nháp hoặc nhật ký nội bộ |
| `POST /api/visits/:id/patient-confirm` | `{expectedRevision, taskId}`: tick của người bệnh |
| `POST .../complete` | Nhân viên mô phỏng xác nhận thực hiện |
| `POST .../configure` | `taskId, room, floor, directions, available, waitMinutes, priority` |
| `POST .../result` | `taskId`, tùy chọn `result`: phát hành nguồn, hủy duyệt cũ, tự soạn bản mẫu |
| `POST .../draft` | `mode: demo/live`: soạn lại bản nháp |
| `POST .../review` | `draftId, action: approve/reject`, `sections` khi duyệt |
| `POST .../help`, `POST .../reset` | Ghi hỗ trợ giả lập / đặt lại phiên |

Mọi POST cập nhật phiên cần `expectedRevision`; sai phiên bản trả 409 và giao diện tải lại. Thao tác nhân viên cần header `X-Demo-Role: staff`. `result` gồm `source`, `readings` (mỗi mục có `name,value,unit,flag,reference` dạng chuỗi), `report`; ID, thời gian và phiên bản do máy chủ cấp. Không coi header này là phân quyền an toàn.

## Kiểm tra

```powershell
npm test
```

Xem [kiểm tra kỹ thuật](technical-validation.md), [kịch bản test người thật](test-log.md) và [thay đổi](changelog.md). Kiểm tra tự động không thay 2–3 phiên thử với người thật.
