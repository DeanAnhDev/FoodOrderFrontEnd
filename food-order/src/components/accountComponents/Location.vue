<template>
  <div class="p-6 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold flex items-center gap-2 text-gray-800">
        <MapPin class="w-6 h-6 text-red-600" />
        Địa chỉ của tôi
      </h2>
      <button @click="openAddModal"
        class="px-4 py-2 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition flex items-center gap-2 cursor-pointer">
        <Plus class="w-4 h-4" /> Thêm địa chỉ
      </button>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="text-center text-gray-500">
      Đang tải...
    </div>

    <!-- Nếu chưa có địa chỉ -->
    <div v-else-if="store.locations.length === 0"
      class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50">
      <MapPin class="w-12 h-12 text-gray-400 mb-3" />
      <p class="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
    </div>

    <!-- Nếu có địa chỉ -->
    <div v-else>
      <!-- Scrollable list wrapper: giới hạn chiều cao để sidebar không bị kéo quá dài -->
      <div class="space-y-4 max-h-[60vh] md:max-h-[50vh] overflow-y-auto pr-2">
        <div v-for="addr in store.locations" :key="addr.id"
          class="bg-white border border-gray-200 rounded-2xl shadow p-5 hover:shadow-lg transition">
          <div class="mb-3">
            <div class="flex items-center gap-2 text-gray-800 font-medium">
              <MapPin class="w-5 h-5 text-red-600" />
              {{ addr.address }}
            </div>
            <span v-if="addr.isDefault"
              class="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
              <CheckCircle class="w-4 h-4" /> Địa chỉ mặc định
            </span>
          </div>

          <div class="flex gap-3">
            <button
              class="flex items-center gap-1 px-3 py-1 bg-black hover:bg-gray-800 rounded-lg text-white text-sm cursor-pointer"
              @click="openEditModal(addr)">
              <Edit class="w-4 h-4" /> Sửa
            </button>
            <button
              class="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 text-sm cursor-pointer"
              @click="deleteAddress(addr.id)">
              <Trash class="w-4 h-4" /> Xoá
            </button>
            <button v-if="!addr.isDefault"
              class="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 text-sm cursor-pointer"
              @click="setDefault(addr.id)">
              <Star class="w-4 h-4" /> Đặt mặc định
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Add -->
    <AddLocationPopup :visible="showAddModal" title="Thêm địa chỉ mới" :data="selected" @close="closeAddModal"
      @save="handleSave" />

    <!-- Modal Edit -->
    <EditLocationPopup :visible="showEditModal" title="Sửa địa chỉ" :data="selected" @close="closeEditModal"
      @save="handleSave" />
    <ConfirmDialog :visible="showConfirm" title="Xoá địa chỉ" message="Bạn có chắc muốn xoá địa chỉ này không?"
      @cancel="showConfirm = false" @confirm="confirmDelete" />

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useLocationStore } from "@/stores/locationStore"
import AddLocationPopup from "@/components/locationComponents/AddLocation.vue"
import EditLocationPopup from "@/components/locationComponents/EditLocation.vue"
import ConfirmDialog from "@/components/locationComponents/ConfirmDialog.vue"
import { MapPin, Edit, Trash, Star, CheckCircle, Plus } from "lucide-vue-next"
import { useToast } from "vue-toastification"

const toast = useToast()
const store = useLocationStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const selected = ref(null)

// Load data khi mở trang
onMounted(() => {
  store.fetchLocationsByUser()
})

const openAddModal = () => {
  selected.value = { address: "", isDefault: false }
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  selected.value = null
}

const openEditModal = (addr) => {
  selected.value = { ...addr }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selected.value = null
}

/**
 * Khi modal emit('save', formValue) sẽ tới đây.
 * Map form.lat/form.lng -> latitude/longitude, ép kiểu number.
 */
const handleSave = async (data) => {
  try {
    // Chuẩn hoá payload gửi lên API
    const payload = {
      ...data,
      latitude: parseFloat(data.lat ?? data.latitude),
      longitude: parseFloat(data.lng ?? data.longitude),
      address: (data.address || "").trim(),
      shortAddress: data.shortAddress ?? "",
      remarks: data.remarks ?? null,
      isDefault: !!data.isDefault,
    }

    if (Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude)) {
      toast.error("Tọa độ không hợp lệ. Vui lòng chọn vị trí trên bản đồ.")
      return
    }

    if (selected.value?.id) {
      // update
      await store.updateLocation({ ...payload, id: selected.value.id })
      // toast.success("Cập nhật địa chỉ thành công.")
    } else {
      // create
      await store.createLocation(payload)
      // toast.success("Thêm địa chỉ thành công.")
    }

    closeAddModal()
    closeEditModal()
  } catch (err) {
    // store.error nếu store set, hoặc fallback err message
    const message = store.error || err.response?.data?.message || err.message || "Có lỗi xảy ra"
    toast.error(message)
    console.error("handleSave error:", err)
  }
}

const showConfirm = ref(false)
const deleteId = ref(null)

const deleteAddress = (id) => {
  deleteId.value = id
  showConfirm.value = true
}

const confirmDelete = async () => {
  showConfirm.value = false
  try {
    await store.deleteLocation(deleteId.value)
    toast.success("Xoá địa chỉ thành công.")
  } catch (err) {
    const message = store.error || err.response?.data?.message || "Không thể xoá địa chỉ"
    toast.error(message)
    console.error("deleteAddress error:", err)
  }
}

/**
 * Đặt mặc định: gọi action setDefaultLocation(id) trong store.
 * Store phải implement setDefaultLocation (gọi API PATCH và fetch lại list).
 */
const setDefault = async (id) => {
  try {
    const msg = await store.setDefaultLocation(id)
    // nếu store trả msg thì show, nếu không thì dùng default
    toast.success(msg || "Đã đặt làm địa chỉ mặc định.")
  } catch (err) {
    const message = store.error || err.response?.data?.message || "Không thể đặt mặc định"
    toast.error(message)
    console.error("setDefault error:", err)
  }
}
</script>
