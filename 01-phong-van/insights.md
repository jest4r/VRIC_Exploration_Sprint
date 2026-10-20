# Tổng hợp insight

> Cập nhật từ tóm tắt P1–P3 ngày 17–18/10/2026. Theo nguyên tắc problem interview, các đề xuất AI trong những bản tóm tắt này là **solution signals**, chưa phải bằng chứng problem độc lập. Chưa có kết luận về hiệu quả AI hoặc nhu cầu của toàn bộ người dùng.

| Mã | Quan sát từ phỏng vấn | Bằng chứng P…-Q… | Số người/tổng mẫu | Nhu cầu/ý tưởng suy ra | Bằng chứng trái chiều hoặc điều chưa rõ | Độ chắc chắn |
| --- | --- | --- | --- | --- | --- | --- |
| INS-01 | P1 nêu lo ngại/ý tưởng rằng các phép đo kỹ thuật, đặc biệt trong siêu âm, có thể bị bỏ sót hoặc sai sót. Đây là solution signal, chưa có câu chuyện sự kiện cụ thể hoặc hậu quả được ghi lại. | [P1](P1.md), mã P1-Q1/P1-Q2 | 1/3 nêu hướng này; 0/3 có problem evidence đủ | Khảo sát AI hỗ trợ kiểm tra phép đo siêu âm, trước mắt là độ dày da gáy trong siêu âm thai; AI chỉ cảnh báo/đối chiếu để bác sĩ quyết định, không tự chẩn đoán. | Cần hỏi bác sĩ về lần gần nhất, tần suất, workaround, hậu quả và tiêu chí tin cảnh báo; chưa biết dữ liệu ảnh hoặc độ chính xác tối thiểu. | Tín hiệu thấp |
| INS-02 | P2 đề xuất AI dự đoán triệu chứng/chẩn đoán và đề xuất hội đồng hội chẩn, nhưng chưa ghi lại một lần hội chẩn cụ thể, workaround hoặc hậu quả. | [P2](P2.md), mã P2-Q1 | 1/3 nêu hướng này; 0/3 có problem evidence đủ | Khảo sát AI hỗ trợ chuẩn bị và điều phối hội chẩn: gom thông tin liên quan, đưa ra đề xuất có căn cứ và giúp chọn hội đồng; quyết định vẫn do chuyên gia. | Cần hỏi một ca gần nhất: ai tổng hợp gì, mất bao lâu, thiếu thông tin ở đâu, đã nhờ ai hỗ trợ và điều gì xảy ra nếu đề xuất sai. | Tín hiệu thấp |
| INS-03 | P3 nêu các giới hạn của app và đề xuất expert AI cho tham vấn từ xa, nhưng chưa ghi lại lần người dùng thật bị mất ngữ cảnh, gặp prompt injection hoặc không được hỗ trợ bệnh lý cụ thể. | [P3](P3.md), mã P3-Q1/P3-Q2 | 1/3 nêu hướng này; 0/3 có problem evidence đủ | Về dài hạn có thể nghiên cứu expert AI cho tham vấn từ xa, đi kèm memory có kiểm soát, kiểm thử prompt injection và cơ chế chuyển sang bác sĩ; đây là hướng phát triển xa, chưa phải phạm vi prototype hiện tại. | Cần phỏng vấn theo sự kiện gần nhất và kiểm thử recovery; chưa biết loại memory, mức an toàn, ranh giới pháp lý/lâm sàng và mô hình giám sát. | Tín hiệu thấp |
| INS-04 | Cả ba phỏng vấn đều mở ra ý tưởng dùng AI trong hỗ trợ chuyên môn hoặc tham vấn, nhưng mỗi người chỉ nói về một bối cảnh khác nhau; chưa có bằng chứng rằng một giải pháp AI chung đáp ứng cả ba nhu cầu. | P1-Q1–Q2, P2-Q1, P3-Q1–Q3 | 3/3 có đề xuất AI, không đồng nghĩa 3/3 xác nhận cùng một pain point | Nguyên tắc chung khi tiếp tục nghiên cứu: AI nên làm lớp hỗ trợ/đối chiếu/điều phối, có người chuyên môn chịu trách nhiệm và không thay thế bác sĩ. | Mẫu nhỏ, không có trích dẫn nguyên văn đã xác nhận; P3 không có file ghi âm Drive; chưa có người bệnh hoặc bác sĩ thử prototype cho các hướng này. | Thấp |

- Điểm đau ưu tiên và lý do (ảnh hưởng, tần suất trong mẫu, khả năng kiểm chứng): ba hướng cần kiểm chứng riêng: bỏ sót/sai phép đo siêu âm (P1), điều phối hội chẩn (P2), và giới hạn trợ lý tham vấn từ xa (P3). Chưa xếp hạng mức ưu tiên vì mỗi hướng mới có một người nêu.
- Một khoảnh khắc và nhóm người dùng: P1 là lúc bác sĩ thực hiện phép đo siêu âm thai; P2 là lúc tổng hợp hồ sơ và lập hội đồng hội chẩn; P3 là lúc người dùng cần tham vấn từ xa ngoài tâm lý hoặc khi trợ lý không giữ được ngữ cảnh.
- Hạn chế mẫu, điều chưa biết: chỉ có ba bản tóm tắt; P1/P2 có thư mục ghi âm dùng chung nhưng chưa xác nhận đồng ý ghi âm; P3 không có file ghi âm; chưa có số liệu lỗi, dữ liệu thật, tiêu chí an toàn, kiểm thử với bác sĩ/người bệnh hoặc bằng chứng hiệu quả.
- Chuyển sang [journey map](../02-journey-map/journey-map.md) và [need statement](../03-need-statement/need-statement.md).

### Phân loại bằng chứng hiện tại

| Loại | Hiện có | Chưa có |
| --- | --- | --- |
| Fact/event | Ngày, bối cảnh khảo sát và nội dung tóm tắt do người thực hiện cung cấp | Một lần cụ thể đã xảy ra, hành động, workaround, tần suất và hậu quả của từng pain |
| Opinion/prediction | P1–P3 đề xuất AI có thể hỗ trợ | Mức sẵn sàng dùng, willingness to pay, hoặc cam kết đổi workflow |
| Solution evidence | Ba hướng có thể dùng để thiết kế prototype/experiment | Bằng chứng người dùng chọn một cơ chế, dùng thành công hoặc chấp nhận trade-off |

Không gọi P1–P3 là “đã validate”. Bước tiếp theo của problem discovery là phỏng vấn theo sự kiện quá khứ; bước solution discovery là thử các option khác nhau và quan sát hành vi.

## Hướng nghiên cứu tiếp theo

| Hướng | Câu hỏi cần kiểm chứng | Không được suy ra từ interview |
| --- | --- | --- |
| AI hỗ trợ siêu âm | Có thể phát hiện phép đo thiếu/sai với độ chính xác và cách giải thích đủ để bác sĩ tin dùng không? | Không được nói AI dự đoán hoặc loại trừ hội chứng Down thay bác sĩ. |
| AI hỗ trợ hội chẩn | Dữ liệu nào được phép dùng, AI đề xuất hội đồng theo tiêu chí nào và ai chịu trách nhiệm duyệt? | Không được tự động chọn hội đồng hoặc đưa chẩn đoán cuối cùng. |
| Expert AI tham vấn từ xa | Người dùng cần hỗ trợ bệnh lý nào, khi nào phải chuyển bác sĩ, memory nào được lưu và cách chống prompt injection ra sao? | Không được coi đây là thay thế bác sĩ; đây là lộ trình dài hạn. |
| Prototype hiện tại | Có nên tiếp tục ưu tiên luồng điều phối phòng/kết quả người bệnh trong phạm vi hiện tại không? | P1–P3 chưa xác nhận các giả thuyết H01–H04 về hành trình người bệnh. |

## Giả thuyết đang kiểm chứng, chưa phải insight

| Mã | Giả thuyết | Dấu hiệu cần tìm | Điều có thể bác bỏ |
| --- | --- | --- | --- |
| H01 | Người bệnh chưa rõ phòng/thứ tự | Kể được lần phải hỏi hoặc đi nhầm | Nhân viên/biển chỉ dẫn đã giải quyết đủ |
| H02 | Nhầm thực hiện xong với có kết quả, chưa biết có thể đi tiếp | Chờ tại chỗ vì thiếu thông tin | Chờ do quy trình bắt buộc hoặc đã biết rõ lý do |
| H03 | Không rõ kết quả nào có, còn thiếu gì, ai đã xem | Kể được sự kiện tìm thông tin/khó hiểu trạng thái | Thông báo và hướng dẫn hiện tại đã đủ |
| H04 | Không rõ bước quay lại bác sĩ | Hỏi lại hoặc bỏ sót vì thiếu chỉ dẫn | Quy trình hiện tại đã chỉ dẫn rõ |

Các insight mới cần kiểm chứng riêng bằng phỏng vấn bác sĩ/chuyên gia, người điều phối hội chẩn, người bệnh và thử nghiệm an toàn AI. Không gộp chúng thành bằng chứng cho prototype điều phối phòng hiện tại.

Chỉ nâng mức chắc chắn khi có bản ghi đã rà quyền sử dụng, bằng chứng trái chiều và bài thử phù hợp. Nghiên cứu bàn không thay các cuộc phỏng vấn.
