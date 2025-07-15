<template>
  <div id="map" class="w-full h-[500px]"></div>
</template>

<script setup>
const API_KEY = 'k138b5upB1WWdnaD0PQqQWM7mAotpmnopQqFs10K'
const PLACE_ID = 'Q-8jU_A10U0d7nIFCtWV-7VSZP6S0EoqEYaoCjq9njiZnwk9LsROFzXu250u1TKjye6RTBIBmhsB4n18agBOjh1ClTAm2SruqYs1jRIZ2hqZQnGMQsBCwhmG0SzuWEYbG' // placeId từ AutoComplete

fetch(`https://rsapi.goong.io/Place/Detail?place_id=${PLACE_ID}&api_key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    console.log('Thông tin địa điểm:', data)
  })
  .catch(err => {
    console.error('Lỗi:', err)
  })

</script>


<style>
#map {
  width: 100%;
  height: 500px;
}
</style>
