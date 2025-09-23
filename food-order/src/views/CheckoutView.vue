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
                <label class=" font-semibold">Ghi chú đơn hàng</label>
                <textarea v-model="orderNote" rows="3" maxlength="200"
                    class="w-full bg-white p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    placeholder="Ví dụ: Thêm khăn giấy, thêm đũa..."></textarea>
                <div class="text-xs text-gray-500 mt-1">Tối đa 200 ký tự</div>
            </section>


            <section class="card-section">
                <PaymentMethodSelector v-model:selectedPaymentMethod="selectedPaymentMethod" />
            </section>

            <div class="place-order">
                <PaymentForm @submit="handlePayment" :initialPaymentMethod="selectedPaymentMethod"
                    :disabled="!canPlaceOrder || orderStore.loading" />
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
            <OrderSummary :items="cartItems" :total="finalTotal" :voucher="selectedVoucher" :shippingFee="shippingFee"
                :shippingFormatted="shippingStore.formattedFee" />
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useShippingStore } from '@/stores/shippingStore'
import { useUserStore } from '@/stores/userStore'
import { useLocationStore } from '@/stores/locationStore'
import { useToast } from 'vue-toastification'
import AddressSelector from '@/components/checkout/AddressSelector.vue'
import VoucherSelector from '@/components/checkout/VoucherSelector.vue'
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector.vue'
import PaymentForm from '@/components/checkout/PaymentForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import { useOrderStore } from '@/stores/orderStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const router = useRouter()

const cartItems = computed(() => cartStore.items)

// --- promotion helpers (updated to use API data) ---
const getPrice = (item) => item.originalPrice || 0

const getPromotionAmountPerUnit = (item) => {
    if (!item.discountAmount) return 0
    return item.discountAmount / item.quantity
}

const getDiscountedUnitPrice = (item) => {
    return item.finalPrice || item.originalPrice || 0
}

const finalTotal = computed(() =>
    cartItems.value.reduce((sum, item) => {
        return sum + (item.finalTotal || 0)
    }, 0)
)
// ---------------------------------------------------

const selectedAddress = ref(null)
const selectedVoucher = ref(null)
const orderNote = ref('')
const selectedPaymentMethod = ref(null)
const canPlaceOrder = computed(() => !!selectedAddress.value && !!selectedPaymentMethod.value)

const shippingStore = useShippingStore()
const userStore = useUserStore()
const shippingFee = ref(0)
const locationStore = useLocationStore()

// keep local selectedAddress in sync if AddressSelector writes into the location store
watch(() => locationStore.selectedLocation, (loc) => {
    if (loc) selectedAddress.value = loc
})

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

const toast = useToast()

const mapPaymentMethod = (idOrName) => {
    if (idOrName === 0 || idOrName === 1) return idOrName
    if (!idOrName) return null
    const v = String(idOrName).toLowerCase()
    // Backend expects numeric enum: 0 = CashOnDelivery, 1 = BankTransfer
    if (v === '0' || v === 'cod' || v === 'cashondelivery') return 0
    if (v === '1' || v === 'vnpay' || v === 'banktransfer' || v === 'vn-pay') return 1
    // Default to COD (0) if unknown to avoid binding errors
    return 0
}

const handlePayment = async (paymentDetails) => {
    if (!selectedAddress.value) {
        toast.error('Vui lòng chọn địa chỉ giao hàng')
        return
    }
    if (!selectedPaymentMethod.value && !paymentDetails?.method) {
        toast.error('Vui lòng chọn phương thức thanh toán')
        return
    }
    // ensure CartId available
    if (!cartStore.cartId) {
        try { await cartStore.fetchCart() } catch { }
    }

    // Build CreateOrderDto per backend contract
    const dto = {
        CartId: cartStore.cartId,
        PaymentMethod: mapPaymentMethod(selectedPaymentMethod.value?.id || paymentDetails.method),
        Note: orderNote.value?.trim() || null,
        LocationId: selectedAddress.value?.id || selectedAddress.value?.locationId || null,
        VoucherId: selectedVoucher.value?.id || selectedVoucher.value?.voucherId || null,
        Reason: '',
    }

    try {
        const res = await orderStore.submitOrder(dto)
        if (res?.success) {
            if (res.paymentUrl) {
                window.location.href = res.paymentUrl
            } else {
                router.push({ name: 'CheckoutSuccess' })
            }
        } else {
            router.push({ name: 'CheckoutFailed' })
        }
    } catch (err) {
        toast.error(orderStore.error || 'Tạo đơn hàng thất bại')
        router.push({ name: 'CheckoutFailed' })
    }
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

/* ensure the right panel height only fits its content (no grid stretch) */
.right-panel {
    align-self: start;
    height: auto;
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