# 💰 Lụm Lúa - Hệ thống Thu Ngân Tự Động

> Giải pháp thu ngân thông minh cho tạp hóa/quán ăn nhỏ - Nhận thông báo âm thanh tự động khi có tiền chuyển khoản qua PayOS

## ✨ Tính năng

- ✅ **Thông báo âm thanh tự động** - Text-to-Speech tiếng Việt tự nhiên
- ✅ **Dashboard realtime** - Theo dõi giao dịch trực tiếp
- ✅ **PWA Support** - Cài đặt như app trên điện thoại/máy tính
- ✅ **Offline-ready** - Hoạt động kể cả khi mất mạng tạm thời
- ✅ **Queue System** - Xử lý hàng trăm giao dịch/giây không bỏ sót
- ✅ **Miễn phí 100%** - Dùng PayOS (free tier)

---

## 📋 Yêu cầu hệ thống

### Phần cứng tối thiểu:

- Laptop/PC cũ (hoặc Raspberry Pi 3+)
- Loa (USB/3.5mm/Bluetooth)
- Kết nối WiFi ổn định

### Phần mềm:

- Node.js 18+ ([Tải tại đây](https://nodejs.org))
- Browser hiện đại (Chrome/Edge/Safari)
- Tài khoản PayOS ([Đăng ký miễn phí](https://payos.vn))

---

## 🚀 Cài đặt nhanh

### Bước 1: Clone project

```bash
git clone https://github.com/your-username/lum-lua.git
cd lum-lua
```

### Bước 2: Cài dependencies

```bash
npm install
```

### Bước 3: Cấu hình PayOS

1. Đăng ký tài khoản tại [PayOS.vn](https://payos.vn)
2. Kết nối tài khoản ngân hàng (MB/ACB/OCB/KienlongBank/BIDV)
3. Lấy API credentials từ Dashboard PayOS
4. Tạo file `.env`:

```bash
# .env
PAYOS_CLIENT_ID=your_client_id_here
PAYOS_API_KEY=your_api_key_here
PAYOS_CHECKSUM_KEY=your_checksum_key_here
PORT=3001
```

### Bước 4: Chạy ứng dụng

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

Mở trình duyệt: `http://localhost:3001`

---

## 📱 Cài đặt PWA (Progressive Web App)

### Trên Desktop (Chrome/Edge):

1. Mở `http://localhost:3001`
2. Nhấn biểu tượng ➕ hoặc 🖥️ ở thanh địa chỉ
3. Click "Cài đặt Lụm Lúa"
4. App sẽ chạy độc lập như ứng dụng desktop

### Trên Mobile (iOS/Android):

**Android:**

1. Mở Chrome → Truy cập app
2. Menu (⋮) → "Thêm vào màn hình chính"
3. Icon app xuất hiện như app thật

**iOS (Safari):**

1. Mở Safari → Truy cập app
2. Nhấn nút Share (📤)
3. Chọn "Thêm vào Màn hình chính"

### Lợi ích PWA:

- ⚡ Khởi động nhanh như native app
- 📵 Hoạt động offline (cache data)
- 🔔 Nhận thông báo push
- 💾 Không tốn dung lượng nhiều

---

## 🔧 Cấu trúc thư mục

```
lum-lua/
├── public/
│   ├── icon-192.png          # Icon PWA 192x192
│   ├── icon-512.png          # Icon PWA 512x512
│   ├── manifest.json         # PWA manifest
│   └── service-worker.js     # Service Worker (offline support)
├── src/
│   ├── components/
│   │   └── PaymentDashboard.jsx
│   ├── server/
│   │   ├── index.js          # Express server + WebSocket
│   │   ├── database.js       # SQLite setup
│   │   └── payos-webhook.js  # PayOS webhook handler
│   ├── App.jsx
│   └── main.jsx
├── .env                      # Config (KHÔNG commit lên Git!)
├── package.json
└── README.md
```

---

## 🎯 Cách sử dụng

### 1. Khởi động hệ thống

```bash
npm start
```

### 2. Mở Dashboard

- Desktop: `http://localhost:3001`
- Mobile (cùng WiFi): `http://192.168.1.xxx:3001`

### 3. Test âm thanh

- Click nút **"🔊 Test âm thanh"**
- Nếu bị khóa → Click icon 🔇 để unlock audio

### 4. Kết nối loa Bluetooth (Khuyến nghị)

- Pair laptop với loa Bluetooth
- Chỉnh volume loa to vừa phải
- Test lại âm thanh

### 5. Nhận tiền thực tế

- Khách quét mã QR PayOS của bạn
- Chuyển khoản
- Hệ thống tự động:
  - 🔊 Phát âm "Bạn đã nhận được XXX đồng"
  - 📱 Hiển thị popup thông báo
  - 💾 Lưu vào database
  - 📊 Cập nhật thống kê

---

## 🧪 Stress Test

Dashboard có sẵn nút **"🚀 Stress Test"** để kiểm tra:

```javascript
// Test 500 giao dịch trong ~1 giây
stressTest(500, 1);
```

**Kết quả mong đợi:**

- ✅ Tất cả 500 giao dịch được hiển thị
- ✅ Stats đếm chính xác
- ✅ TTS không bị chồng/lặp
- ✅ UI không bị lag

---

## 🔐 Bảo mật

### Webhook Security:

PayOS webhook có signature verification:

```javascript
// server/payos-webhook.js
const verifyWebhook = (req) => {
  const signature = req.headers["x-payos-signature"];
  const data = JSON.stringify(req.body);
  const hash = crypto
    .createHmac("sha256", process.env.PAYOS_CHECKSUM_KEY)
    .update(data)
    .digest("hex");
  return signature === hash;
};
```

### HTTPS (Production):

Sử dụng Nginx + Let's Encrypt:

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 💡 Tips & Tricks

### 1. Tối ưu cho quán đông

```javascript
// Tăng volume loa
utterance.volume = 1.0;

// Tăng tốc độ đọc
utterance.rate = 1.2;
```

### 2. Chạy 24/7 trên laptop cũ

```bash
# Tắt sleep mode (Ubuntu)
sudo systemctl mask sleep.target suspend.target hibernate.target

# Auto-start khi boot
pm2 start npm --name "lum-lua" -- start
pm2 startup
pm2 save
```

### 3. Backup database định kỳ

```bash
# Backup SQLite mỗi ngày 2h sáng
0 2 * * * cp /path/to/payments.db /backup/payments-$(date +\%Y\%m\%d).db
```

### 4. Monitor qua điện thoại (khi bận)

- Cài PWA trên điện thoại
- Kết nối cùng WiFi
- Mở app → Xem realtime

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "Audio context was blocked"

**Nguyên nhân:** Browser chặn autoplay audio  
**Giải pháp:** Click nút 🔇 để unlock audio

### Lỗi: "Không phát được âm thanh"

**Kiểm tra:**

1. Volume hệ thống đã bật chưa?
2. Loa có kết nối đúng không?
3. F12 → Console có lỗi gì?

### Lỗi: PayOS webhook không về

**Kiểm tra:**

1. Webhook URL đã cấu hình đúng trên PayOS Dashboard chưa?
2. Server có đang chạy không? (`netstat -an | grep 3001`)
3. Firewall có chặn port 3001 không?

### Giao dịch bị bỏ sót

**Nguyên nhân:** Mất mạng tạm thời  
**Giải pháp:** Hệ thống có queue + retry logic, sẽ sync lại khi có mạng

---

## 📊 Giới hạn của PayOS Free Tier

- Ngân hàng hỗ trợ: MB, ACB, OCB, BIDV, KienlongBank (cá nhân)
- Rate limit: ~100 requests/phút
- Webhook delay: 1-3 giây (thường < 2s)
- Không giới hạn số giao dịch

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh!

1. Fork repo
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Tạo Pull Request

---

## 📝 License

MIT License - Tự do sử dụng cho mục đích thương mại

---

## 🙏 Credits

- **PayOS** - Cổng thanh toán miễn phí
- **Web Speech API** - Text-to-Speech
- **React** + **Tailwind CSS** - UI Framework

---

## 📞 Liên hệ & Support

- 🌐 Website: tuanlee.tech
- 📧 Email: contact@tuanlee.tech
- 💬 GitHub Issues: [Báo lỗi tại đây](https://github.com/your-username/lum-lua/issues)

---

## ⭐ Nếu thấy hữu ích, hãy cho project 1 star nhé!

**Happy Coding! 🚀**
