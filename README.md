# Sao kê Gala 2026

Web app tĩnh (HTML/CSS/JS) hiển thị **danh sách ủng hộ**, **các khoản chi** kèm
ảnh báo giá / hoá đơn / lệnh chi, và **số tiền còn tồn** cho sự kiện
**Gala 2026**.

## Tính năng

- Trang **Tổng quan**: tổng Thu, tổng Chi, số tiền còn lại; Top 5 ủng hộ và Top 5 khoản chi lớn nhất.
- Trang **Thu**: bảng danh sách người ủng hộ + số tiền + ghi chú, có ô tìm kiếm.
- Trang **Chi**: từng khoản chi hiển thị dưới dạng card, kèm các ảnh báo giá/hoá đơn/lệnh chi.
  Click ảnh để phóng to (lightbox), có nút trước/sau, hỗ trợ phím mũi tên & ESC.
- File báo giá PDF (loa đài/âm thanh) hiển thị trực tiếp trong lightbox.

## Cấu trúc thư mục

```
.
├── index.html       # Giao diện chính (tabs, bảng, lightbox)
├── styles.css       # Style
├── app.js           # Render dữ liệu, search, lightbox
├── data.js          # Dữ liệu Thu/Chi và mapping ảnh — chỉnh sửa file này để cập nhật
├── images/          # Ảnh báo giá, hoá đơn, lệnh chi
└── README.md
```

## Cập nhật dữ liệu

Mở file [`data.js`](./data.js) và sửa trực tiếp:

```js
window.GALA_DATA = {
  title: "GALA 2026 — Sao Kê Thu Chi",
  thu: [
    { name: "Anh Đại - Hợp tác xã Đại Nam", amount: 10000000, note: "..." },
    // thêm dòng ở đây
  ],
  chi: [
    {
      name: "Loa đài, âm thanh, ánh sáng, LED, bàn ghế",
      amount: 24450000,
      group: "Chi sự kiện",
      note: "Cọc + thanh toán 100%",
      images: [
        { src: "images/bao-gia-loa-am-thanh.pdf", caption: "Báo giá PDF" },
        { src: "images/chi-loa-am-thanh-1.jpg",   caption: "Lệnh chi 1" }
      ]
    }
  ]
};
```

Sau khi sửa, commit và push lên GitHub. GitHub Pages sẽ tự cập nhật.

## Chạy local

Vì là web tĩnh, mở thẳng `index.html` bằng trình duyệt là xem được. Hoặc chạy
một HTTP server đơn giản:

```bash
# Python 3
python3 -m http.server 8080
# rồi mở http://localhost:8080
```

## Deploy lên GitHub Pages

1. Push repo này lên GitHub.
2. Vào **Settings → Pages**.
3. Chọn **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**.
4. Lưu lại — sau ~1 phút trang sẽ chạy ở `https://<username>.github.io/<repo>/`.

## Bản quyền & sử dụng

Repo này được tạo cho mục đích minh bạch tài chính của Gala 2026. Hình ảnh
báo giá / lệnh chi chỉ dùng cho mục đích sao kê nội bộ.
