import { createApp } from "vue";
import "@/assets/index.css";
import App from "@/App.vue";

window.ZOHO.embeddedApp.on("PageLoad", function (data) {
    console.log(data);

    createApp(App).mount("#app");
});
window.ZOHO.embeddedApp.init(); 
