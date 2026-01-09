# Courier Services Management System

[![Laravel](https://img.shields.io/badge/Laravel-^12.0-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-^19.1.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-^3.x-06B6D4?style=for-the-badge\&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-^5.x-646CFF?style=for-the-badge\&logo=vite)](https://vitejs.dev/)
[![Yarn](https://img.shields.io/badge/Yarn-^1.22-2C8EBB?style=for-the-badge&logo=yarn)](https://yarnpkg.com/)

---

## Giới thiệu

**Courier Services Management System** là một ứng dụng web mô phỏng hệ thống **quản lý chuyển phát – giao nhận hàng hóa**, được xây dựng phục vụ **mục đích học tập và đồ án môn học**.

Hệ thống cho phép **Quản trị viên**, **Đại lý/Chi nhánh** và **Người dùng** tương tác trên cùng một nền tảng để quản lý đơn chuyển phát, theo dõi lô hàng, hóa đơn và thông báo trạng thái giao hàng.

Dự án sử dụng kiến trúc **Backend API (Laravel)** kết hợp **Frontend SPA (React + Vite + Tailwind CSS)** nhằm đảm bảo hiệu năng, khả năng mở rộng và trải nghiệm người dùng hiện đại.

---

## Mục tiêu dự án

* Xây dựng hệ thống Courier Services theo mô hình thực tế
* Áp dụng kiến trúc RESTful API
* Thực hành React Router, Layout, Role-based UI
* Mô phỏng nghiệp vụ chuyển phát và theo dõi lô hàng
* Phục vụ demo, báo cáo và bảo vệ đồ án

---

## Phân quyền hệ thống

### 1. Quản trị viên (Admin)

* Quản lý chuyển phát
* Quản lý đại lý/chi nhánh
* Quản lý khách hàng
* Quản lý hóa đơn
* Theo dõi trạng thái lô hàng
* Báo cáo & thống kê
* Quản lý thông báo

### 2. Đại lý / Chi nhánh (Branch)

* Đặt và xử lý chuyển phát tại chi nhánh
* Cập nhật trạng thái giao hàng
* In biên nhận
* Xem báo cáo theo chi nhánh

### 3. Người dùng (Customer)

* Đăng ký / đăng nhập
* Đặt chuyển phát (tùy chọn)
* Theo dõi lô hàng
* Nhận thông báo trạng thái
* Quản lý hồ sơ cá nhân

---

## Công nghệ sử dụng

| Thành phần | Công nghệ        | Mô tả                   |
| ---------- | ---------------- | ----------------------- |
| Backend    | Laravel ^12.x    | Xây dựng REST API       |
| Frontend   | React + Vite     | SPA hiện đại, nhanh     |
| Styling    | Tailwind CSS     | Giao diện responsive    |
| Router     | React Router DOM | Điều hướng & phân quyền |
| State      | Context API      | Quản lý đăng nhập       |
| Database   | MySQL            | Lưu trữ dữ liệu         |

---

## Chức năng Frontend chính

### Trang công khai (User)

* Trang chủ
* Tra cứu lô hàng theo mã tracking
* Đăng nhập / Đăng ký
* Quản lý hồ sơ
* Lịch sử chuyển phát

### Trang Admin

* Dashboard thống kê
* Quản lý chuyển phát
* Quản lý đại lý
* Quản lý khách hàng
* Quản lý hóa đơn
* Quản lý trạng thái lô hàng
* Báo cáo & biểu đồ

### Trang Agent

* Dashboard chi nhánh
* Danh sách lô hàng
* Cập nhật trạng thái
* In biên nhận

---

## Cài đặt & chạy dự án

### 1. Backend (Laravel – API)

> Hiện tại Backend mới khởi tạo, chỉ cần cài dependency

```bash
composer install
```

> Thiết lập môi trường & database

```bash
cp .env.example .env
php artisan key:generate
```

> Chạy migrate và seed dữ liệu mẫu

```bash
php artisan migrate --seed
```

---

### 2. Frontend (React + Vite)

```bash
# Cài dependency
yarn install

# Chạy project
yarn dev
```

Ứng dụng chạy mặc định tại:

```
http://localhost:5178
```

---

## Ghi chú

* Dự án phục vụ mục đích học tập, không triển khai thanh toán thực tế
* Các chức năng báo cáo/xuất file có thể mô phỏng
* Có thể mở rộng thêm Mobile App hoặc AI Tracking trong tương lai

---

## Tác giả

* Nhóm học viên thực hiện: **Team 2 (Hoàng Trung Nam - Hà Minh Tuấn)**
* Công nghệ: Laravel + React + Tailwind
* Năm thực hiện: **2025**
