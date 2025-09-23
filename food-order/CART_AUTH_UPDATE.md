# Cập nhật logic kiểm tra đăng nhập khi thêm vào giỏ hàng

## Các thay đổi đã thực hiện:

### 1. Cập nhật AuthStore (`src/stores/authStore.js`)

- ✅ Thêm getter `isAuthenticated` để kiểm tra trạng thái đăng nhập
- ✅ Thêm action `initializeAuth()` để khởi tạo auth state từ localStorage

### 2. Cập nhật Main.js (`src/main.js`)

- ✅ Sử dụng `authStore.initializeAuth()` thay vì gán trực tiếp giá trị token

### 3. Cập nhật các component Food:

#### FoodComponent (`src/components/foodComponents/FoodComponent.vue`)

- ✅ Import `useAuthStore` và `useRouter`
- ✅ Thêm kiểm tra `authStore.isAuthenticated` trong function `addToCart`
- ✅ Hiển thị toast warning và redirect đến `/login` nếu chưa đăng nhập

#### FoodDetailComponent (`src/components/foodComponents/FoodDetailComponent.vue`)

- ✅ Import `useAuthStore` và `useRouter`
- ✅ Thêm kiểm tra `authStore.isAuthenticated` trong function `addToCart`
- ✅ Hiển thị toast warning và redirect đến `/login` nếu chưa đăng nhập

### 4. Cập nhật các component Combo:

#### Combo (`src/components/comboComponents/Combo.vue`)

- ✅ Import `useAuthStore`
- ✅ Thêm kiểm tra `authStore.isAuthenticated` trong function `handleAddToCart`
- ✅ Hiển thị toast warning và redirect đến `/login` nếu chưa đăng nhập

#### ComboDetailViewComponent (`src/components/comboComponents/ComboDetailViewComponent.vue`)

- ✅ Import `useAuthStore` và `useRouter`
- ✅ Thêm kiểm tra `authStore.isAuthenticated` trong function `addToCart`
- ✅ Hiển thị toast warning và redirect đến `/login` nếu chưa đăng nhập

## Cách hoạt động:

1. **Khi user chưa đăng nhập và click "Thêm vào giỏ hàng":**

   - Hiển thị toast warning: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!"
   - Tự động redirect đến trang `/login`
   - Không thực hiện thêm sản phẩm vào giỏ hàng

2. **Khi user đã đăng nhập:**
   - Tiến hành thêm sản phẩm vào giỏ hàng bình thường
   - Hiển thị toast success: "Đã thêm vào giỏ hàng!"

## Lưu ý:

- Logic kiểm tra sử dụng `authStore.isAuthenticated` getter - kiểm tra cả token trong store và localStorage
- Sử dụng `toast.warning()` để hiển thị thông báo với màu vàng/cam thay vì error màu đỏ
- Tự động redirect đến trang login để cải thiện UX

## Test:

1. Xóa token khỏi localStorage hoặc logout
2. Thử click "Thêm vào giỏ hàng" trên bất kỳ sản phẩm nào
3. Kiểm tra xem có hiển thị thông báo và redirect đến trang login không
