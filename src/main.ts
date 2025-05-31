import "./styles/main.scss"
import "./styles/monaco.scss"
import "./styles/animate.scss"

import "./service/message"
import "./monaco/environment"
import "./monaco/themes/monakai-spectrum"

import { mountApp } from "qingkuai"
import App from "./components/App.qk"

mountApp("#app", App)
navigator.serviceWorker.register("/sw.js")
