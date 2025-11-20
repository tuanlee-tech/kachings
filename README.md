Dưới đây là **README.md hoàn chỉnh** cho ứng dụng **Katchings / Lụm Lúa Pro** của bạn — viết rõ ràng, chuyên nghiệp, dễ dùng khi public GitHub hoặc publish demo.

---

# 💰 Katchings – Lụm Lúa Pro

**Dashboard thông báo nhận tiền real-time + đọc số tiền bằng giọng nói tiếng Việt**

Ứng dụng giúp hiển thị giao dịch nhận tiền (demo hoặc từ webhook PayOS), kèm theo hiệu ứng UI đẹp mắt, thông báo trình duyệt, âm thanh ding + đọc số tiền bằng Text-to-Speech giọng Việt.

## ✨ Tính năng nổi bật

### 🔔 Thông báo nhận tiền real-time

- Hiển thị popup ở góc phải khi có giao dịch mới.
- Tự động biến mất sau 6 giây.
- Hiệu ứng gradient & animation mượt.

### 🔊 Đọc số tiền bằng giọng nói tiếng Việt (Web Speech API)

- Tự động chuyển số sang dạng tiếng Việt:
  **123456 → "một trăm hai mươi ba nghìn bốn trăm năm mươi sáu"**
- Đọc câu thông báo:
  **"Bạn đã nhận được một trăm hai mươi ba nghìn bốn trăm năm mươi sáu đồng"**
- Có nút **Test âm thanh**.

### 📈 Dashboard số liệu trực quan

- Tổng tiền _hôm nay_
- Tổng thu nhập toàn thời gian
- Số giao dịch
- UI dùng hiệu ứng glassmorphism + gradient hiện đại.

### 🧾 Lịch sử giao dịch

- Tự sinh giao dịch demo mỗi **15 giây**
- Danh sách tối đa 50 giao dịch
- Hiển thị thời gian, mô tả, số tiền

### 🖥️ Hỗ trợ Notification API

- Nếu browser cho phép → bật thông báo desktop với icon + nội dung.

---

## 🚀 Công nghệ sử dụng

- **React + Hooks**
- **TailwindCSS** (UI)
- **lucide-react** (icons)
- **Web Speech API** (đọc số bằng giọng Việt)
- **Web Audio API** (tạo âm "beep")
- **Notification API** (thông báo desktop)

---

## 📦 Cài đặt & chạy project

### 1. Clone project

```bash
git clone https://github.com/your-repo/katchings.git
cd katchings
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Chạy dev

```bash
npm run dev
```

### 4. Mở trên trình duyệt

```
http://localhost:5173
```

---

## 🔧 Cách hoạt động

### 1. Demo Payment

Ứng dụng tự tạo giao dịch giả mỗi 15 giây:

```js
{
  amount: random(20000 → 800000),
  description: "Đơn hàng #xxxx",
  status: "PAID"
}
```

### 2. Xử lý giao dịch mới

- Cập nhật dashboard
- Thêm vào lịch sử
- Phát âm thanh
- Đọc số tiền bằng giọng Việt
- Bắn popup UI
- Bật thông báo trình duyệt nếu được cấp quyền

### 3. Text-to-Speech tiếng Việt

Dò giọng Việt trong `speechSynthesis.getVoices()`
→ Nếu có, đọc bằng giọng nữ tiếng Việt.

### 4. Web Audio Beep

Mỗi lần nhận tiền sẽ “ting!” trước khi đọc số.

---

## 🧪 Nút Test âm thanh

- Chỉ hoạt động khi audio context được user unlock
- Bạn phải bấm **Test âm thanh** hoặc **Bật âm thanh** ít nhất 1 lần do browser chặn autoplay audio

---

## 📜 File chính

### `PaymentDashboard.jsx`

Chứa toàn bộ logic:

- Text-to-Speech
- Beep sound
- Notification API
- Demo payment generator
- Format số sang tiếng Việt
- UI dashboard + list

---

## 🛠 Tùy chỉnh

### Thay đổi thời gian tạo demo payment

```js
setInterval(..., 15000); // 15 giây
```

### Giới hạn số giao dịch hiển thị

```js
.slice(0, 50)
```

---

## 📣 Tích hợp PayOS thật (tuỳ chọn)

Trong thực tế bạn chỉ cần gọi:

```js
handleNewPayment(webhookData);
```

---

## 📄 License

MIT © 2025 — **@tuanlee.tech**
