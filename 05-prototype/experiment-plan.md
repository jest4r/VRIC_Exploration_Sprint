# Experiment plan — gợi ý thứ tự phòng

**Mục tiêu:** tìm hiểu người bệnh muốn tự chọn, cùng hệ thống cân nhắc, hay nhận gợi ý chủ động khi có nhiều phòng đủ điều kiện. Đây là solution experiment, không phải bài kiểm tra để chứng minh prototype đã đúng.

## Learning question

Khi có nhiều phòng có thể đi tiếp, cơ chế nào giúp người bệnh hiểu và quyết định thứ tự mà vẫn giữ quyền kiểm soát?

## Constants

- Cùng một người dùng, tình huống, danh sách dịch vụ, phòng, số người đang đợi và thời gian xử lý giả lập.
- Cùng mục tiêu: chọn phòng nên lấy số trước và biết vì sao.
- Cùng dữ liệu giả lập; không dùng hàng đợi hoặc thời gian thực của bệnh viện.
- Chỉ thay đổi cơ chế can thiệp, không đổi persona, task, nội dung hay độ khó giữa các option.

## Ba option đủ khác nhau

| Option | Trigger | Cơ chế / vai trò AI | Người bệnh quyết định | Trade-off cần học |
| --- | --- | --- | --- | --- |
| A — User-led | Người bệnh tự mở “Xem hàng đợi” | Hiển thị số người đợi, thời gian làm trung bình và ước tính; không tự chọn | Tự chọn phòng và thứ tự | Giữ quyền kiểm soát nhưng người bệnh phải biết mình cần xem |
| B — Collaborative | Sau khi hiển thị các phòng đủ điều kiện | Hệ thống hỏi: “Bạn muốn ưu tiên ít người đợi hay làm nhanh hơn?” rồi đưa gợi ý có lý do | Xác nhận, sửa hoặc bỏ qua gợi ý | Có thêm một bước nhưng làm rõ tiêu chí và tăng khả năng sửa |
| C — Proactive | Khi hệ thống phát hiện nhiều phòng đủ điều kiện | Tự gợi ý phòng có ước tính tới lượt thấp nhất, kèm số liệu và nút đổi lựa chọn | Nhận, đổi hoặc bỏ qua | Nhanh hơn nhưng dễ bị hiểu là quyết định bắt buộc hoặc tin nhầm dữ liệu |

## Evidence cần quan sát

Ghi hành vi, không chỉ hỏi “bạn thấy thế nào?”:

- Hành động đầu tiên: người dùng mở bảng, chọn phòng, hỏi lại hay bỏ qua.
- Có đọc được số người đợi, thời gian làm trung bình và ước tính tới lượt không.
- Chọn đúng phòng theo tiêu chí của option; có nhầm “ít người” với “tới lượt nhanh” không.
- Có kiểm tra hoặc sửa gợi ý khi dữ liệu thay đổi không.
- Thời gian ra quyết định, số lần hỏi lại, số lần chọn sai và lý do người dùng nói ra.
- Recovery: khi gợi ý sai hoặc phòng không còn sẵn sàng, người dùng có biết đổi phòng hoặc tìm hỗ trợ không.

## Acceptance criteria cho test slice

- Mỗi option chỉ thay đổi một cơ chế chính: user-led, collaborative hoặc proactive.
- Người điều phối không giới thiệu option nào là tốt hơn và không hướng dẫn đường click trước.
- Sau mỗi lượt, ghi được một quyết định tiếp theo dựa trên hành vi quan sát được; không kết luận “đã validate” từ lời khen.
- Nếu không có khác biệt hành vi rõ, giữ nguyên giả thuyết chưa biết và thiết kế vòng thử tiếp theo.

## Quyết định sau experiment

Chọn option chỉ khi có evidence về hành vi và trade-off mà nhóm chấp nhận. Nếu người dùng không hiểu các số liệu hoặc coi gợi ý là chỉ dẫn bắt buộc, giảm scope về hiển thị minh bạch và human support trước khi tăng automation.
