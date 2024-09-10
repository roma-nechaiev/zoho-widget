import { createApp } from "vue";
import "@/assets/index.css";
import App from "@/App.vue";

window.ZOHO.embeddedApp.on("PageLoad", function (data) {
    createApp(App, { page: data }).mount("#app");
});
window.ZOHO.embeddedApp.init(); 
