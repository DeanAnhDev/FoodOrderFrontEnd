<template>
    <div class="order-list">
        <!-- Header với tabs trạng thái -->
        <div class="order-header-section">
            <h2 class="page-title">Đơn hàng của tôi</h2>
            <div class="order-tabs">
                <button v-for="status in orderStatuses" :key="status.value"
                    :class="['tab-button', { active: selectedStatus === status.value }]"
                    @click="handleStatusChange(status.value)">
                    <span class="tab-icon">{{ status.icon }}</span>
                    <span class="tab-label">{{ status.label }}</span>
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="orderStore.loading" class="loading">
            <div class="spinner"></div>
            <p>Đang tải danh sách đơn hàng...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="orderStore.error" class="error">
            <p>{{ orderStore.error }}</p>
            <button @click="loadOrders" class="retry-button">Thử lại</button>
        </div>

        <!-- Orders list -->
        <div v-else-if="orderStore.orders.length > 0" class="orders-container">
            <div v-for="order in orderStore.orders" :key="order.orderId" class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <div class="order-title-row">
                            <h3 class="order-code">Đơn hàng #{{ order.orderCode }}</h3>
                            <div class="status-badges">
                                <span :class="['status-badge', getStatusClass(order.status)]">
                                    {{ getStatusLabel(order.status) }}
                                </span>
                                <span :class="['payment-status-badge', getPaymentStatusClass(order.paymentStatus)]">
                                    {{ getPaymentStatusLabel(order.paymentStatus) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="order-date">
                        {{ formatDate(order.createdAt) }}
                    </div>
                </div>

                <div class="order-details">
                    <div class="order-items">
                        <div v-for="item in order.orderDetails" :key="item.orderDetailId" class="order-item">
                            <img v-if="item.itemImage?.url" :src="item.itemImage.url" :alt="item.itemName"
                                class="item-image" />
                            <div class="item-info">
                                <h4>{{ item.itemName }}</h4>
                                <p>Số lượng: {{ item.quantity }}</p>
                                <p class="item-price">{{ formattedPrice(item.totalPrice) }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="order-summary">
                        <div class="shipping-info">
                            <p><strong>Địa chỉ giao hàng:</strong> {{ order.address }}</p>
                            <p><strong>Phí ship:</strong> {{ formattedPrice(order.shipFee) }}</p>
                            <p><strong>Hình thức thanh toán:</strong> {{ getPaymentMethodLabel(order.paymentMethod) }}
                            </p>
                        </div>
                        <div class="total-amount">
                            <strong>Tổng tiền: {{ formattedPrice(order.totalAmount) }}</strong>
                        </div>
                    </div>
                </div>

                <!-- Action buttons based on status -->
                <div class="order-actions">
                    <button v-if="order.status === 0" @click="cancelOrder(order)" class="cancel-button">
                        Hủy đơn hàng
                    </button>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="orderStore.total > orderStore.query.pageSize" class="pagination">
                <button :disabled="orderStore.query.page === 1" @click="changePage(orderStore.query.page - 1)"
                    class="page-button">
                    Trước
                </button>
                <span class="page-info">
                    Trang {{ orderStore.query.page }} / {{ totalPages }}
                </span>
                <button :disabled="orderStore.query.page >= totalPages" @click="changePage(orderStore.query.page + 1)"
                    class="page-button">
                    Sau
                </button>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>Không có đơn hàng nào</h3>
            <p>{{ getEmptyMessage() }}</p>
        </div>

        <!-- Cancel Order Modal -->
        <div v-if="showCancelModal" class="modal-overlay" @click="closeCancelModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>Xác nhận hủy đơn hàng</h3>
                    <button class="close-button" @click="closeCancelModal">×</button>
                </div>

                <div class="modal-body">
                    <p class="confirmation-text">
                        Bạn có chắc chắn muốn hủy đơn hàng <strong>#{{ orderToCancel?.orderCode }}</strong> không?
                    </p>

                    <div class="reason-section">
                        <label class="reason-label">Lý do hủy đơn hàng:</label>
                        <div class="reason-options">
                            <label v-for="reason in cancelReasons" :key="reason.value" class="reason-option">
                                <input type="radio" :value="reason.value" v-model="selectedCancelReason"
                                    @change="onReasonChange" />
                                <span>{{ reason.label }}</span>
                            </label>
                        </div>

                        <div v-if="selectedCancelReason === 'other'" class="custom-reason">
                            <textarea v-model="customCancelReason" placeholder="Nhập lý do khác..." rows="3"
                                class="custom-reason-input"></textarea>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-secondary" @click="closeCancelModal">Không</button>
                    <button class="btn-danger" @click="confirmCancelOrder"
                        :disabled="!canConfirmCancel || orderStore.loading">
                        <span v-if="orderStore.loading">Đang hủy...</span>
                        <span v-else>Xác nhận hủy</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { formattedPrice } from '@/utils/formart'
import { useToast } from 'vue-toastification'

const orderStore = useOrderStore()
const selectedStatus = ref(null)
const toast = useToast()

// Cancel order modal state
const showCancelModal = ref(false)
const orderToCancel = ref(null)
const selectedCancelReason = ref('')
const customCancelReason = ref('')

// Cancel reasons
const cancelReasons = [
    { value: 'changed_mind', label: 'Đổi ý không muốn mua nữa' },
    { value: 'wrong_order', label: 'Đặt nhầm sản phẩm' },
    { value: 'found_better_price', label: 'Tìm được giá rẻ hơn ở nơi khác' },
    { value: 'financial_issue', label: 'Vấn đề tài chính' },
    { value: 'delivery_time', label: 'Thời gian giao hàng quá lâu' },
    { value: 'other', label: 'Khác (nhập lý do)' }
]

// Danh sách các trạng thái order (sử dụng số theo enum backend)
const orderStatuses = [
    { value: null, label: 'Tất cả', icon: '📋' },
    { value: 0, label: 'Chờ xử lý', icon: '⏳' },        // Pending
    { value: 1, label: 'Đã xác nhận', icon: '✅' },      // Accepted
    { value: 2, label: 'Đang xử lý', icon: '👨‍🍳' },       // Processing
    { value: 3, label: 'Đã làm xong', icon: '🍽️' },      // Done
    { value: 4, label: 'Đang giao hàng', icon: '🚚' },   // Shipping
    { value: 5, label: 'Hoàn thành', icon: '🎉' },       // Completed
    { value: 6, label: 'Đã hủy', icon: '❌' }           // Cancelled
]

const totalPages = computed(() => {
    return Math.ceil(orderStore.total / orderStore.query.pageSize)
})

const canConfirmCancel = computed(() => {
    if (!selectedCancelReason.value) return false
    if (selectedCancelReason.value === 'other') {
        return customCancelReason.value.trim().length > 0
    }
    return true
})

// Methods
const loadOrders = () => {
    const query = selectedStatus.value !== null ? { status: selectedStatus.value } : {}
    orderStore.fetchOrders(query)
}

const handleStatusChange = (status) => {
    selectedStatus.value = status
    orderStore.query.page = 1 // Reset về trang đầu
    loadOrders()
}

const changePage = (page) => {
    orderStore.query.page = page
    loadOrders()
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getStatusLabel = (status) => {
    const statusMap = {
        0: 'Chờ xử lý',      // Pending
        1: 'Đã xác nhận',    // Accepted
        2: 'Đang xử lý',     // Processing
        3: 'Đã làm xong',    // Done
        4: 'Đang giao hàng', // Shipping
        5: 'Hoàn thành',     // Completed
        6: 'Đã hủy'         // Cancelled
    }
    return statusMap[status] || `Trạng thái ${status}`
}

const getStatusClass = (status) => {
    const classMap = {
        0: 'pending',    // Pending
        1: 'accepted',   // Accepted
        2: 'processing', // Processing
        3: 'done',       // Done
        4: 'shipping',   // Shipping
        5: 'completed',  // Completed
        6: 'cancelled'   // Cancelled
    }
    return classMap[status] || 'default'
}

const getPaymentStatusLabel = (paymentStatus) => {
    const statusMap = {
        0: 'Chưa thanh toán',     // Pending
        1: 'Đã thanh toán',       // Paid  
        2: 'Thanh toán thất bại', // Failed
        3: 'Hoàn tiền',          // Refunded
        4: 'Đã hủy'              // Cancelled
    }
    return statusMap[paymentStatus] || 'Không xác định'
}

const getPaymentStatusClass = (paymentStatus) => {
    const classMap = {
        0: 'payment-pending',   // Pending
        1: 'payment-paid',      // Paid
        2: 'payment-failed',    // Failed
        3: 'payment-refunded',  // Refunded
        4: 'payment-cancelled'  // Cancelled
    }
    return classMap[paymentStatus] || 'payment-default'
}

const getPaymentMethodLabel = (paymentMethod) => {
    const methodMap = {
        0: 'Tiền mặt (COD)',     // Cash On Delivery
        1: 'VNPay',              // Bank Transfer/VNPay
        2: 'Thẻ tín dụng',       // Credit Card
        3: 'Ví điện tử'          // E-Wallet
    }
    return methodMap[paymentMethod] || 'Không xác định'
}

const getEmptyMessage = () => {
    if (selectedStatus.value) {
        return `Bạn chưa có đơn hàng nào ở trạng thái "${getStatusLabel(selectedStatus.value)}"`
    }
    return 'Bạn chưa có đơn hàng nào. Hãy đặt hàng ngay!'
}

const cancelOrder = (order) => {
    orderToCancel.value = order
    showCancelModal.value = true
    selectedCancelReason.value = ''
    customCancelReason.value = ''
}

const closeCancelModal = () => {
    showCancelModal.value = false
    orderToCancel.value = null
    selectedCancelReason.value = ''
    customCancelReason.value = ''
}

const onReasonChange = () => {
    if (selectedCancelReason.value !== 'other') {
        customCancelReason.value = ''
    }
}

const confirmCancelOrder = async () => {
    if (!canConfirmCancel.value || !orderToCancel.value) return

    const reason = selectedCancelReason.value === 'other'
        ? customCancelReason.value.trim()
        : cancelReasons.find(r => r.value === selectedCancelReason.value)?.label || ''

    try {
        const request = {
            OrderId: orderToCancel.value.orderId,
            NewStatus: 6, // Cancelled status (OrderStatus enum)
            Reason: reason
        }

        const result = await orderStore.changeOrderStatus(request)

        if (result.success) {
            toast.success(result.message || 'Hủy đơn hàng thành công!')
            closeCancelModal()
            // Reload orders to get updated data
            loadOrders()
        } else {
            toast.error(result.message || 'Không thể hủy đơn hàng')
        }
    } catch (error) {
        console.error('Cancel order error:', error)
        toast.error('Có lỗi xảy ra khi hủy đơn hàng')
    }
}

// Load orders when component mounts
onMounted(() => {
    loadOrders()
})
</script>

<style scoped>
.order-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: #fafbfc;
    min-height: 100vh;
}

/* Header Section */
.order-header-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.page-title {
    margin: 0 0 20px 0;
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    text-align: center;
}

/* Tabs styling */
.order-tabs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    padding: 0;
}

.tab-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 12px;
    border: 2px solid #e1e5e9;
    background: white;
    color: #6c757d;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.tab-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
}

.tab-button:hover::before {
    left: 100%;
}

.tab-button:hover {
    border-color: #007bff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.tab-button.active {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border-color: #007bff;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
}

.tab-icon {
    font-size: 20px;
    filter: grayscale(0.3);
    transition: filter 0.3s ease;
}

.tab-button.active .tab-icon {
    filter: grayscale(0);
}

.tab-label {
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
}

/* Loading state */
.loading {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Error state */
.error {
    text-align: center;
    padding: 60px 20px;
    color: #dc3545;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.retry-button {
    margin-top: 20px;
    padding: 12px 24px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.retry-button:hover {
    background: #0056b3;
    transform: translateY(-1px);
}

/* Order cards */
.orders-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.order-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.order-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #007bff, #28a745);
}

.order-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #007bff;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f8f9fa;
}

.order-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
}

.order-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
}

.status-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.order-code {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    background: linear-gradient(45deg, #007bff, #28a745);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.status-badge {
    padding: 8px 16px;
    border-radius: 25px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
}

.status-badge::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% {
        left: -100%;
    }

    100% {
        left: 100%;
    }
}

.status-badge.pending {
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    color: #856404;
    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
}

.status-badge.accepted {
    background: linear-gradient(135deg, #cce5ff, #74b9ff);
    color: #004085;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.status-badge.processing {
    background: linear-gradient(135deg, #e7f3ff, #a29bfe);
    color: #0056b3;
    box-shadow: 0 2px 8px rgba(162, 155, 254, 0.3);
}

.status-badge.done {
    background: linear-gradient(135deg, #d1ecf1, #00b894);
    color: #0c5460;
    box-shadow: 0 2px 8px rgba(0, 184, 148, 0.3);
}

.status-badge.shipping {
    background: linear-gradient(135deg, #fdcb6e, #e17055);
    color: #721c24;
    box-shadow: 0 2px 8px rgba(225, 112, 85, 0.3);
}

.status-badge.completed {
    background: linear-gradient(135deg, #d4edda, #00b894);
    color: #155724;
    box-shadow: 0 2px 8px rgba(0, 184, 148, 0.3);
}

.status-badge.cancelled {
    background: linear-gradient(135deg, #f8d7da, #e84393);
    color: #721c24;
    box-shadow: 0 2px 8px rgba(232, 67, 147, 0.3);
}

/* Payment Status Badges */
.payment-status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
}

.payment-status-badge::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
}

.payment-status-badge.payment-pending {
    background: linear-gradient(135deg, #fef3c7, #f59e0b);
    color: #92400e;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.payment-status-badge.payment-paid {
    background: linear-gradient(135deg, #d1fae5, #10b981);
    color: #065f46;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.payment-status-badge.payment-failed {
    background: linear-gradient(135deg, #fee2e2, #ef4444);
    color: #991b1b;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.payment-status-badge.payment-refunded {
    background: linear-gradient(135deg, #e0e7ff, #8b5cf6);
    color: #5b21b6;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.payment-status-badge.payment-cancelled {
    background: linear-gradient(135deg, #f3f4f6, #6b7280);
    color: #374151;
    box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

.payment-status-badge.payment-default {
    background: linear-gradient(135deg, #f9fafb, #d1d5db);
    color: #4b5563;
    box-shadow: 0 2px 8px rgba(209, 213, 219, 0.3);
}

.order-date {
    color: #6c757d;
    font-size: 14px;
    font-weight: 500;
    background: #f8f9fa;
    padding: 6px 12px;
    border-radius: 20px;
}

/* Order details */
.order-details {
    margin-bottom: 20px;
}

.order-items {
    margin-bottom: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
}

.order-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.order-item:last-child {
    border-bottom: none;
}

.order-item:hover {
    background: rgba(0, 123, 255, 0.05);
    border-radius: 8px;
    margin: 0 -8px;
    padding: 16px 8px;
}

.item-image {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.item-image:hover {
    transform: scale(1.05);
}

.item-info {
    flex: 1;
}

.item-info h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
}

.item-info p {
    margin: 4px 0;
    color: #6c757d;
    font-size: 14px;
}

.item-price {
    font-weight: 700;
    color: #28a745 !important;
    font-size: 16px;
}

.order-summary {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 20px;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 12px;
    border-left: 4px solid #007bff;
}

.shipping-info p {
    margin: 6px 0;
    font-size: 14px;
    color: #495057;
    font-weight: 500;
}

.total-amount {
    font-size: 15px;
    font-weight: 500;
    color: #dc3545;
    background: white;
    padding: 12px 20px;
    border-radius: 25px;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

/* Order actions */
.order-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 16px;
}

.cancel-button {
    padding: 12px 24px;
    background: linear-gradient(135deg, #dc3545, #c82333);
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.cancel-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 32px;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.page-button {
    padding: 12px 20px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.page-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.page-button:disabled {
    background: #dee2e6;
    color: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.page-info {
    font-weight: 600;
    color: #495057;
    background: #f8f9fa;
    padding: 8px 16px;
    border-radius: 20px;
}

/* Empty state */
.empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #6c757d;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.7;
}

.empty-state h3 {
    margin: 0 0 12px 0;
    color: #495057;
    font-size: 24px;
    font-weight: 600;
}

.empty-state p {
    font-size: 16px;
    color: #6c757d;
}

/* Responsive */
@media (max-width: 768px) {
    .order-list {
        padding: 16px;
    }

    .order-header-section {
        padding: 20px;
        margin-bottom: 20px;
    }

    .page-title {
        font-size: 24px;
        margin-bottom: 16px;
    }

    .order-tabs {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }

    .tab-button {
        padding: 12px 8px;
        gap: 6px;
    }

    .tab-icon {
        font-size: 16px;
    }

    .tab-label {
        font-size: 11px;
    }

    .order-card {
        padding: 20px;
    }

    .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .order-info {
        width: 100%;
    }

    .order-title-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .status-badges {
        justify-content: flex-start;
    }

    .order-code {
        font-size: 18px;
    }

    .order-summary {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
        padding: 16px;
    }

    .total-amount {
        align-self: stretch;
        text-align: center;
        font-size: 18px;
        color: #dc3545;
        border-color: #dc3545;
        font-family: 'Arial', sans-serif;
    }

    .order-item {
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        gap: 12px;
    }

    .item-image {
        width: 100%;
        height: 140px;
        max-width: 240px;
        align-self: center;
    }

    .pagination {
        padding: 20px 16px;
        gap: 16px;
    }

    .page-button {
        padding: 10px 16px;
        font-size: 14px;
    }

    .order-actions {
        justify-content: center;
    }

    .cancel-button {
        flex: 1;
        max-width: 200px;
    }
}

@media (max-width: 480px) {
    .order-tabs {
        grid-template-columns: 1fr;
    }

    .tab-button {
        flex-direction: row;
        justify-content: center;
        padding: 12px 16px;
    }

    .tab-icon {
        font-size: 18px;
    }

    .tab-label {
        font-size: 14px;
    }
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: modalSlideUp 0.3s ease-out;
}

@keyframes modalSlideUp {
    from {
        opacity: 0;
        transform: translateY(50px) scale(0.9);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 0 24px;
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 20px;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #dc3545;
}

.close-button {
    background: none;
    border: none;
    font-size: 24px;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close-button:hover {
    background: #f8f9fa;
    color: #dc3545;
}

.modal-body {
    padding: 0 24px 20px;
}

.confirmation-text {
    font-size: 16px;
    color: #495057;
    margin-bottom: 24px;
    line-height: 1.5;
}

.reason-section {
    margin-bottom: 20px;
}

.reason-label {
    display: block;
    font-weight: 600;
    color: #495057;
    margin-bottom: 12px;
    font-size: 14px;
}

.reason-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.reason-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.reason-option:hover {
    border-color: #007bff;
    background: #f8f9ff;
}

.reason-option input[type="radio"] {
    margin: 0;
    cursor: pointer;
}

.reason-option span {
    font-size: 14px;
    color: #495057;
    cursor: pointer;
}

.reason-option:has(input:checked) {
    border-color: #007bff;
    background: #e7f3ff;
}

.custom-reason {
    margin-top: 12px;
}

.custom-reason-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
    transition: border-color 0.3s ease;
}

.custom-reason-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 20px 24px 24px;
    border-top: 1px solid #e9ecef;
}

.btn-secondary {
    padding: 12px 24px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 14px;
}

.btn-secondary:hover {
    background: #5a6268;
    transform: translateY(-1px);
}

.btn-danger {
    padding: 12px 24px;
    background: linear-gradient(135deg, #dc3545, #c82333);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-danger:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

.btn-danger:disabled {
    background: #dee2e6;
    color: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* Modal responsive */
@media (max-width: 480px) {
    .modal-overlay {
        padding: 10px;
    }

    .modal-content {
        max-height: 95vh;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
        padding-left: 16px;
        padding-right: 16px;
    }

    .modal-footer {
        flex-direction: column;
    }

    .btn-secondary,
    .btn-danger {
        width: 100%;
        justify-content: center;
    }
}
</style>
