# ✦ TaskFlow — Quản Lý Đơn Hàng

Ứng dụng quản lý đơn hàng / khách hàng dạng Notion với Kanban kéo thả và thông báo Telegram. Pure HTML/CSS/JS — không cần server.

## Chạy local

Mở thẳng `index.html` trong trình duyệt, hoặc serve bằng bất kỳ static server nào:

```bash
python3 -m http.server 3000
# Mở http://localhost:3000
```

## Deploy

- **Vercel**: kéo thả thư mục hoặc kết nối Git repo — không cần build, không cần config.
- **GitHub Pages**: push lên branch chính, bật Pages trong Settings.
- **Netlify / Cloudflare Pages**: drag-and-drop thư mục.

## Lưu trữ dữ liệu

Toàn bộ đơn hàng được lưu trong **`localStorage`** của trình duyệt:

- Dữ liệu nằm trên từng máy / từng trình duyệt, không đồng bộ giữa thiết bị.
- Xoá cache trình duyệt = mất data → backup thường xuyên bằng nút **"Xuất CSV"**.

## Telegram Bot

1. Nhắn `/newbot` cho [@BotFather](https://t.me/BotFather) → copy **Bot Token**
2. Lấy **Chat ID** qua [@userinfobot](https://t.me/userinfobot)
3. Điền vào ⚙ Cài đặt trong app → Test kết nối
