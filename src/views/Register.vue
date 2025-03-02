<!-- eslint-disable vue/multi-word-component-names -->
<template>
 <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <img src="../assets/Logo.png" alt="Logo" class="h-12 mr-2" />
    <h1 class="text-4xl font-bold text-gray-800 mb-6"></h1>
    <form @submit.prevent="register" class="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input v-model="username" id="username" type="text" placeholder="Enter your username" required class="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"/>
        </div>
        <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" id="password" type="password" placeholder="Enter your password" required class="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"/>
        </div>
        <button type="submit" class="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200">
            Register
        </button>
        <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>
    </form>
    <p class="text-center mt-4 text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-green-500 font-semibold hover:underline">Login</router-link>
    </p>
</div>

</template>

<script>
import logo from "@/assets/logo.png";
import axios from 'axios';
import API_BASE_URL from '../main';

export default {
  data() {
    return {
      logo,
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async register() {
  const usernameRegex = /^[a-zA-Z]+\.[a-zA-Z]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!usernameRegex.test(this.username)) {
    this.errorMessage = 'Username must be in format: firstname.lastname';
    return;
  }
  if (!passwordRegex.test(this.password)) {
    this.errorMessage = 'Password must be at least 6 characters and contain both letters and numbers';
    return;
  }

  try {
    const requestUrl = `${API_BASE_URL}/signup/${this.username}/${this.password}`;
    console.log("Attempting registration with URL:", requestUrl);

    const response = await axios.get(requestUrl); // On utilise GET car l'API fonctionne comme ça

    console.log("API Response:", response.data);


    if (response.data.kwick && response.data.kwick.status === 'ok') {
        console.log('User registered successfully:', response.data);
        this.$router.push('/login');
    } else {
        this.errorMessage = response.data.result.message || 'Registration failed, try again.';
    }
} catch (error) {
    console.error("API Request Error:", error);

    if (error.response) {
        console.error("Error Response Data:", error.response.data);
        this.errorMessage = `API Error: ${error.response.data.message || 'Unknown error'}`;
    } else {
        this.errorMessage = 'An error occurred during registration.';
    }
}

}
}
};
</script>
