import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "es-drager/lib/style.css";
import Drager from "es-drager";
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true });

const app = createApp(App);
app.use(router);

const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);
app.component("es-drager", Drager);

app.mount("#app");
