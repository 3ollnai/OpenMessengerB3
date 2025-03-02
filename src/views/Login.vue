<!-- eslint-disable vue/multi-word-component-names -->
<template>
<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <img src="../assets/Logo.png" alt="Logo" class="h-12 mr-2" />
    <h1 class="text-4xl font-bold text-gray-800 mb-6"></h1>
    <form @submit.prevent="login" class="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input v-model="username" id="username" type="text" placeholder="Enter your username" required class="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
        <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" id="password" type="password" placeholder="Enter your password" required class="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
        <button type="submit" class="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200">
            Login
        </button>
        <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </form>
    <p class="text-center mt-4 text-gray-600">
        Don't have an account?
        <router-link to="/register" class="text-green-500 font-semibold hover:underline">Register</router-link>
    </p>
  </div>
</template>
<script>
import API_BASE_URL from '../main';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async login() {
      const usernameRegex = /^[a-zA-Z]+\.[a-zA-Z]+$/;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

      // Vérification des formats
      if (!usernameRegex.test(this.username)) {
        this.error = 'The username needs to be in the next format : firstlame.lastname !';
        return;
      }
      if (!passwordRegex.test(this.password)) {
        this.error = 'The password needs to contain only alphanumeric characters and contains atleast 6 characters.';
        return;
      }

      try {
        const requestUrl = `${API_BASE_URL}/login/${this.username}/${this.password}`;
        console.log("Tentative de connexion avec l'URL :", requestUrl);

        const response = await fetch(requestUrl);

        // Vérification si la réponse est correcte
        if (!response.ok) {
          const errorData = await response.json(); // Récupérer les détails de l'erreur
          console.error("Erreur de réponse de l'API :", errorData);
          throw new Error('Error while attempting to connect.');
        }

        const data = await response.json(); // Conversion de la réponse en JSON
        console.log("Réponse de l'API :", data);

        // Vérification de la réponse
        if (data.result && data.result.status === 'done') {
          const token = data.result.token; // Accéder au token ici
          console.log("Token reçu de l'API :", token); // Vérification du token
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', data.result.id);
            localStorage.setItem('user_name', this.username);
            this.$router.push('/chat');
          } else {
            this.error = 'Token non reçu. Vérifiez la réponse de l\'API.';
          }
        } else {
          this.error = data.result.message || 'Échec de la connexion, réessayez.';
        }
      } catch (error) {
        console.error("Erreur de requête API :", error);
        this.error = 'Une erreur s\'est produite lors de la connexion.';
      }
    },
  },
};

</script>


