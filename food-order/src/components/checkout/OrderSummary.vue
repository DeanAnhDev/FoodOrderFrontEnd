<template>
    <div class="order-summary">
        <div class="summary-list">
            <div v-for="item in items" :key="item.cartItemId" class="summary-item">
                <div class="left" style="display:flex; gap:10px; align-items:center">
                    <img :src="getImage(item)" alt="img" class="thumb" />
                    <div>
                        <div class="name">{{ getName(item) }}</div>
                        <div class="meta">x{{ item.quantity }}</div>
                    </div>
                </div>
                <div class="right">
                    <div class="price">{{ formatPrice(getDiscountedUnitPrice(item) * item.quantity) }}</div>
                </div>
            </div>
        </div>

        <hr />

        <div class="price-lines">
            <div class="line"><span>Tạm tính</span><span>{{ formatPrice(props.total) }}</span></div>
            <div v-if="voucherDiscount > 0" class="line"><span>Voucher</span><span class="discount">-{{
                formatPrice(voucherDiscount) }}</span></div>
            <div class="line"><span>Phí giao hàng</span><span>{{ shippingDisplay }}</span></div>
            <div class="flex justify-between items-center font-semibold text-lg mt-2 text-gray-900">
                <span>Thành tiền</span>
                <span class="text-red-500 text-xl font-semibold">{{ formatPrice(grandTotal) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { formattedPrice } from '@/utils/formart'

const props = defineProps({
    items: { type: Array, default: () => [] },
    total: { type: Number, default: 0 },
    voucher: { type: Object, default: null },
    shippingFee: { type: Number, default: 0 },
    shippingFormatted: { type: String, default: '' }
})

// UI helpers
const computedShippingFee = computed(() => (props.items.length > 0 ? Number(props.shippingFee || 0) : 0))
const shippingDisplay = computed(() => {
    if (!props.items.length) return '0'
    if (props.shippingFormatted) return props.shippingFormatted
    return formatPrice(computedShippingFee.value)
})

// Subtotal based on discounted unit prices (after item promotions), ensures consistency across components
const discountedSubtotal = computed(() =>
    (props.items || []).reduce((sum, item) => sum + getDiscountedUnitPrice(item) * item.quantity, 0)
)

// Helpers for voucher logic
const normalizeType = (v) => {
    const t = v?.type
    if (t === 'Amount' || t === 'Percentage' || t === 'Percent') return t === 'Percent' ? 'Percentage' : t
    if (typeof t === 'number') return t === 1 ? 'Percentage' : 'Amount' // assume 0=Amount, 1=Percentage
    return 'Amount'
}
const maxDiscountCap = (v) => {
    const cap = Number(v?.maxDiscountPrice || v?.maxDiscount || 0)
    return cap > 0 ? cap : Infinity
}
const minOrderAmount = (v) => Number(v?.minOrderAmount || v?.minOrderPrice || v?.minimumOrder || 0)
const now = () => new Date()
const isWithinDate = (v) => {
    const s = v?.startDate ? new Date(v.startDate) : null
    const e = v?.endDate ? new Date(v.endDate) : null
    const t = now()
    if (s && t < s) return false
    if (e && t > e) return false
    return true
}
const isActive = (v) => (v?.isActive === undefined ? true : !!v.isActive) && !v?.isOutOfStock

const voucherDiscount = computed(() => {
    const v = props.voucher
    if (!v) return 0

    // Eligibility checks
    if (!isActive(v)) return 0
    if (!isWithinDate(v)) return 0
    if (discountedSubtotal.value < minOrderAmount(v)) return 0

    // Calculate raw discount based on discounted subtotal
    const t = normalizeType(v)
    const amount = Number(v.discountAmount || 0)
    const base = discountedSubtotal.value
    let raw = 0
    if (t === 'Amount') {
        raw = Math.min(amount, base)
    } else { // Percentage
        raw = Math.round((base * amount) / 100)
    }
    const capped = Math.min(raw, maxDiscountCap(v), base)
    return Math.max(0, capped)
})

// Use discountedSubtotal to align with per-item price rendering, then apply voucher and add shipping
const grandTotal = computed(() => Math.max(0, discountedSubtotal.value - voucherDiscount.value + computedShippingFee.value))

const getImage = (item) => item.food?.images?.thumbnailUrl || item.combo?.images?.thumbnailUrl || '/placeholder.jpg'

const formatPrice = formattedPrice

const getName = (item) => item.food?.foodName || item.combo?.comboName || 'Không rõ'
const getPrice = (item) => item.food?.price || item.combo?.price || 0

const getPromotionAmountPerUnit = (item) => {
    const promo = item.food?.promotion || item.combo?.promotion
    if (!promo || !promo.isActive) return 0
    const base = getPrice(item)
    if (promo.type === 'Amount') return Math.min(promo.discountAmount || 0, base)
    if (promo.type === 'Percentage' || promo.type === 'Percent') return (base * (promo.discountAmount || 0)) / 100
    return 0
}

const getDiscountedUnitPrice = (item) => {
    const base = getPrice(item)
    const promo = getPromotionAmountPerUnit(item)
    return Math.max(0, base - promo)
}
</script>

<style scoped>
.order-summary {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0
}

.name {
    font-weight: 700;
    color: #0b1220
}

.meta {
    color: #6b7280;
    font-size: 13px
}

.price {
    font-weight: 700
}

.summary-total {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 800;
    margin-top: 8px
}

.total-price {
    color: var(--primary, #ef4444)
}

hr {
    border: none;
    height: 1px;
    background: #eef2f7;
    margin: 8px 0
}

.thumb {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 8px
}

.price-lines {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 6px
}

.price-lines .line {
    display: flex;
    justify-content: space-between;
    color: #6b7280
}

.price-lines .line.total {
    font-weight: 800;
    color: #0b1220
}

.price-lines .discount {
    color: #6b7280
}

.price-lines .grand {
    color: var(--primary, #ef4444);
    font-weight: 900
}

@media (max-width:480px) {
    .thumb {
        width: 40px;
        height: 40px
    }
}
</style>
