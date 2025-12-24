# AI Flashcard - Hướng Dẫn Chạy Dự Án

Dự án bao gồm 4 services chính cần chạy đồng thời:

- **Backend**: Node.js/Express API server
- **Frontend**: React/Vite application
- **Socket**: Socket.IO server cho real-time chat
- **AI-Python**: FastAPI server xử lý file và AI

## Yêu Cầu Hệ Thống

- Node.js >= 16.x
- Python >= 3.8
- npm hoặc yarn
- MongoDB
- Git

---

## 1. Cài Đặt Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

### Socket

```bash
cd socket
npm install
```

### AI-Python

```bash
cd ai-python
pip install -r requirements.txt
# hoặc
pip install fastapi uvicorn python-docx python-multipart
```

---

## 2. Cấu Hình Environment Variables

### Backend (.env)

Tạo file `.env` trong folder `backend`:

```env
# Server
PORT=5050
NODE_ENV=development
SERVER_URL=http://localhost:5050/api

# MongoDB
MONGO_URI=mongodb+srv://your_connection_string

# JWT Tokens
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Email Configuration (Gmail)
MAIL_SERVER=your_email@gmail.com
MAIL_PASS=your_app_password

# OAuth (if needed)
MAIL_CLIENT_ID=your_client_id
MAIL_CLIENT_SECRET=your_client_secret
MAIL_REFRESH_TOKEN=your_refresh_token
REDIRECT_URI=https://developers.google.com/oauthplayground

# Client
CLIENT_URL=http://localhost:5173

# Cloudinary (for image upload)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# AI
API_KEY_AI=your_ai_api_key
```

### Socket (.env)

Tạo file `.env` trong folder `socket`:

```env
API_ENDPOINT=http://localhost:5050/api
```

### Frontend (.env)

Tạo file `.env` trong folder `frontend`:

```env
VITE_API_URL=http://localhost:5050/api
VITE_SOCKET_URL=http://localhost:5070
```

---

## 3. Chạy Các Services

### Cách 1: Chạy Từng Service Riêng Lẻ

Mở 4 terminal khác nhau và chạy lần lượt:

#### Terminal 1 - Backend

```bash
cd backend
npm start
# hoặc development mode
npm run dev
```

✅ Backend chạy tại: `http://localhost:5050`

#### Terminal 2 - Socket

```bash
cd socket
npm start
# hoặc development mode
nodemon index.js
```

✅ Socket server chạy tại: `http://localhost:5070`

#### Terminal 3 - AI-Python

```bash
cd ai-python
python app.py
# hoặc
uvicorn app:app --host 0.0.0.0 --port 8080 --reload
```

✅ AI-Python chạy tại: `http://localhost:8080`

#### Terminal 4 - Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend chạy tại: `http://localhost:5173`

### Cách 2: Sử dụng Script Tự Động (Windows)

Tạo file `start-all.bat` ở thư mục gốc:

```batch
@echo off
start cmd /k "cd backend && npm start"
start cmd /k "cd socket && npm start"
start cmd /k "cd ai-python && python app.py"
start cmd /k "cd frontend && npm run dev"
```

Chạy: `start-all.bat`

---

## 4. Kiểm Tra Services

### Backend

```bash
curl http://localhost:5050/api/health
# hoặc mở browser: http://localhost:5050
```

### Socket

```bash
curl http://localhost:5070/ping
# Kết quả: {"message": "pong"}
```

### AI-Python

```bash
curl http://localhost:8080/
# hoặc mở Swagger UI: http://localhost:8080/docs
```

### Frontend

Mở browser: `http://localhost:5173`

---

## 5. API Endpoints Chính

### Backend API

- `GET /api/health` - Health check
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/flashcards` - Lấy danh sách flashcards
- `POST /api/flashcards` - Tạo flashcard mới

### AI-Python API

- `GET /` - Health check
- `POST /quiz` - Upload file .docx để tạo quiz

### Socket Events

- `newUser` - Thêm user online
- `sendMessage` - Gửi tin nhắn
- `sendMessageCommu` - Gửi tin nhắn community
- `joinRoom` - Tham gia phòng chat
- `disconnect` - Ngắt kết nối

---

## 6. Troubleshooting

### Lỗi: Cannot find module

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Port already in use

```bash
# Windows: Kill process on port
netstat -ano | findstr :5050
taskkill /PID <PID> /F

# Hoặc thay đổi port trong file .env
```

### Lỗi: MongoDB connection failed

- Kiểm tra MongoDB đang chạy
- Kiểm tra MONGO_URI trong .env
- Kiểm tra whitelist IP trên MongoDB Atlas

### Lỗi: Python module not found

```bash
pip install -r requirements.txt
# hoặc
pip install <module_name>
```

### Lỗi: CORS policy

- Kiểm tra CORS settings trong backend/index.js
- Kiểm tra CLIENT_URL trong backend/.env

---

## 7. Build Production

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
# Output: dist/
```

### Preview Frontend Build

```bash
npm run preview
```

---

## 8. Cấu Trúc Thư Mục

```
congngheweb_AIflashcard/
├── backend/                # Node.js API server
│   ├── controllers/       # Business logic
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Email, external APIs
│   ├── middleware/       # Authentication, validation
│   └── index.js          # Entry point
│
├── frontend/              # React/Vite application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utilities
│   │   └── main.tsx      # Entry point
│   └── package.json
│
├── socket/                # Socket.IO server
│   ├── index.js          # Socket events handler
│   └── package.json
│
├── ai-python/             # FastAPI AI server
│   ├── app.py            # Main application
│   └── requirements.txt  # Python dependencies
│
└── README.md             # This file
```

---

## 9. Các Lệnh Hữu Ích

### Backend

```bash
npm start          # Chạy production
npm run dev        # Chạy development với nodemon
npm run lint       # Kiểm tra code style
```

### Frontend

```bash
npm run dev        # Development server
npm run build      # Build production
npm run preview    # Preview production build
npm run lint       # Lint code
```

### AI-Python

```bash
python app.py                                    # Chạy server
uvicorn app:app --reload                        # Development mode
uvicorn app:app --host 0.0.0.0 --port 8080    # Custom host/port
```

---

## 10. Liên Hệ & Hỗ Trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra logs trong terminal
2. Kiểm tra file .env đã cấu hình đúng chưa
3. Đảm bảo tất cả dependencies đã được cài đặt
4. Kiểm tra MongoDB đang chạy

---

## License

[MIT License](LICENSE)
