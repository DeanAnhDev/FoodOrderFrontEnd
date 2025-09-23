import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollToTop() {
  const isVisible = ref(false)

  const handleScroll = () => {
    isVisible.value = window.scrollY > 300
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const scrollToElement = (elementId, offset = 0) => {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      })
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isVisible,
    scrollToTop,
    scrollToElement,
  }
}
