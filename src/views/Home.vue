<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <img src="../assets/Logo.png" alt="Logo" class="h-12 mr-2" />
    <h1 class="text-4xl font-bold mb-4"></h1>
    <router-link to="/login" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mt-2">Login</router-link>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
};
</script>
