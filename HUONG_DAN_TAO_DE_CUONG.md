# 📚 Hướng dẫn tạo đề cương ôn tập

## ✨ Tính năng mới

### 1. **Tạo đề cương dạng Text - Câu hỏi trắc nghiệm**

Mỗi câu hỏi có **4 đáp án A, B, C, D** và chọn đáp án đúng.

#### Format lưu trữ:

```
question: "Câu hỏi của bạn?"
answer: "A. Đáp án A|B. Đáp án B|C. Đáp án C|D. Đáp án D|correct:A"
```

#### Ví dụ câu hỏi:

```json
{
  "question": "Thủ đô của Việt Nam là gì?",
  "answer": "A. Hà Nội|B. Hồ Chí Minh|C. Đà Nẵng|D. Huế|correct:A"
}
```

### 2. **Upload file đề cương**

- Hỗ trợ: **PDF, DOCX, XLSX**
- Kích thước tối đa: **50MB**
- Upload trực tiếp lên Cloudinary
- Hoặc nhập link thủ công

---

## 🎯 Cách tạo đề cương

### Bước 1: Vào trang Admin

1. Đăng nhập với tài khoản Admin
2. Vào **Quản lý Đề cương**
3. Click nút **"Thêm đề cương"**

### Bước 2: Chọn loại đề cương

#### **A. Đề cương dạng Text (Trắc nghiệm)**

1. Nhập **Tiêu đề** đề cương
2. Chọn **Loại**: Text (TXT)
3. Nhập **Nội dung** (mô tả)
4. Upload **Hình ảnh** (URL hoặc upload)

5. **Thêm câu hỏi:**

   - Click "**Thêm câu**"
   - Nhập **Câu hỏi**
   - Nhập **4 đáp án** (A, B, C, D)
   - **Chọn đáp án đúng** bằng radio button
   - Lặp lại cho các câu tiếp theo

6. Click **"Tạo đề cương"**

#### **B. Đề cương dạng File (PDF/DOCX/XLSX)**

1. Nhập **Tiêu đề** đề cương
2. Chọn **Loại**: PDF, DOCX, hoặc XLSX
3. Nhập **Nội dung** (mô tả)
4. Upload **Hình ảnh** (URL)

5. **Upload file:**

   - **Cách 1**: Click "**Upload**" và chọn file từ máy
   - **Cách 2**: Nhập link file trực tiếp

6. Kích thước file sẽ tự động được detect
7. Click **"Tạo đề cương"**

---

## 📖 Cách học/ôn tập

### 1. Xem chi tiết đề cương

#### **Đề cương Text (Trắc nghiệm):**

- Vào trang đề cương → Click vào đề cương muốn học
- Xem danh sách câu hỏi và đáp án
- Đáp án đúng được **highlight màu xanh** ✓
- Search câu hỏi theo từ khóa
- Click số thứ tự bên phải để nhảy đến câu hỏi

#### **Đề cương File (PDF/DOCX/XLSX):**

- **PDF**: Xem trực tiếp trên trang web (iframe preview)
- **DOCX/XLSX**: Hiển thị thông tin + nút download
- Nút **"Xem tài liệu"** (màu xanh): Mở file trong tab mới
- Nút **"Tải xuống"**: Download file về máy
- Hiển thị icon file type (📄 PDF, 📘 DOCX, 📊 XLSX)
- Hiển thị kích thước file (MB)

### 2. Học bằng Flashcard (chỉ cho Text)

- Click nút **"Học bằng Flashcard"**

#### **Chế độ Flashcard:**

- Xem câu hỏi → Click để lật thẻ
- Xem 4 đáp án A, B, C, D
- Đáp án đúng có dấu **✓** màu xanh

#### **Chế độ Quiz:**

- Đọc câu hỏi
- Chọn 1 trong 4 đáp án
- Đúng → Màu xanh, tiến tới câu tiếp
- Sai → Màu đỏ, thử lại

### 3. Phím tắt

- **→** : Tiến tới
- **←** : Lùi lại
- **Space** : Lật thẻ (Flashcard mode)

---

## 🎨 Giao diện

### Trang Admin

- Hiển thị danh sách đề cương
- Tìm kiếm theo tiêu đề
- Xem số câu hỏi / dung lượng file
- Badge hiển thị loại (TXT, PDF, DOCX, XLSX)
- Xem lượt xem
- Xóa đề cương

### Trang chi tiết đề cương Text

- Hiển thị câu hỏi theo từng thẻ
- 4 đáp án A, B, C, D với border
- Đáp án đúng màu xanh với icon ✓
- Search câu hỏi
- Quick navigation sidebar

### Trang chi tiết đề cương File

- **Header:** Tiêu đề + Badge loại file + Icon
- **Stats:** Hiển thị dung lượng file (MB)
- **Buttons:**
  - **Xem tài liệu** (màu xanh lá): Mở tab mới
  - **Tải xuống** (outline): Download file
- **Preview area:**
  - **PDF:** Iframe xem trực tiếp (800px height)
  - **DOCX/XLSX:** Icon lớn + message "Không thể xem trước"
- **Mô tả:** Box màu xanh hiển thị content nếu có

### Trang thực hành (Flashcard)

- 2 chế độ: Flashcard & Quiz
- Hiển thị tiến trình học
- Đếm số câu đã học
- Animation khi trả lời đúng/sai

---

## 💡 Tips

### Tạo câu hỏi tốt:

1. **Câu hỏi rõ ràng**, không gây hiểu lầm
2. **4 đáp án** phải khác biệt rõ ràng
3. **1 đáp án đúng duy nhất**
4. Các đáp án sai phải **hợp lý** (không quá vô lý)

### Ví dụ tốt:

```
Câu hỏi: "Năm Bác Hồ đọc Tuyên ngôn độc lập?"
A. 1945 ✓
B. 1954
C. 1975
D. 1930
```

### Ví dụ không tốt:

```
Câu hỏi: "Bác Hồ sinh năm nao?" (lỗi chính tả)
A. 1890 ✓
B. Con mèo (vô lý)
C. Không biết (không phải đáp án)
D. (thiếu đáp án)
```

---

## 🚀 Tính năng đặc biệt

1. **Tự động shuffle** câu hỏi khi học
2. **Tự động shuffle** đáp án trong Quiz mode
3. **Âm thanh** khi trả lời đúng/sai
4. **Animation** khi chọn đáp án
5. **Theo dõi tiến trình** học tập
6. **Responsive** trên mọi thiết bị

---

## 📝 Backend API

### Tạo đề cương

```javascript
POST /api/so
Body: {
  title: string,
  content: string,
  image: string,
  type: 'txt' | 'pdf' | 'docx' | 'xlsx',
  quest: [{ question: string, answer: string }], // for txt
  link: string, // for file
  file_size: number // for file
}
```

### Format answer cho txt:

```
"A. text|B. text|C. text|D. text|correct:A"
```

---

## 🔧 Files đã cập nhật

1. `CreateSODialog.tsx` - Form tạo đề cương
2. `SOFlashcardPage.tsx` - Trang thực hành
3. `DeCuongDetailPage.tsx` - Trang chi tiết
4. `AdminSOPage.tsx` - Trang quản lý admin
5. `subjectOutlineController.js` - Backend controller
6. `etcService.ts` - Service upload file

---

## ✅ Checklist tạo đề cương

- [ ] Tiêu đề rõ ràng
- [ ] Chọn đúng loại (txt/file)
- [ ] Upload hình ảnh đẹp
- [ ] **Với Text:** Mỗi câu có 4 đáp án + chọn đúng
- [ ] **Với File:** Upload file hoặc link
- [ ] Kiểm tra preview trước khi lưu
- [ ] Test thực hành sau khi tạo

Chúc bạn tạo đề cương thành công! 🎉
