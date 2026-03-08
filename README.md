## Invitation Card Generator

Ứng dụng tạo và gửi thiệp mời cá nhân hoá theo mã khách mời.

## Lưu ý quan trọng

**Cảnh báo bảo mật:** Toàn bộ mã nguồn của dự án này được vibe code và chưa được kiểm tra kỹ lưỡng về bảo mật. Điều này có nghĩa là có thể tồn tại các lỗ hổng bảo mật nghiêm trọng, bao gồm nhưng không giới hạn ở:

- Lỗ hổng injection (SQL, XSS, v.v.)
- Xử lý dữ liệu không an toàn
- Thiếu xác thực đầu vào
- Các vấn đề bảo mật khác có thể dẫn đến rủi ro cho dữ liệu người dùng

**Khuyến nghị:** Không sử dụng ứng dụng này trong môi trường production hoặc với dữ liệu nhạy cảm. Nếu bạn muốn sử dụng, hãy tự kiểm tra và cải thiện bảo mật trước. Tác giả không chịu trách nhiệm về bất kỳ hậu quả nào phát sinh từ việc sử dụng mã nguồn này.

## Stack hiện tại

- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Lưu trữ dữ liệu: file JSON tại `data/invitations`

## Route chính

- `/`: trang nhập số thứ tự (guest)
- `/create`: trang tạo thiệp (host)
- `/i/:guestId`: trang xem thiệp cá nhân
  Bo

## Chạy local (dev)

Terminal 1:

```bash
npm run server:dev
```

Terminal 2:

```bash
npm run dev
```

## Cấu hình env

- Frontend gọi API cùng origin qua `/api` theo mặc định.
- Tùy chọn:
    - `VITE_API_BASE`: override URL API tuyệt đối ở frontend (production tách domain)
    - `VITE_API_PROXY_TARGET`: target cho Vite dev proxy `/api` (mặc định `http://localhost:4000`)

Ví dụ tạo file `.env`:

```bash
VITE_API_PROXY_TARGET=http://localhost:4000
```

## Build và chạy production

```bash
npm run build
npm run server
```

`server.js` sẽ:

- phục vụ API `/api/*`
- phục vụ static frontend từ `dist`
- fallback SPA cho route không phải `/api`

## Deploy nhanh

### Render

- Đã có sẵn file `render.yaml`.
- Tạo Web Service từ repo và dùng cấu hình mặc định trong file này.

### Railway / Fly / Heroku-like

- Có thể dùng `Procfile` đã cung cấp.
- Build command: `npm run build`
- Start command: `npm run start`

## Healthcheck

- Endpoint kiểm tra trạng thái server: `/api/health`

## Lời chúc riêng cho từng khách (Guest Wishes)

Kể từ phiên bản này, bạn có thể thêm lời chúc hoặc lời mời riêng cho từng khách mời trong thiệp:

- Ở trang **Tạo thiệp** (host page), trong phần "Ảnh và lời chúc cho từng khách":
    - Nhập lời chúc riêng cho từng khách (tùy chọn)
    - Lời chúc sẽ được hiển thị dưới lời mời chung trên thiệp

### JSON Format (Backward Compatible)

Dữ liệu khách mời với lời chúc:

```json
{
  "id": "invitation_id",
  "t": "classic",
  "e": {
    "eventTitle": "Thiệp mời",
    "hostMessage": "Lời mời chung..."
  },
  "g": [
    {
      "id": "001",
      "name": "Tên khách",
      "imageUrl": "https://...",
      "wishes": "Lời chúc riêng cho khách này (tùy chọn)"
    }
  ]
}
```

**Lưu ý bảo mật về dữ liệu cũ:** Nếu bạn có file JSON thiệp cũ mà không có field `wishes`, ứng dụng vẫn hoạt động bình thường (backward compatible). Khi import lại hoặc tạo mới, bạn có thể thêm lời chúc nếu muốn.

## Alternate CodeEntryPage component

Trong repo gốc (đã push lên GitHub) tập tin `src/components/CodeEntryPage.jsx` là
phiên bản chính thức dùng cho chức năng thiệp mời. Tuy nhiên bạn có thể thấy
bản được chỉnh sửa cục bộ cho các mục đích khác (ví dụ: làm bài kiểm tra) – nội
nội dung hiện tại được lưu trong `src/components/CodeEntryPage.backup.jsx`.

Nếu muốn sử dụng lại (hoặc thử) phiên bản phụ này, chỉ cần sao chép/đổi tên:

```bash
cp src/components/CodeEntryPage.backup.jsx src/components/CodeEntryPage.jsx
```

và rebuild ứng dụng. Sau đó đừng quên đẩy lại `CodeEntryPage.jsx` chính thức lên
GitHub nếu bạn đang làm việc với remote.

Đây chỉ là một phương án tạm, bạn có thể giữ nhiều biến thể khác nhau bằng cách
giữ các file `.backup.jsx` hoặc `*.alt.jsx`, sau đó chọn phiên bản bằng thao
tác sao chép như trên.
