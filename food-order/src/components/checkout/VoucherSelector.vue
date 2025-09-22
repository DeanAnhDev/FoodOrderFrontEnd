<template>
    <div class="voucher-selector">
        <label>Voucher</label>
        <div class="selected" @click="open = true">
            <div v-if="selectedVoucher">{{ selectedVoucher.code }} — {{ selectedVoucher.description }}</div>
            <div v-else class="placeholder">Chọn voucher (nếu có)</div>
        </div>

        <div v-if="open" class="modal-backdrop" @click.self="open = false">
            <div class="modal">
                <h3>Chọn voucher</h3>
                <ul>
                    <li v-for="v in vouchers" :key="v.id" class="voucher-item">
                        <div>{{ v.code }} — {{ v.description }}</div>
                        <button @click="select(v)">Áp dụng</button>
                    </li>
                </ul>
                <button @click="open = false">Đóng</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// TODO: import voucherService to fetch actual vouchers

const emits = defineEmits(['update:selectedVoucher'])
const open = ref(false)
const vouchers = ref([])
const selectedVoucher = ref(null)

onMounted(async () => {
    // TODO: fetch from API
    vouchers.value = [
        { id: 1, code: 'DISC10', description: 'Giảm 10%' },
        { id: 2, code: 'FREESHIP', description: 'Miễn phí giao hàng' }
    ]
})

const select = (v) => {
    selectedVoucher.value = v
    emits('update:selectedVoucher', v)
    open.value = false
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
    align-items: center
}

.voucher-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: 8px
}

.voucher-item+.voucher-item {
    margin-top: 8px
}

.voucher-item:hover {
    background: #fbfbfd;
}

.modal {
    background: #fff;
    padding: 18px;
    border-radius: 12px;
    width: 480px;
    max-width: 94%;
    box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12)
}

.modal button {
    background: var(--primary, #ef4444);
    color: white;
    border: none;
    padding: 8px 10px;
    border-radius: 8px
}
</style>