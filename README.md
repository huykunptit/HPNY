# ✦ TaskFlow — Quản Lý Đơn Hàng

Ứng dụng quản lý đơn hàng / khách hàng dạng Notion với Kanban kéo thả và thông báo Telegram.

## Chạy local

```bash
npm install
npm start
# Mở http://localhost:3000
```

## Deploy lên Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

> ⚠️ **Lưu ý Vercel**: Vercel dùng serverless functions, filesystem chỉ ghi được vào `/tmp` và sẽ **reset khi cold start**. Dữ liệu không bền vĩnh. Nếu cần lưu lâu dài trên Vercel, hãy dùng [Vercel KV](https://vercel.com/storage/kv) hoặc một database bên ngoài.

## Deploy lên Heroku

```bash
# Cần có Heroku CLI
heroku login
heroku create ten-app-cua-ban
git init && git add . && git commit -m "init"
heroku git:remote -a ten-app-cua-ban
git push heroku main
```

> ⚠️ **Lưu ý Heroku**: File `data/tasks.json` được lưu trong dyno, sẽ **reset khi deploy lại hoặc dyno restart** (mỗi ~24h trên plan miễn phí). Backup dữ liệu thường xuyên bằng nút "Xuất CSV".

## Lưu trữ bền vĩnh (Production)

Thay thế file JSON bằng một database thực sự:
- **Supabase** (PostgreSQL, miễn phí): thêm gói `@supabase/supabase-js`
- **MongoDB Atlas** (NoSQL, miễn phí): thêm gói `mongoose`
- **Railway** (PostgreSQL): kéo thả deploy

## Cấu trúc project

```
taskflow/
├── server.js          ← Express API + serve frontend
├── package.json
├── vercel.json        ← Config Vercel
├── Procfile           ← Config Heroku
├── data/
│   └── tasks.json     ← Dữ liệu (tự tạo khi chạy)
└── public/
    └── index.html     ← Toàn bộ frontend
```

## API Endpoints

| Method | Path | Mô tả |
|--------|------|--------|
| GET | /api/tasks | Lấy tất cả đơn hàng |
| POST | /api/tasks | Tạo đơn mới |
| PUT | /api/tasks/:id | Cập nhật đơn |
| PATCH | /api/tasks/:id/status | Đổi trạng thái (kéo thả) |
| DELETE | /api/tasks/:id | Xoá đơn |

## Telegram Bot

1. Nhắn `/newbot` cho [@BotFather](https://t.me/BotFather) → copy **Bot Token**
2. Lấy **Chat ID** qua [@userinfobot](https://t.me/userinfobot)
3. Điền vào ⚙ Cài đặt trong app → Test kết nối
