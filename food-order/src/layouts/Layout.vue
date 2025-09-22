<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header />
    <!-- Main Content -->
    <main class="bg-[#fff] flex-grow">
      <router-view />
    </main>
    <!-- Footer -->
    <Footer />
    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup>
import Header from '@/layouts/Header.vue'
import Footer from '@/layouts/Footer.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
</script>
