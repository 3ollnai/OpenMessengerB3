<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div v-if="isAuthenticated" class="flex h-screen">
    <!-- Sidebar -->
    <div class="bg-white border-r w-64 p-4 flex flex-col">
      <img src="@/assets/Logo.png" alt="Open Messenger" class="w-24 mx-auto mb-4" />

      <!-- Séparateur -->
      <hr class="border-gray-300 mb-4" />

      <!-- Utilisateur connecté + Déconnexion -->
      <div class="mb-4 p-2 rounded-lg bg-gray-100 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            {{ currentUser.initials }}
          </div>
          <div class="font-medium uppercase">{{ currentUser.name }}</div>
        </div>
        <button @click="logout" class="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Barre de recherche -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search people"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <!-- Liste des utilisateurs connectés -->
      <div v-if="filteredUsers.length > 0" class="space-y-2 mt-2 flex-1 overflow-y-auto">
        <div
          v-for="user in filteredUsers"
          :key="user.name"
          class="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
        >
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            {{ user.initials }}
          </div>
          <div class="font-medium uppercase">{{ user.name }}</div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 mt-4">No users online</div>
    </div>

    <!-- Chat -->
    <div class="flex-1 flex flex-col bg-gray-50">
      <div class="bg-white border-b p-4 text-center font-medium text-lg">Open Chat</div>
      <div class="flex-1 overflow-y-auto p-4">
        <MessageList :messages="messages" />
      </div>
      <div class="border-t border-gray-200 p-4 bg-white">
        <MessageInput @send-message="sendMessage" />
      </div>
    </div>
  </div>
  <div v-else>
    <div class="h-screen flex items-center justify-center">
      <div class="text-center">
        <h2 class="text-xl mb-4">Veuillez vous connecter pour accéder au chat</h2>
        <button
          @click="$router.push('/login')"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Se connecter
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MessageList from "../components/MessageList.vue";
import MessageInput from "../components/MessageInput.vue";

const API_BASE_URL = "https://greenvelvet.alwaysdata.net/kwick/api";

export default {
  components: {
    MessageList,
    MessageInput,
  },
  data() {
    return {
      isAuthenticated: false,
      currentUser: { name: "", initials: "", id: "" },
      onlineUsers: [],
      messages: [],
      searchQuery: "",
    };
  },
  created() {
    this.checkAuth();
  },
  mounted() {
    if (this.isAuthenticated) {
      this.fetchCurrentUser();
      this.fetchOnlineUsers();
      this.fetchMessages();
      setInterval(this.fetchOnlineUsers, 5000);
      setInterval(this.fetchMessages, 5000);
    }
  },
  computed: {
    filteredUsers() {
      return this.onlineUsers.filter(
        (user) => user.name !== this.currentUser.name &&
                 user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("user_name");

      if (!token || !username) {
        this.isAuthenticated = false;
        this.$router.push("/login");
        return;
      }

      this.isAuthenticated = true;
    },

    async fetchCurrentUser() {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("user_name");

      if (!token || !username) {
        console.error("Aucun token ou pseudonyme trouvé");
        return;
      }

      let initials = username[0].toUpperCase();
      if (username.includes(".")) {
        const [firstName, lastName] = username.split(".");
        initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();
      }

      this.currentUser = {
        name: username.replace(".", " ").toUpperCase(), // Conversion en majuscules
        initials: initials,
        id: username,
      };

      console.log("Utilisateur actuel défini :", this.currentUser);
    },

    async fetchOnlineUsers() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/user/logged/${token}`);
        const data = await response.json();

        console.log("Réponse brute de l'API - Utilisateurs connectés :", data);

        if (!data.result || !data.result.user || !Array.isArray(data.result.user)) {
          console.error("Données incorrectes pour les utilisateurs :", data);
          this.onlineUsers = [];
          return;
        }

        if (data.result.user.length === 0) {
          console.warn("Aucun utilisateur connecté.");
          this.onlineUsers = [];
          return;
        }

        this.onlineUsers = data.result.user
          .filter(username => typeof username === "string" && username.includes("."))
          .map((username) => {
            const [firstName, lastName] = username.split(".");
            return {
              name: `${firstName} ${lastName}`.toUpperCase(), // Conversion en majuscules
              initials: firstName[0].toUpperCase() + lastName[0].toUpperCase(),
            };
          });

        console.log("Utilisateurs connectés :", this.onlineUsers);

      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        this.onlineUsers = [];
      }
    },

    async fetchMessages() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/talk/list/${token}/0`);
        const data = await response.json();

        console.log("Réponse API - Historique des messages :", data);

        if (!data.result || !Array.isArray(data.result.talk)) {
          console.error("Format des messages incorrect :", data);
          return;
        }

        this.messages = data.result.talk
          .filter(msg => msg.user && typeof msg.user === "string")
          .map((msg) => {
            const senderName = msg.user.includes(".") ? msg.user.replace(".", " ") : msg.user;
            const initials = msg.user.includes(".")
              ? msg.user.split(".")[0][0].toUpperCase() + msg.user.split(".")[1][0].toUpperCase()
              : msg.user[0].toUpperCase();

            return {
              sender: {
                name: senderName.toUpperCase(), // Conversion en majuscules
                initials: initials,
              },
              content: msg.content,
              id: msg.id,
            };
          });

      } catch (error) {
        console.error("Erreur récupération des messages :", error);
      }
    },

    async sendMessage(message) {
      if (!message.trim()) return;

      console.log("Message envoyé :", message);

      this.messages.push({
        sender: {
          name: this.currentUser.name.toUpperCase(), // Conversion en majuscules
          initials: this.currentUser.initials
        },
        content: message,
        id: Date.now(),
      });
    },

    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
