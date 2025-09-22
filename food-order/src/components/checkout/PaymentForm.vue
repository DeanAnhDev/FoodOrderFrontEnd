<template>
    <form class="payment-form" @submit.prevent="onSubmit">

        <!-- order preview removed: OrderSummary on the right shows full breakdown -->

        <div class="actions">
            <button type="submit"
                class="cursor-pointer w-full bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-101 hover:shadow-xl transition-all duration-200">
                <span class="inline-flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17 9V7a5 5 0 00-10 0v2M5 9h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9z" />
                    </svg>
                    Xác nhận và thanh toán
                </span>
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ initialPaymentMethod: { type: Object, default: null } })
const emits = defineEmits(['submit'])

const selected = ref(null)
const mode = ref('cod')

const card = ref({ number: '', name: '' })

watch(() => props.initialPaymentMethod, (v) => {
    selected.value = v
    mode.value = v?.id || 'cod'
})

const onSubmit = () => {
    const payload = {
        method: selected.value?.id || mode.value || 'cod',
        card: mode.value === 'card' ? card.value : null
    }
    emits('submit', payload)
}
</script>

<style scoped>
.payment-form {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.method-preview {
    background: #fbfbfd;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #eef2f7
}

.card-fields label {
    font-weight: 600;
    font-size: 13px
}

.card-fields input {
    padding: 10px;
    border: 1px solid #eef2f7;
    border-radius: 8px
}

.actions {
    margin-top: 8px
}
</style>
