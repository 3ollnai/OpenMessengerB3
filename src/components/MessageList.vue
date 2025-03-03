<template>
  <div class="mb-4">
    <h3 class="text-xl font-bold mb-2"></h3>
    <ul class="border p-2 rounded">
      <li v-for="message in messages" :key="message.id" class="p-2 border-b last:border-b-0">
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold"
          >
            {{ message.sender.initials }}
          </div>
          <div>
            <div class="font-medium">{{ formatName(message.sender.name) }}</div>
            <div class="text-gray-500 text-sm">{{ message.content }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const API_BASE_URL = "https://greenvelvet.alwaysdata.net/kwick/api";

// Fonction utilitaire pour capitaliser la première lettre
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Fonction pour formater un nom complet
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
      currentUser: { name: "" },
    };
  },
  mounted() {
    this.fetchMessages();
  },
  methods: {
    formatName(name) {
      // Pour gérer les noms qui sont déjà au format "Prénom Nom"
      if (name.includes(" ")) {
        const [firstName, lastName] = name.split(" ");
        return `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;
      }
      // Pour gérer les noms au format "prenom.nom"
      if (name.includes(".")) {
        return formatFullName(name);
      }
      return capitalizeFirstLetter(name);
    },

    async fetchMessages() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/talk/list/${token}/0`);
        const data = await response.json();

        console.log("Réponse API - Historique des messages :", data);

        if (!data.result || !Array.isArray(data.result.talk)) {
          console.error("Format des messages incorrect :", data);
          this.messages = [];
          return;
        }

        this.messages = data.result.talk.map((msg) => {
          console.log("Message reçu :", msg);

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
          } else {
            console.warn("Nom d'utilisateur manquant ou incorrect :", msg);
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
