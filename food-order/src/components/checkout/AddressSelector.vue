<template>
    <div class="address-selector">
        <label>Địa chỉ giao hàng</label>
        <div class="selected" @click="open = true">
            <div v-if="currentSelected">{{ currentSelected.address }}</div>
            <div v-else class="placeholder">Chọn địa chỉ giao hàng</div>
        </div>

        <div v-if="open" class="modal-backdrop" @click.self="open = false">
            <div class="modal">
                <h3>Chọn địa chỉ</h3>

                <div v-if="loading">Đang tải địa chỉ...</div>
                <div v-else-if="error" class="text-error">{{ error }}</div>
                <div v-else>
                    <div v-if="addresses.length === 0">Không có địa chỉ. Thêm mới trong profile.</div>
                    <ul class="addr-list">
                        <li v-for="a in addresses" :key="a.id"
                            :class="['addr-item', { 'active': currentSelected && currentSelected.id === a.id }]">
                            <div>
                                <div class="name">{{ a.isDefault ? a.address + ' (Mặc định)' : a.address }}</div>
                            </div>
                            <div>
                                <button v-if="currentSelected && currentSelected.id === a.id" disabled
                                    class="btn-selected">Đã chọn</button>
                                <button v-else @click="select(a)">Chọn</button>
                            </div>
                        </li>
                    </ul>
                </div>

                <button class="btn-close" @click="open = false">Đóng</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useLocationStore } from '@/stores/locationStore'

const props = defineProps({
    selectedAddress: { type: Object, default: null }
})
const emits = defineEmits(['update:selectedAddress'])

const open = ref(false)
const currentSelected = ref(props.selectedAddress || null)

const locationStore = useLocationStore()
const addresses = locationStore.locations
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
    loading.value = true
    error.value = null
    try {
        await locationStore.fetchLocationsByUser()
        // auto select default if present
        // if app already has a selectedLocation in the store (e.g., persisted during session), use it
        if (locationStore.selectedLocation) {
            currentSelected.value = locationStore.selectedLocation
            emits('update:selectedAddress', locationStore.selectedLocation)
        } else {
            const def = locationStore.locations.find((l) => l.isDefault)
            if (def) {
                currentSelected.value = def
                emits('update:selectedAddress', def)
            }
        }
    } catch (e) {
        error.value = locationStore.error || 'Không thể tải địa chỉ'
    } finally {
        loading.value = false
    }
})

// whenever the modal opens, refresh the address list from API
watch(open, async (v) => {
    if (v) {
        loading.value = true
        error.value = null
        try {
            await locationStore.fetchLocationsByUser()
            // optionally keep currentSelected if already set, otherwise pick default
            if (!currentSelected.value && locationStore.locations.length) {
                const def = locationStore.locations.find((l) => l.isDefault) || locationStore.locations[0]
                currentSelected.value = def
                emits('update:selectedAddress', def)
            }
        } catch (e) {
            error.value = locationStore.error || 'Không thể tải địa chỉ'
        } finally {
            loading.value = false
        }
    }
})

// sync when addresses load
watch(addresses, (val) => {
    if (!currentSelected.value && val && val.length) {
        const def = val.find((l) => l.isDefault) || val[0]
        currentSelected.value = def
        emits('update:selectedAddress', def)
    }
})

// sync from parent v-model changes
watch(() => props.selectedAddress, (val) => {
    currentSelected.value = val
})

const select = (a) => {
    currentSelected.value = a
    emits('update:selectedAddress', a)
    // persist selection in location store for session-wide access
    locationStore.selectedLocation = a
    open.value = false
}
</script>

<style scoped>
.address-selector {
    margin-bottom: 16px;
}

.address-selector label {
    display: block;
    margin-bottom: 8px;
    font-weight: 700
}

.selected {
    padding: 12px;
    border: 1px solid #eef2f7;
    border-radius: 10px;
    cursor: pointer;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center
}

.placeholder {
    color: #6b7280;
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
    width: 480px;
    max-width: 94%;
    box-shadow: 0 18px 40px rgba(2, 6, 23, 0.16)
}

.addr-list {
    margin-top: 8px;
    max-height: 340px;
    overflow: auto;
}

.addr-item {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    border-radius: 8px;
    align-items: center;
    gap: 12px
}

.addr-item+.addr-item {
    margin-top: 8px
}

.addr-item .name {
    font-weight: 700
}

.addr-item .addr {
    color: #6b7280;
    font-size: 13px
}

.addr-item.active {
    background: #fff7f6;
    border: 1px solid rgba(239, 68, 68, 0.08);
}

.btn-selected {
    background: #eef2f3;
    color: #0b1220;
    border-radius: 8px;
    padding: 8px 10px;
}

.modal button {
    background: var(--primary, #ef4444);
    color: white;
    border: none;
    padding: 8px 10px;
    border-radius: 8px
}

.btn-close {
    margin-top: 12px;
    background: #f3f4f6;
    color: #0b1220;
    padding: 8px 10px;
    border-radius: 8px
}
</style>