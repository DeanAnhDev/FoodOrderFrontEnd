<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Tính phí giao hàng (Ahamove Estimate)</h2>

    <div class="space-y-4">
      <div>
        <label>Địa chỉ lấy hàng (From)</label>
        <input v-model="fromAddress" class="input" placeholder="VD: 7/28 Thành Thái, Q10" />
      </div>

      <div>
        <label>Người gửi</label>
        <input v-model="fromName" class="input" placeholder="Tên người gửi" />
        <input v-model="fromPhone" class="input mt-2" placeholder="Số điện thoại" />
      </div>

      <div>
        <label>Địa chỉ giao hàng (To)</label>
        <input v-model="toAddress" class="input" placeholder="VD: 475A Điện Biên Phủ, Bình Thạnh" />
      </div>

      <div>
        <label>Người nhận</label>
        <input v-model="toName" class="input" placeholder="Tên người nhận" />
        <input v-model="toPhone" class="input mt-2" placeholder="Số điện thoại" />
      </div>

      <div>
        <label>COD (nếu có)</label>
        <input v-model.number="codAmount" type="number" class="input" />
      </div>

      <div>
        <label>Giá trị hàng</label>
        <input v-model.number="itemValue" type="number" class="input" />
      </div>

      <button
        @click="estimateFee"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tính phí
      </button>

      <div v-if="fee !== null" class="mt-4 text-green-600">
        ✅ Phí dự tính: <strong>{{ fee.toLocaleString() }} VND</strong>
      </div>

      <div v-if="errorMessage" class="text-red-600 mt-2">
        ❌ {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const fromAddress = ref('')
const toAddress = ref('')
const fromName = ref('')
const fromPhone = ref('')
const toName = ref('')
const toPhone = ref('')
const codAmount = ref(0)
const itemValue = ref(0)
const fee = ref(null)
const errorMessage = ref('')

const GOONG_API_KEY = 'k138b5upB1WWdnaD0PQqQWM7mAotpmnopQqFs10K'
const AHAMOVE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJ1c2VyIiwiY2lkIjoiODQ5NDY4MjYwOTgiLCJzdGF0dXMiOiJBQ1RJVkFUSU5HIiwiZW9jIjoiZHVjdmFwaDUxNDAyQGdtYWlsLmNvbSIsIm5vYyI6IlbFqSBBbmggxJDhu6ljIiwiaW1laSI6IndlYiIsInR5cGUiOiJ3ZWIiLCJleHAiOjE3NTMwMzM4MTksImlhdCI6MTc1Mjc3NDYxOSwiaXNzIjoiYWhhIiwic3ViIjoiODQ5NDY4MjYwOTgifQ.4ztGq1GDs2BlSAoiwiXxnGoIybJfYU0VScfqr-Km05Y' // Lấy từ dashboard/sandbox

async function getLatLng(address) {
  const res = await axios.get('https://rsapi.goong.io/Geocode', {
    params: {
      address,
      api_key: GOONG_API_KEY
    }
  })
  const result = res.data.results?.[0]
  if (!result) throw new Error('Không tìm thấy toạ độ cho địa chỉ: ' + address)
  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    address: result.formatted_address
  }
}

async function estimateFee() {
  fee.value = null
  errorMessage.value = ''

  try {
    const from = await getLatLng(fromAddress.value)
    const to = await getLatLng(toAddress.value)

    const body = {
      order_time: 0,
      path: [
        {
          lat: from.lat,
          lng: from.lng,
          address: from.address,
          short_address: 'Điểm lấy hàng',
          name: fromName.value,
          mobile: fromPhone.value,
          remarks: 'Đến nơi lấy hàng đọc mã đơn để nhận hàng'
        },
        {
          lat: to.lat,
          lng: to.lng,
          address: to.address,
          short_address: 'Điểm giao hàng',
          name: toName.value,
          mobile: toPhone.value,
          cod: codAmount.value,
          item_value: itemValue.value,
          tracking_number: 'TRACK123456',
          remarks: 'Giao hàng nhanh, gọi trước khi đến'
        }
      ],
      services: [
        {
          _id: 'HAN-BIKE',
          requests: [
            {
              _id: 'HAN-BIKE-TIP',
              num: 1
            }
          ]
        }
      ],
      payment_method: 'CASH',
      remarks: 'Giao hàng nội thành Hồ Chí Minh',
      promo_code: 'AHMKM',
      items: [
        {
          _id: 'ITM1',
          num: 1,
          name: 'Sản phẩm A',
          price: 200000
        }
      ],
      package_detail: [
        {
          weight: 10,
          length: 1.2,
          width: 0.8,
          height: 2.0,
          description: 'Hàng nội thất'
        }
      ]
    }

    const res = await axios.post(
      'https://partner-apistg.ahamove.com/v3/orders/estimates',
      body,
      {
        headers: {
          Authorization: `Bearer ${AHAMOVE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    fee.value = res.data.total
  } catch (err) {
    console.error(err)
    errorMessage.value = err.response?.data?.message || 'Có lỗi xảy ra'
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
