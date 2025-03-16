<template>
    <div class="flex flex-col min-h-screen">
      <!-- Header -->
      <Header />
      
      <!-- Main Content -->
      <main class="flex-1 container mx-auto p-4">
        <router-view />
      </main>
      
      <!-- Footer -->
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Header from "@/layouts/Header.vue";
  import Footer from "@/layouts/Footer.vue";
  </script>