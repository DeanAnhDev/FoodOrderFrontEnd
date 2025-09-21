<template>
    <div class="checkout-container">
        <h1 class="checkout-title">Checkout</h1>
        <OrderSummary :items="cartItems" :total="finalTotal" />
        <PaymentForm @submit="handlePayment" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import PaymentForm from '@/components/checkout/PaymentForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'

const cartStore = useCartStore()

const cartItems = computed(() => cartStore.items)

const finalTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => {
        const unitPrice = item.food?.price || item.combo?.price || 0
        const discount = item.food?.promotion?.isActive ? item.food.promotion.discountAmount : 0
        const discountedPrice = Math.max(0, unitPrice - discount)
        return sum + discountedPrice * item.quantity
    }, 0)
})

const handlePayment = (paymentDetails) => {
    // Logic to handle payment submission
    console.log('Payment details submitted:', paymentDetails)
}
</script>

<style scoped>
.checkout-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.checkout-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}
</style>