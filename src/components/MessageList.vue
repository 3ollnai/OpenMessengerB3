<template>
  <div class="mb-4">
    <ul class="space-y-4">
      <li v-for="message in messages" :key="message.id" class="flex items-start">
        <!-- Message reçu (aligné à gauche) -->
        <template v-if="message.sender.name !== currentUserName">
          <div class="flex items-start space-x-2">
            <div
              class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            >
              {{ message.sender.initials }}
            </div>
            <div>
              <div class="text-sm text-gray-600 mb-1">{{ formatName(message.sender.name) }}</div>
              <div class="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm max-w-md">
                <p class="text-gray-800">{{ message.content }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Message envoyé (aligné à droite) -->
        <template v-else>
          <div class="flex items-start space-x-2 ml-auto">
            <div>
              <div class="text-sm text-gray-600 mb-1 text-right">Vous</div>
              <div class="bg-green-500 text-white rounded-2xl rounded-tr-none px-4 py-2 shadow-sm max-w-md">
                <p>{{ message.content }}</p>
              </div>
            </div>
            <div
              class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            >
              {{ message.sender.initials }}
            </div>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
const API_BASE_URL = "https://greenvelvet.alwaysdata.net/kwick/api";

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatFullName(username) {
  if (username.includes(".")) {
    const [firstName, lastName] = username.split(".");
    return `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;
  }
  return capitalizeFirstLetter(username);
}

export default {
  data() {
    return {
      messages: [],
      currentUserName: localStorage.getItem("user_name") || "",
    };
  },
  mounted() {
    this.fetchMessages();
    // Faire défiler vers le bas au chargement
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  updated() {
    // Faire défiler vers le bas après chaque mise à jour
    this.scrollToBottom();
  },
  methods: {
    formatName(name) {
      if (name.includes(" ")) {
        const [firstName, lastName] = name.split(" ");
        return `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;
      }
      if (name.includes(".")) {
        return formatFullName(name);
      }
      return capitalizeFirstLetter(name);
    },

    scrollToBottom() {
      const container = this.$el.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    async fetchMessages() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/talk/list/${token}/0`);
        const data = await response.json();

        if (!data.result || !Array.isArray(data.result.talk)) {
          console.error("Format des messages incorrect :", data);
          this.messages = [];
          return;
        }

        this.messages = data.result.talk.map((msg) => {
          let senderName = "Utilisateur inconnu";
          let initials = "??";

          if (msg.user_name && typeof msg.user_name === "string" && msg.user_name.trim() !== "") {
            if (msg.user_name.includes(".")) {
              const [firstName, lastName] = msg.user_name.split(".");
              senderName = msg.user_name;
              initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();
            } else {
              senderName = msg.user_name;
              initials = msg.user_name[0].toUpperCase();
            }
          }

          return {
            sender: {
              name: senderName,
              initials: initials,
            },
            content: msg.content || "Message vide",
            id: msg.timestamp || Date.now(),
          };
        });

      } catch (error) {
        console.error("Erreur récupération des messages :", error);
        this.messages = [];
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
