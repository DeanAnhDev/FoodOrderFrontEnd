<template>
    <div class="checkout-layout ">
        <div class="left-panel bg-white rounded-2xl shadow-2xl border-2 border-red-100 p-8 transition-all duration-300">

            <h2 class="font-bold ">Thông tin đặt hàng</h2>

            <section class="card-section">
                <AddressSelector v-model:selectedAddress="selectedAddress" />
            </section>

            <section class="card-section">
                <VoucherSelector v-model:selectedVoucher="selectedVoucher" />
            </section>

            <section class="card-section">
                <PaymentMethodSelector v-model:selectedPaymentMethod="selectedPaymentMethod" />
            </section>

            <div class="place-order">
                <PaymentForm @submit="handlePayment" :initialPaymentMethod="selectedPaymentMethod" />
            </div>
        </div>

        <div
            class="right-panel bg-white rounded-2xl shadow-2xl border-2 border-red-100 p-8 transition-all duration-300">
            <div class="flex items-center justify-between mb-4 border-b pb-2">
                <h2 class="text-xl font-semibold flex items-center gap-2">
                    Tóm tắt đơn hàng
                    <span
                        class="bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-bold rounded-full px-3 py-1 shadow">
                        {{ cartItems.length }} món
                    </span>
                </h2>
            </div>
            <OrderSummary :items="cartItems" :total="finalTotal" :voucher="selectedVoucher"
                :shippingFee="shippingFee" />
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useShippingStore } from '@/stores/shippingStore'
import { useUserStore } from '@/stores/userStore'
import AddressSelector from '@/components/checkout/AddressSelector.vue'
import VoucherSelector from '@/components/checkout/VoucherSelector.vue'
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector.vue'
import PaymentForm from '@/components/checkout/PaymentForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'

const cartStore = useCartStore()

const cartItems = computed(() => cartStore.items)

// --- promotion helpers (same logic as CartView) ---
const getPrice = (item) => item.food?.price || item.combo?.price || 0

const getPromotionAmountPerUnit = (item) => {
    const promo = item.food?.promotion || item.combo?.promotion
    if (!promo || !promo.isActive) return 0

    const base = getPrice(item)
    if (promo.type === 'Amount') {
        return Math.min(promo.discountAmount || 0, base)
    }
    if (promo.type === 'Percent') {
        const pct = promo.discountAmount || 0
        return (base * pct) / 100
    }
    return 0
}

const getDiscountedUnitPrice = (item) => {
    const base = getPrice(item)
    const promo = getPromotionAmountPerUnit(item)
    return Math.max(0, base - promo)
}

const finalTotal = computed(() =>
    cartItems.value.reduce((sum, item) => {
        const unit = getDiscountedUnitPrice(item)
        return sum + unit * item.quantity
    }, 0)
)
// ---------------------------------------------------

const selectedAddress = ref(null)
const selectedVoucher = ref(null)
const selectedPaymentMethod = ref(null)

const shippingStore = useShippingStore()
const userStore = useUserStore()
const shippingFee = ref(0)

// when address changes, estimate shipping fee
watch(selectedAddress, async (addr) => {
    if (!addr) {
        shippingFee.value = 0
        return
    }

    // ensure we have the current user data (name/phone) for shipping
    if (!userStore.user) {
        try {
            await userStore.fetchUser()
        } catch (e) {
            // continue with empty name/phone if fetch fails
            console.warn('Could not fetch user before shipping estimate', e)
        }
    }

    // build request payload expected by backend
    const payload = {
        toAddress: addr.address || '',
        toName: userStore.user?.fullName || '',
        toPhone: userStore.user?.phoneNumber || userStore.user?.phone || '',
        codAmount: 0,
        itemValue: Number(finalTotal.value) || 0,
        remarks: ''
    }

    try {
        const res = await shippingStore.getEstimateFee(payload)
        // res.data structure handled in store: fee is stored in shippingStore.fee
        shippingFee.value = shippingStore.fee || 0
    } catch (err) {
        // keep shippingFee as 0 on error; you may surface error to user later
        shippingFee.value = 0
        console.error('Failed to estimate shipping fee', err)
    }
})

const handlePayment = (paymentDetails) => {
    // prepare order payload
    const payload = {
        items: cartItems.value.map(i => ({ cartItemId: i.cartItemId, quantity: i.quantity })),
        addressId: selectedAddress.value?.id || null,
        voucherId: selectedVoucher.value?.id || null,
        paymentMethod: selectedPaymentMethod.value || paymentDetails.method,
        paymentDetails
    }

    console.log('Order payload:', payload)
    // TODO: call orderService.createOrder(payload) and handle response
}
</script>

<style scoped>
.checkout-layout {
    --primary: #ef4444;
    --muted: #6b7280;
    max-width: 1100px;
    margin: 28px auto;
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
}

.left-panel,
.right-panel {
    background: #fff;
    padding: 18px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(12, 17, 23, 0.06);
}

.left-panel h2,
.right-panel h2 {
    margin: 0 0 12px 0;
    font-size: 20px
}

.place-order {
    margin-top: 18px
}

@media (max-width: 1024px) {
    .checkout-layout {
        grid-template-columns: 1fr;
        padding: 12px
    }
}

/* shared small control styles used by selectors */
.selected {
    padding: 12px;
    border: 1px solid #eef2f7;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 23, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 60
}

.modal {
    background: #fff;
    padding: 18px;
    border-radius: 12px;
    width: 420px;
    max-width: 94%;
    box-shadow: 0 18px 40px rgba(2, 6, 23, 0.16)
}

.modal h3 {
    margin: 0 0 12px 0
}

.modal .addr-list,
.modal ul {
    max-height: 340px;
    overflow: auto;
    margin-top: 8px
}

.modal button {
    background: var(--primary);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 8px
}

.btn-close {
    margin-top: 12px;
    background: #f3f4f6;
    color: #0b1220
}

.checkout-steps {
    display: flex;
    gap: 10px;
    margin-bottom: 14px
}

.checkout-steps .step {
    padding: 8px 12px;
    border-radius: 999px;
    background: #fff;
    color: #6b7280;
    border: 1px solid #eef2f7;
    font-weight: 700
}

.checkout-steps .step.active {
    background: linear-gradient(90deg, var(--primary), #c53030);
    color: white;
    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.12)
}

.card-section {
    margin-bottom: 14px;
    padding: 12px;
    border-radius: 10px;
    background: #f8f7f5;
    border: 1px solid #eef2f7
}

.section-title {
    font-weight: 800;
    margin-bottom: 8px;
    color: #0b1220
}

.left-panel h2 {
    margin-top: 6px
}
</style>