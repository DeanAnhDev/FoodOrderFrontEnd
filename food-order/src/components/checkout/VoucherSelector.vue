<template>
    <div class="voucher-selector">
        <label>Voucher</label>
        <div class="selected" @click="open = true">
            <div v-if="currentSelected">
                <strong>{{ currentSelected.code }}</strong>
                — {{ currentSelected.description || currentSelected.name || '' }}
                <template v-if="hasCap(currentSelected)">
                    — Tối đa: <strong>{{ formatPrice(maxDiscountCap(currentSelected)) }}</strong>
                </template>
            </div>
            <div v-else class="placeholder">Chọn voucher (nếu có)</div>
        </div>

        <transition name="fade">
            <div v-if="open" class="modal-backdrop" @click.self="open = false">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Chọn voucher</h3>
                        <button class="icon-close" @click="open = false" aria-label="Đóng">×</button>
                    </div>

                    <div class="modal-body">
                        <div v-if="voucherStore.loading" class="loading">Đang tải voucher...</div>
                        <div v-else-if="voucherStore.error" class="error">{{ voucherStore.error }}</div>
                        <ul v-else>
                            <li v-if="allVouchers.length === 0" class="voucher-item">
                                <div class="info">Không có voucher khả dụng.</div>
                            </li>
                            <li v-for="v in allVouchers" :key="v.id || v.voucherId" class="voucher-item"
                                :class="{ ineligible: !v.eligible, selected: isSelected(v) }">
                                <div class="info">
                                    <div class="line-1">
                                        <span class="code">{{ v.code }}</span>
                                        <span class="badge" :class="displayType(v).toLowerCase()">{{ displayType(v)
                                            }}</span>
                                    </div>
                                    <div class="desc">{{ v.description || v.name }}</div>
                                    <div class="meta">
                                        <span>Giảm: <strong>{{ discountLabel(v) }}</strong></span>
                                        <span v-if="minOrderAmount(v) > 0" class="sep">•</span>
                                        <span v-if="minOrderAmount(v) > 0">Đơn tối thiểu: <strong>{{
                                            formatPrice(minOrderAmount(v)) }}</strong></span>
                                        <span v-if="hasCap(v)" class="sep">•</span>
                                        <span v-if="hasCap(v)">Tối đa: <strong>{{ formatPrice(maxDiscountCap(v))
                                                }}</strong></span>
                                    </div>
                                    <div class="hint">
                                        <template v-if="v.eligible">
                                            Tiết kiệm: <strong class="save">{{ formatPrice(discountAmount(v))
                                                }}</strong>
                                            <span class="sep">•</span>
                                            Sau giảm: <strong>{{ formatPrice(finalPriceAfter(v)) }}</strong>
                                        </template>
                                        <template v-else>
                                            <span v-if="!isWithinDate(v)">Ngoài thời gian áp dụng</span>
                                            <span v-else-if="minOrderAmount(v) > 0">Thiếu:
                                                <strong class="lack">{{ formatPrice(shortfall(v)) }}</strong> để đạt đơn
                                                tối
                                                thiểu</span>
                                            <span v-else>Không đủ điều kiện</span>
                                        </template>
                                    </div>
                                </div>
                                <button :disabled="!v.eligible" @click="select(v)" :class="{ ghost: !v.eligible }">
                                    {{ isSelected(v) ? 'Đã chọn' : (v.eligible ? 'Áp dụng' : 'Chưa đủ điều kiện') }}
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-close cursor-pointer" @click="open = false">Đóng</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, defineExpose } from 'vue'
import { formattedPrice } from '@/utils/formart'
import { useVoucherStore } from '@/stores/voucherStore'
import { useCartStore } from '@/stores/cartStore'

const props = defineProps({
    selectedVoucher: { type: Object, default: null },
    // Cho phép điều khiển mở/đóng từ bên ngoài qua v-model:open
    open: { type: Boolean, default: undefined }
})
const emits = defineEmits(['update:selectedVoucher', 'update:open'])

// local state cho popup; nếu prop.open được truyền, đồng bộ hai chiều
const open = ref(props.open ?? false)
watch(() => props.open, (val) => {
    if (val === undefined) return
    open.value = !!val
})
watch(open, (val) => emits('update:open', val))
const currentSelected = ref(props.selectedVoucher)
watch(() => props.selectedVoucher, (v) => (currentSelected.value = v))

const voucherStore = useVoucherStore()
const cartStore = useCartStore()

// Tính tổng sau khuyến mãi của giỏ (để so minOrderAmount)
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
const cartTotal = computed(() =>
    (cartStore.items || []).reduce((sum, item) => sum + getDiscountedUnitPrice(item) * item.quantity, 0)
)

const now = () => new Date()
const normalizeType = (v) => {
    const t = v?.type
    if (t === 'Amount' || t === 'Percentage' || t === 'Percent') return t === 'Percent' ? 'Percentage' : t
    if (typeof t === 'number') return t === 1 ? 'Percentage' : 'Amount' // 0: Amount, 1: Percentage (giả định)
    return 'Amount'
}
const isWithinDate = (v) => {
    const s = v.startDate ? new Date(v.startDate) : null
    const e = v.endDate ? new Date(v.endDate) : null
    const t = now()
    if (s && t < s) return false
    if (e && t > e) return false
    return true
}
const meetsMinOrder = (v) => {
    const min = Number(v.minOrderAmount || v.minOrderPrice || v.minimumOrder || 0)
    return cartTotal.value >= min
}
const isActive = (v) => (v.isActive === undefined ? true : !!v.isActive) && !v.isOutOfStock

const eligibleAndIneligible = computed(() => {
    return (voucherStore.vouchers || []).map((v) => ({
        ...v,
        eligible: isActive(v) && isWithinDate(v) && meetsMinOrder(v),
    }))
})
const eligibleVouchers = computed(() => eligibleAndIneligible.value.filter(v => v.eligible))
const allVouchers = computed(() => eligibleAndIneligible.value)

const displayType = (v) => (normalizeType(v) === 'Amount' ? 'Giảm tiền' : 'Giảm %')

const discountLabel = (v) => {
    const amount = Number(v.discountAmount || 0)
    if (normalizeType(v) === 'Amount') return formatPrice(amount)
    // Percentage
    return `${amount}%`
}
const minOrderAmount = (v) => Number(v.minOrderAmount || v.minOrderPrice || v.minimumOrder || 0)
const shortfall = (v) => Math.max(0, minOrderAmount(v) - cartTotal.value)
const maxDiscountCap = (v) => {
    const cap = Number(v.maxDiscountPrice || v.maxDiscount || 0)
    return cap > 0 ? cap : Infinity
}

// Có giới hạn giảm tối đa không?
const hasCap = (v) => Number.isFinite(maxDiscountCap(v))

const discountAmount = (v) => {
    if (!v) return 0
    const t = normalizeType(v)
    const amount = Number(v.discountAmount || 0)
    if (t === 'Amount') return Math.min(amount, cartTotal.value, maxDiscountCap(v))
    // Percentage
    const pctValue = Math.round((cartTotal.value * amount) / 100)
    return Math.min(pctValue, maxDiscountCap(v))
}
const finalPriceAfter = (v) => Math.max(0, cartTotal.value - discountAmount(v))
// ineligibleReason helper no longer used because we only show eligible vouchers
const formatPrice = formattedPrice

onMounted(async () => {
    // tải voucher đang hoạt động
    await voucherStore.fetchVouchers({ isActive: true, pageSize: 50 })
    // Đóng popup khi nhấn phím ESC
    window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
})

watch(open, async (val) => {
    if (val) {
        // làm mới khi mở
        await voucherStore.fetchVouchers({ isActive: true, pageSize: 50 })
    }
})

const select = (v) => {
    currentSelected.value = v
    emits('update:selectedVoucher', v)
    open.value = false
}

// expose method để parent có thể gọi trực tiếp
defineExpose({
    show: () => (open.value = true),
    hide: () => (open.value = false),
})

// helpers to identify selected voucher
const getId = (v) => v?.id ?? v?.voucherId
const isSelected = (v) => {
    const a = getId(currentSelected.value)
    const b = getId(v)
    return a != null && b != null && String(a) === String(b)
}

// Đóng popup bằng phím ESC
const onKeydown = (e) => {
    if (!open.value) return
    if (e.key === 'Escape' || e.key === 'Esc') {
        open.value = false
    }
}
</script>

<style scoped>
.voucher-selector label {
    display: block;
    margin-bottom: 8px;
    font-weight: 700
}

.selected {
    padding: 12px;
    border: 1px solid #eef2f7;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
}

.voucher-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #eef2f7;
    background: #fff;
    transition: all .15s ease-in-out;
}

.voucher-item+.voucher-item {
    margin-top: 8px
}

.voucher-item:hover {
    background: #fbfbfd;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
}

/* Backdrop cho bottom-sheet popup */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 23, 0.45);
    display: flex;
    align-items: center;
    /* căn giữa màn hình */
    justify-content: center;
    z-index: 60;
}

.modal {
    background: #fff;
    padding: 18px;
    border-radius: 16px;
    /* popup giữa màn hình bo tròn cả 4 góc */
    width: 640px;
    max-width: 96%;
    height: 60vh;
    /* 60% chiều dài màn hình */
    overflow-y: auto;
    /* cuộn nội dung nếu dài hơn */
    box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12);
    animation: zoomIn .18s ease-out;
}

.modal button {
    background: var(--primary, #ef4444);
    color: white;
    border: none;
    padding: 8px 10px;
    border-radius: 8px
}

/* additions */
.loading {
    color: #6b7280;
}

.error {
    color: #ef4444;
    font-weight: 600;
}

.voucher-item.ineligible {
    opacity: 0.7;
}

.voucher-item .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.voucher-item .line-1 {
    display: flex;
    align-items: center;
    gap: 8px;
}

.voucher-item .code {
    font-weight: 800;
    color: #0b1220;
}

.voucher-item .badge {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 999px;
    background: #f3f4f6;
    color: #374151;
}

.voucher-item .badge.percentage,
.voucher-item .badge.percent {
    background: #fee2e2;
    color: #991b1b;
}

.voucher-item .badge.amount {
    background: #dcfce7;
    color: #166534;
}

.voucher-item .desc {
    color: #6b7280;
    font-size: 13px;
}

.voucher-item .meta {
    color: #374151;
    font-size: 13px;
}

.voucher-item .hint {
    color: #374151;
    font-size: 13px;
}

.voucher-item .hint .save {
    color: #16a34a;
}

.voucher-item.selected {
    border-color: #ef4444;
    background: #fff5f5;
}

.voucher-item button[disabled] {
    background: #e5e7eb;
    color: #6b7280;
    cursor: not-allowed;
}

.voucher-item button {
    padding: 8px 14px;
    border-radius: 999px;
}

.voucher-item button.ghost {
    background: #f3f4f6;
    color: #6b7280;
}

.btn-close {
    margin-top: 10px;
    background: #fff;
    color: #111827;
    border: 1px solid #e5e7eb;
    padding: 10px 14px;
    border-radius: 10px;
    width: 100%;
    font-weight: 600;
    transition: all .15s ease-in-out;
}


.btn-close:active {
    transform: scale(0.98);
}

.modal-header {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eef2f7;
}

.modal-header h3 {
    margin: 0;
}

.icon-close {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    background: #f9fafb;
    color: #0b1220;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    font-size: 18px;
    line-height: 1;
    padding: 0;
    transition: all .15s ease-in-out;
    cursor: pointer;
}

.icon-close:hover {
    background: #fee2e2;
    color: #991b1b;
    border-color: #fecaca;
    transform: scale(1.05);
}

.icon-close:active {
    transform: scale(0.98);
}

.icon-close:focus-visible {
    outline: 2px solid #ef4444;
    outline-offset: 2px;
}

.modal-body {
    padding-top: 8px;
}

.modal-footer {
    position: sticky;
    bottom: 0;
    background: #fff;
    padding-top: 8px;
    padding-bottom: 4px;
    border-top: 1px solid #eef2f7;
}

/* simple fade for backdrop */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: translateY(6px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>