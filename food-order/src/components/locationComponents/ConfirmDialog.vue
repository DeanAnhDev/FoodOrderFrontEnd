<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <!-- Tiêu đề -->
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
                {{ title }}
            </h2>
            <!-- Nội dung -->
            <p class="text-gray-600 mb-6">
                {{ message }}
            </p>
            <!-- Nút -->
            <div class="flex justify-end gap-3">
                <button class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition" @click="$emit('cancel')">
                    Huỷ
                </button>
                <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    @click="$emit('confirm')">
                    Đồng ý
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    visible: Boolean,
    title: {
        type: String,
        default: "Xác nhận",
    },
    message: {
        type: String,
        default: "Bạn có chắc chắn?",
    },
})
defineEmits(["confirm", "cancel"])
</script>
