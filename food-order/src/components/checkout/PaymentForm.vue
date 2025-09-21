<template>
  <div class="payment-form">
    <h2>Payment Information</h2>
    <form @submit.prevent="submitPayment">
      <div class="form-group">
        <label for="cardNumber">Card Number</label>
        <input type="text" id="cardNumber" v-model="cardNumber" required />
      </div>
      <div class="form-group">
        <label for="cardHolder">Card Holder Name</label>
        <input type="text" id="cardHolder" v-model="cardHolder" required />
      </div>
      <div class="form-group">
        <label for="expiryDate">Expiry Date</label>
        <input type="text" id="expiryDate" v-model="expiryDate" placeholder="MM/YY" required />
      </div>
      <div class="form-group">
        <label for="cvv">CVV</label>
        <input type="text" id="cvv" v-model="cvv" required />
      </div>
      <button type="submit" class="btn-primary">Pay Now</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cardNumber = ref('')
const cardHolder = ref('')
const expiryDate = ref('')
const cvv = ref('')

const submitPayment = () => {
  // Logic to handle payment submission
  console.log({
    cardNumber: cardNumber.value,
    cardHolder: cardHolder.value,
    expiryDate: expiryDate.value,
    cvv: cvv.value,
  })
  // Here you would typically call an API to process the payment
}
</script>

<style scoped>
.payment-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>