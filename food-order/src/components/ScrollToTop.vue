<template>
    <Transition name="scroll-btn">
        <button v-if="isVisible" @click="scrollToTop" class="scroll-to-top-btn" aria-label="Scroll to top">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>
    </Transition>
</template>

<script setup>
import { useScrollToTop } from '@/composables/useScrollToTop'

const { isVisible, scrollToTop } = useScrollToTop()
</script>

<style scoped>
.scroll-to-top-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
}

.scroll-to-top-btn:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
    background: linear-gradient(135deg, #0056b3, #003d82);
}

.scroll-to-top-btn:active {
    transform: translateY(-1px) scale(0.98);
}

.scroll-to-top-btn svg {
    transition: transform 0.2s ease;
}

.scroll-to-top-btn:hover svg {
    transform: translateY(-2px);
}

/* Animation cho button xuất hiện/biến mất */
.scroll-btn-enter-active,
.scroll-btn-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-btn-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
}

.scroll-btn-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
}

/* Responsive */
@media (max-width: 768px) {
    .scroll-to-top-btn {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
    }
}

@media (max-width: 480px) {
    .scroll-to-top-btn {
        bottom: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
    }

    .scroll-to-top-btn svg {
        width: 20px;
        height: 20px;
    }
}
</style>