import { createApp } from "vue"
import Antd from "ant-design-vue"
import App from "./vue/App.vue"

import "ant-design-vue/dist/reset.css"
import "./index.css"

const app = createApp(App)
app.use(Antd)
app.mount("#app")
