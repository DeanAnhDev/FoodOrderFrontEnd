<template>
    <div class="checkout-success">
        <div class="success-card">
            <div class="icon-wrapper">
                <svg class="success-icon" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#4caf50" />
                    <path d="M18 34l10 10 18-18" stroke="#fff" stroke-width="4" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <h2>Thanh toán thành công!</h2>
            <p class="thank">Cảm ơn bạn đã mua sắm tại Ghiền Restaurant!</p>
            <div class="actions">
                <button class="primary" @click="goHome">Tiếp tục mua sắm</button>
                <button class="secondary" @click="goOrders">Xem đơn đã mua</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useCartStore } from '@/stores/cartStore'

export default {
    name: 'CheckoutSuccess',
    setup() {
        const cartStore = useCartStore()

        // Clear cart và fetch lại để đảm bảo sync với server
        setTimeout(() => {
            cartStore.clearCart()
            cartStore.fetchCart()
        }, 1000)

        return { cartStore }
    },
    methods: {
        goHome() {
            this.$router.push('/menu');
        },
        goOrders() {
            this.$router.push('/account'); // hoặc '/orders' nếu có trang riêng
        }
    }
}
</script>

<style scoped>
.checkout-success {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e0f7fa 0%, #f1f8e9 100%);
}

.success-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.15);
    padding: 40px 32px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    animation: fadeIn 0.7s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(40px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.icon-wrapper {
    margin-bottom: 18px;
}

.success-icon {
    width: 64px;
    height: 64px;
    display: inline-block;
}

h2 {
    color: #388e3c;
    font-size: 2rem;
    margin-bottom: 10px;
}

.thank {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 28px;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 16px;
}

button {
    padding: 12px 28px;
    font-size: 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.08);
    transition: background 0.2s, transform 0.2s;
}

.primary {
    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
    color: #fff;
}

.primary:hover {
    background: linear-gradient(90deg, #388e3c 0%, #43e97b 100%);
    transform: translateY(-2px);
}

.secondary {
    background: #fff;
    color: #388e3c;
    border: 2px solid #43e97b;
}

.secondary:hover {
    background: #e0f7fa;
    transform: translateY(-2px);
}
</style>
