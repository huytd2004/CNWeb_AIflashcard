# 📝 Ví dụ format câu hỏi đề cương

## Format JSON backend nhận:

```json
{
  "title": "Lịch sử Việt Nam",
  "content": "Đề cương ôn tập môn Lịch sử Việt Nam",
  "image": "https://example.com/history.jpg",
  "type": "txt",
  "quest": [
    {
      "question": "Thủ đô của Việt Nam là gì?",
      "answer": "A. Hà Nội|B. Thành phố Hồ Chí Minh|C. Đà Nẵng|D. Huế|correct:A"
    },
    {
      "question": "Năm Bác Hồ đọc Tuyên ngôn độc lập?",
      "answer": "A. 1930|B. 1945|C. 1954|D. 1975|correct:B"
    },
    {
      "question": "Triều đại nào tồn tại lâu nhất trong lịch sử Việt Nam?",
      "answer": "A. Nhà Lý|B. Nhà Trần|C. Nhà Lê|D. Nhà Nguyễn|correct:C"
    },
    {
      "question": "Ai là vị vua sáng lập nhà Lý?",
      "answer": "A. Lý Thánh Tông|B. Lý Thái Tổ|C. Lý Thái Tông|D. Lý Nhân Tông|correct:B"
    },
    {
      "question": "Chiến thắng nào đánh dấu sự kết thúc chiến tranh Việt Nam?",
      "answer": "A. Điện Biên Phủ|B. Đồng Khởi|C. Xuân 1975|D. Tết Mậu Thân|correct:C"
    }
  ]
}
```

## Ví dụ các môn khác nhau:

### 1. Toán học

```json
{
  "question": "Căn bậc hai của 144 là?",
  "answer": "A. 10|B. 11|C. 12|D. 13|correct:C"
}
```

### 2. Tiếng Anh

```json
{
  "question": "What is the past tense of 'go'?",
  "answer": "A. goed|B. went|C. gone|D. going|correct:B"
}
```

### 3. Vật lý

```json
{
  "question": "Gia tốc trọng trường trên Trái Đất là?",
  "answer": "A. 8.8 m/s²|B. 9.8 m/s²|C. 10.8 m/s²|D. 11.8 m/s²|correct:B"
}
```

### 4. Hóa học

```json
{
  "question": "Công thức hóa học của nước là?",
  "answer": "A. H2O|B. CO2|C. NaCl|D. O2|correct:A"
}
```

### 5. Địa lý

```json
{
  "question": "Đỉnh núi cao nhất thế giới là?",
  "answer": "A. K2|B. Mount Everest|C. Kilimanjaro|D. Fansipan|correct:B"
}
```

### 6. Tin học

```json
{
  "question": "JavaScript được tạo ra bởi ai?",
  "answer": "A. Brendan Eich|B. Linus Torvalds|C. Bill Gates|D. Steve Jobs|correct:A"
}
```

### 7. Văn học

```json
{
  "question": "Tác giả của 'Truyện Kiều' là ai?",
  "answer": "A. Nguyễn Du|B. Hồ Xuân Hương|C. Tú Xương|D. Xuân Diệu|correct:A"
}
```

### 8. Sinh học

```json
{
  "question": "DNA viết tắt của từ gì?",
  "answer": "A. Deoxyribonucleic Acid|B. Deoxygen Acid|C. Digital Nucleic Acid|D. Direct Natural Acid|correct:A"
}
```

## Format khi frontend gửi lên:

Từ form nhập:

```javascript
// User nhập:
question: "Thủ đô của Việt Nam là gì?"
answers: [
  { label: 'A', text: 'Hà Nội' },
  { label: 'B', text: 'Thành phố Hồ Chí Minh' },
  { label: 'C', text: 'Đà Nẵng' },
  { label: 'D', text: 'Huế' }
]
correctAnswer: 'A'

// Frontend convert thành:
{
  question: "Thủ đô của Việt Nam là gì?",
  answer: "A. Hà Nội|B. Thành phố Hồ Chí Minh|C. Đà Nẵng|D. Huế|correct:A"
}
```

## Format khi parse để hiển thị:

```javascript
// Input string:
"A. Hà Nội|B. Thành phố Hồ Chí Minh|C. Đà Nẵng|D. Huế|correct:A"

// Parse thành:
{
  options: [
    { label: 'A', text: 'Hà Nội' },
    { label: 'B', text: 'Thành phố Hồ Chí Minh' },
    { label: 'C', text: 'Đà Nẵng' },
    { label: 'D', text: 'Huế' }
  ],
  correctAnswer: 'A'
}
```

## Tips viết câu hỏi tốt:

### ✅ Tốt:

- Câu hỏi rõ ràng, cụ thể
- 4 đáp án khác biệt
- 1 đáp án đúng duy nhất
- Các đáp án sai hợp lý

### ❌ Không tốt:

- Câu hỏi mơ hồ
- Đáp án trùng lặp
- Nhiều đáp án đúng
- Đáp án sai vô lý

## Ví dụ đầy đủ một đề cương:

```json
{
  "title": "Ôn tập Tiếng Anh lớp 10 - Unit 1",
  "content": "Vocabulary và Grammar cơ bản",
  "image": "https://example.com/english.jpg",
  "type": "txt",
  "quest": [
    {
      "question": "Choose the correct word: I ____ to school every day.",
      "answer": "A. go|B. goes|C. going|D. went|correct:A"
    },
    {
      "question": "What is the synonym of 'happy'?",
      "answer": "A. Sad|B. Joyful|C. Angry|D. Tired|correct:B"
    },
    {
      "question": "Which sentence is correct?",
      "answer": "A. She don't like it|B. She doesn't like it|C. She not like it|D. She didn't likes it|correct:B"
    },
    {
      "question": "What is the past tense of 'eat'?",
      "answer": "A. eated|B. eaten|C. ate|D. eating|correct:C"
    },
    {
      "question": "Choose the correct preposition: I'm good ____ Math.",
      "answer": "A. at|B. in|C. on|D. for|correct:A"
    }
  ]
}
```

## Test parse function:

```javascript
function parseAnswer(answerString) {
  const parts = answerString.split("|");
  const options = [];
  let correctAnswer = "";

  parts.forEach((part) => {
    if (part.startsWith("correct:")) {
      correctAnswer = part.replace("correct:", "").trim();
    } else {
      const match = part.match(/^([A-D])\.\s*(.+)/);
      if (match) {
        options.push({
          label: match[1],
          text: match[2].trim(),
        });
      }
    }
  });

  return { options, correctAnswer };
}

// Test:
const input = "A. Hà Nội|B. TP HCM|C. Đà Nẵng|D. Huế|correct:A";
console.log(parseAnswer(input));
/* Output:
{
  options: [
    { label: 'A', text: 'Hà Nội' },
    { label: 'B', text: 'TP HCM' },
    { label: 'C', text: 'Đà Nẵng' },
    { label: 'D', text: 'Huế' }
  ],
  correctAnswer: 'A'
}
*/
```

Sử dụng format này để đảm bảo câu hỏi của bạn được hiển thị đúng! ✨
