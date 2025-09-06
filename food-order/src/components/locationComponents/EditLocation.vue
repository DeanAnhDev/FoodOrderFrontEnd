<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
            <!-- Header -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">{{ title }}</h2>
                <button @click="handleClose" class="text-gray-500 hover:text-gray-700">✖</button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Tìm kiếm -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input v-model="search" type="text"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-200"
                        placeholder="Nhập địa chỉ..." @input="fetchSuggestions" />

                    <!-- Gợi ý -->
                    <ul v-if="suggestions.length > 0"
                        class="mt-1 border rounded-lg bg-white shadow max-h-40 overflow-y-auto">
                        <li v-for="s in suggestions" :key="s.place_id"
                            class="px-3 py-2 cursor-pointer hover:bg-gray-100" @click="selectSuggestion(s)">
                            {{ s.description }}
                        </li>
                    </ul>
                </div>

                <!-- Map -->
                <div id="map-edit" class="h-80 w-full rounded-lg overflow-hidden"></div>

                <!-- Checkbox -->
                <div class="flex items-center gap-2">
                    <input type="checkbox" v-model="form.isDefault" id="isDefault"
                        class="h-4 w-4 text-red-600 border-gray-300 rounded" />
                    <label for="isDefault" class="text-sm text-gray-700">Đặt làm mặc định</label>
                </div>

                <!-- Nút -->
                <div class="flex justify-end gap-3">
                    <button type="button" @click="handleClose"
                        class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">
                        Hủy
                    </button>
                    <button type="submit" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue"
import { suggestAddress, getPlaceDetail, checkLocation } from "@/services/goongService"
import { GOONG_API_MAP_KEY } from "@/config"
import { useToast } from "vue-toastification"

const props = defineProps({
    visible: Boolean,
    title: String,
    data: { type: Object, default: () => ({ address: "", lat: null, lng: null, isDefault: false }) },
})

const emit = defineEmits(["save", "close"])

const form = ref({})
const search = ref("")
const suggestions = ref([])

let map = null
let marker = null

const toast = useToast()

watch(
    () => props.visible,
    async (val) => {
        if (val) {
            form.value = { ...props.data }
            search.value = props.data.address || ""

            await nextTick()
            window.goongjs.accessToken = GOONG_API_MAP_KEY

            // Xóa map cũ nếu tồn tại
            if (map) {
                map.remove()
                map = null
                marker = null
            }

            // Khởi tạo map
            const centerLng = form.value.lng || 105.83416
            const centerLat = form.value.lat || 21.027764

            map = new window.goongjs.Map({
                container: "map-edit",
                style: "https://tiles.goong.io/assets/goong_map_web.json",
                center: [centerLng, centerLat],
                zoom: form.value.lat && form.value.lng ? 16 : 12,
            })

            map.addControl(new window.goongjs.NavigationControl())

            // Marker
            marker = new window.goongjs.Marker({ draggable: true })
                .setLngLat([centerLng, centerLat])
                .addTo(map)

            marker.on("dragend", () => {
                const lngLat = marker.getLngLat()
                form.value.lat = lngLat.lat
                form.value.lng = lngLat.lng
            })
        }
    }
)

const fetchSuggestions = async () => {
    if (search.value.length < 3) {
        suggestions.value = []
        return
    }
    try {
        const res = await suggestAddress(search.value)
        suggestions.value = res.data.predictions || []
    } catch (e) {
        console.error("Error fetchSuggestions:", e)
    }
}

const selectSuggestion = async (s) => {
    search.value = s.description
    form.value.address = s.description
    suggestions.value = []

    try {
        const detail = await getPlaceDetail(s.place_id)
        const data = detail.data.result
        form.value.lat = data.geometry.location.lat
        form.value.lng = data.geometry.location.lng

        if (map && marker) {
            map.flyTo({ center: [form.value.lng, form.value.lat], zoom: 16 })
            marker.setLngLat([form.value.lng, form.value.lat])
        }
    } catch (e) {
        console.error("Error getPlaceDetail:", e)
    }
}

const handleSubmit = async () => {
    try {
        if (!form.value.lat || !form.value.lng) {
            toast.warning("Vui lòng chọn một địa chỉ hợp lệ.")
            return
        }

        const { data } = await checkLocation({
            lat: String(form.value.lat),
            lng: String(form.value.lng),
        })

        if (data.isInInnerCity) {
            toast.success(data.message || "Cập nhật địa chỉ thành công.")
            emit("save", {
                ...form.value,
                latitude: form.value.lat,
                longitude: form.value.lng,
            })
        } else {
            toast.error(data.message || "Địa chỉ này không nằm trong nội thành Hà Nội.")
        }
    } catch (err) {
        console.error("Error handleSubmit:", err)
        toast.error(err.response?.data?.message || "Lỗi khi kiểm tra địa chỉ")
    }
}

const handleClose = () => {
    if (map) {
        map.remove()
        map = null
        marker = null
    }
    emit("close")
}
</script>
