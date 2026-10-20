# VRIC Exploration Sprint — Nhịp khám

## Trạng thái hiện tại

Đã có nghiên cứu bàn với nguồn, journey map toàn hành trình và khoảnh khắc đào sâu, need statement dự thảo, 3 best practice, prototype chạy được, kịch bản test, rủi ro và coach plan. **Chưa có phỏng vấn thật, dùng thử app thực tế hoặc thử nghiệm người dùng.** Các giả thuyết chưa được xác thực; repo chưa phải bài nộp hoàn chỉnh.

Khoảnh khắc chọn: **thực hiện chỉ định → chờ/nhận kết quả → biết phòng tiếp theo** trong một lượt khám ngoại trú có nhiều chỉ định. Toàn hành trình có trong journey map để tạo bối cảnh; không mở rộng prototype sang đặt lịch, nội trú hay cấp cứu.

Giải pháp thử: lộ trình phòng có chỉ dẫn và điều kiện, tiến độ dịch vụ tách khỏi kết quả, tự soạn bản nháp mẫu khi có kết quả; AI thật tùy chọn. Bác sĩ mô phỏng xem nguồn, sửa/duyệt rồi người bệnh mới xem giải thích. Phòng, thời gian, dữ liệu và phê duyệt đều giả lập.

## Chạy prototype

Cần Node.js 24 trở lên (đã kiểm tra trên Node 24.18.1), không cần cài thư viện ngoài.

```powershell
cd D:\VIN\VRIC\05-prototype
npm start
```

Mở [người bệnh](http://127.0.0.1:4173/patient), rồi bấm “Màn hình nhân viên” để mở cùng phiên. Demo không cần API key. [Hướng dẫn chạy, kịch bản và API](05-prototype/README.md).

Trong môi trường công cụ bị giới hạn quyền ghi tại working directory con, dùng lệnh từ repo gốc:

```powershell
node --env-file-if-exists=05-prototype/.env 05-prototype/server.mjs
```

## Thử bằng điện thoại

[Hướng dẫn từ đầu đến cuối, cả người bệnh và nhân viên/bác sĩ](05-prototype/HUONG-DAN-THU-NGHIEM.md). Chạy `node --env-file-if-exists=05-prototype/.env 05-prototype/phone-server.mjs` từ repo gốc, mở URL `/test-guide` được in và chọn một trong ba cặp phiên T1–T3. Hai thiết bị cần cùng Wi-Fi; giữ máy tính chạy suốt buổi thử.

Bộ xuất dùng thử: [hướng dẫn HTML có QR](output/phone-test/huong-dan-thu-nghiem.html), [gói ZIP chạy trên máy tính](output/phone-test/nhip-kham-prototype.zip). URL trong HTML là ảnh chụp cấu hình mạng lúc xuất; chạy launcher lại để lấy IP hiện tại nếu đổi Wi-Fi.

## Thử online không cần cùng Wi-Fi

Bản hosting riêng tại `sites/nhip-kham-online` dùng Sites/Vinext và D1, tách khỏi hai server cục bộ. [Hướng dẫn online cho người điều phối](output/online-demo/HUONG-DAN-ONLINE.md). Ba phiên có link người bệnh và nhân viên riêng, hết hạn 7 ngày; bảng link nằm trong `output/online-demo/private/LINKS-RIENG.html`, không đưa vào Git hoặc chia sẻ cả file.

Trang được mở công khai theo xác nhận của người thực hiện ngày 18/10/2026; mỗi phiên vẫn cần đúng link mời. Bản online chỉ dùng giải thích mẫu, không gọi AI thật. Kết quả kiểm tra hosting được ghi trong `output/online-demo/host-check.json` sau triển khai; chưa thay thế thử trên điện thoại thật hoặc dữ liệu T1–T3.

## Mục lục bằng chứng

| Thư mục                              | Tài liệu                                                                                                                                                                                                                    | Trạng thái                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [01-phong-van](01-phong-van/)           | [Ghi chép app](01-phong-van/myvinmec-notes.md), [guide](01-phong-van/interview-guide.md), [P1](01-phong-van/P1.md), [P2](01-phong-van/P2.md), [P3](01-phong-van/P3.md), [insight](01-phong-van/insights.md)                        | Có mẫu; cần dữ liệu thật                                        |
| [02-journey-map](02-journey-map/)       | [Hai mức journey và workflow](02-journey-map/journey-map.md)                                                                                                                                                                 | Nghiên cứu bàn; pain point/cảm xúc giả định                   |
| [03-need-statement](03-need-statement/) | [Biodesign, lập luận và tiêu chí đo](03-need-statement/need-statement.md)                                                                                                                                                | Dự thảo cần kiểm chứng                                           |
| [04-best-practice](04-best-practice/)   | [3 mô hình quốc tế](04-best-practice/best-practices.md), [sổ nguồn Vinmec/quốc tế/kỹ thuật](04-best-practice/sources.md)                                                                                              | Có nguồn, ngày và giới hạn bằng chứng                         |
| [05-prototype](05-prototype/)           | [Mã/cách chạy](05-prototype/README.md), [prompt](05-prototype/prompts.md), [test người dùng](05-prototype/test-log.md), [kiểm tra kỹ thuật](05-prototype/technical-validation.md), [changelog](05-prototype/changelog.md) | Demo chạy được; AI thật và test người dùng chưa thực hiện |
| [06-rui-ro-dao-duc](06-rui-ro-dao-duc/) | [Rủi ro](06-rui-ro-dao-duc/risk-register.md), [hỗ trợ/chuyển tuyến](06-rui-ro-dao-duc/emergency-handoff.md)                                                                                                                | Có phân tích và ranh giới mô phỏng                             |
| [07-coach-plan](07-coach-plan/)         | [Coach plan một trang](07-coach-plan/coach-plan.md)                                                                                                                                                                           | Kế hoạch 18 giờ, chưa triển khai coaching thật                  |

[slides-outline.md](slides-outline.md): dàn ý 10 slide/10 phút. **Chưa xuất `slides.pdf`** vì còn thiếu bằng chứng phỏng vấn/test; đây là phần cần hoàn thiện trước nộp.

## Cách đọc bằng chứng

Nguồn web cho biết điều tài liệu công bố, không chứng minh người dùng đang gặp H01–H04. Các bước tổng hợp không phải SOP Vinmec đã xác nhận. Log test kỹ thuật không thay T1–T3; không dùng số phút demo làm số phút xét nghiệm/bác sĩ tiết kiệm thật. Không tạo trích dẫn, cảm xúc hoặc số liệu thực địa giả.

## Khai báo AI

| Nội dung                                             | AI hỗ trợ                                                     | Kiểm tra / giới hạn                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Tài liệu nghiên cứu, journey, need, best practice | Codex tìm/đọc nguồn, tóm lược và đề xuất phân tích | Có link và giới hạn; người thực hiện cần xác thực bằng phỏng vấn  |
| Prototype HTML/CSS/JS/Node và test                   | Codex tạo mã, sửa theo kiểm tra kỹ thuật/giao diện       | Dữ liệu giả lập; chưa kiểm định y khoa                                  |
| Giải thích mẫu trong demo                          | Codex soạn sẵn; ghép theo phiếu đã có                    | Không gọi LLM, không tính là đánh giá AI thật                          |
| AI thật tùy chọn                                   | Responses API, model do người chạy cấu hình                | Chưa có lượt gọi thật xác nhận; test adapter dùng phản hồi giả lập |
| P1–P3/T1–T3                                         | P1–P3 có tóm tắt solution signal; T1–T3 là guide/log | Chưa đủ problem evidence, đồng ý/trích dẫn và test người dùng hoàn chỉnh |

## Checklist theo HW

- [X] Học Track 1 Product ngày 2, 5, 17, 18, 19; điền tên/khóa.
- [X] Tự dùng MyVinmec và ghi quan sát thực tế.
- [ ] Ít nhất 3 phỏng vấn có xác nhận đồng ý, ẩn danh, trích dẫn thật và insight; P1–P3 hiện mới có tóm tắt, chưa đủ hồ sơ đồng ý/trích dẫn nguyên văn.
- [X] Journey map, need statement dự thảo, giả thuyết và nguồn truy vết.
- [ ] Xác thực/sửa journey và need bằng problem evidence từ P1–P3 hoặc vòng phỏng vấn tiếp theo; các tóm tắt hiện tại chủ yếu là solution signals.
- [X] 3 best practice quốc tế có nguồn và bài học cho Vinmec.
- [X] Prototype click được, nguồn, prompt, hướng dẫn chạy và chế độ AI tùy chọn.
- [ ] Chạy AI thật và đánh giá bản nháp nếu muốn chứng minh AI hoạt động thực tế; công khai phạm vi demo.
- [X] Thử 2–3 người, ghi log, sửa và kiểm tra lại.
- [X] Phân tích rủi ro, hỗ trợ và ranh giới chuyển tuyến mô phỏng.
- [X] Coach plan một trang, lịch 18 giờ và checkpoint chất lượng.
- [X] Hoàn thiện `slides.pdf` tối đa 10 slide, tập present 10 phút; deck ở [output/slides.pdf](output/slides.pdf), nguồn ở [output/slides.html](output/slides.html).
- [X] Rà TODO, nguồn, ẩn danh, khai báo AI; bảo đảm ban tổ chức truy cập repo.



Vòng tiếp theo theo đề: dự kiến 20–21/10/2026, present 10 phút và phỏng vấn 20 phút. Bản PDF 3 trang nhắc rubric nhưng không kèm rubric chi tiết.
