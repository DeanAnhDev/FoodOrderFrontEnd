<template>
    <div class="checkout-failed">
        <div class="failed-card">
            <div class="icon-wrapper">
                <svg class="failed-icon" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#f44336" />
                    <path d="M22 22l20 20M42 22L22 42" stroke="#fff" stroke-width="4" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <h2>Thanh toán thất bại</h2>
            <p class="desc">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
            <div class="actions">
                <button class="primary" @click="goHome">Tiếp tục mua sắm</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CheckoutFailed',
    methods: {
        goHome() {
            this.$router.push('/menu');
        }
    }
}
</script>

<style scoped>
.checkout-failed {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ffeef0 0%, #fff8e1 100%);
}

.failed-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(244, 67, 54, 0.12);
    padding: 40px 32px;
    max-width: 420px;
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

.failed-icon {
    width: 64px;
    height: 64px;
    display: inline-block;
}

h2 {
    color: #c62828;
    font-size: 2rem;
    margin-bottom: 10px;
}

.desc {
    color: #666;
    font-size: 1.05rem;
    margin-bottom: 28px;
}

.actions {
    display: flex;
    justify-content: center;
}

button.primary {
    padding: 12px 28px;
    font-size: 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    background: linear-gradient(90deg, #f44336 0%, #ff7043 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.08);
    transition: background 0.2s, transform 0.2s;
}

button.primary:hover {
    background: linear-gradient(90deg, #c62828 0%, #f44336 100%);
    transform: translateY(-2px);
}
</style>
