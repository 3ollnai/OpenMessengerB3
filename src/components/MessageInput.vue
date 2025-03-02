<template>
  <div class="flex items-center p-2 border rounded-lg bg-white">
    <input
      v-model="message"
      placeholder="Enter your message here"
      class="flex-grow px-4 py-2 border-none focus:outline-none"
      @keyup.enter="send"
    />
    <button
      @click="send"
      class="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 flex items-center justify-center ml-2"
    >
      ➤
    </button>
  </div>
</template>
<script>
const API_BASE_URL = "https://greenvelvet.alwaysdata.net/kwick/api";

export default {
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async send() {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");

      // Vérification des paramètres nécessaires
      if (!token || !user_id) {
        console.error("Token or user_id is missing.");
        return;
      }

      if (!this.message.trim()) {
        console.error("Message is empty.");
        return;
      }

      // Construction correcte de l'URL
      const messageEncoded = encodeURIComponent(this.message.trim());
      const requestUrl = `${API_BASE_URL}/say/${token}/${user_id}/${messageEncoded}`;

      console.log("Request URL:", requestUrl); // Pour déboguer l'URL

      try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
          console.error("Error with HTTP response:", response.status, response.statusText);
          throw new Error("Error sending message");
        }

        const data = await response.json();

        if (data.result && data.result.status === "done") {
          console.log("Message sent successfully:", this.message);

          // Émettre un événement vers le parent
          this.$emit("send-message", this.message.trim());

          // Réinitialiser le champ message
          this.message = "";
        } else {
          console.error("API response error:", data);
        }
      } catch (error) {
        console.error("Message send error:", error);
      }
    },
  },
};
</script>


<style scoped>
/* Ajoutez des styles personnalisés ici si nécessaire */
</style>
