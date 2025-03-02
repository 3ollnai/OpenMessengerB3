<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-4">Welcome to Open Messenger</h1>
    <router-link to="/login" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Login</router-link>
    <router-link to="/register" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mt-2">Register</router-link>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
};
</script>
