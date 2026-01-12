// @ts-nocheck
import React from "react"
import ReactDOM from "react-dom/client"
import { PersistGate } from "redux-persist/integration/react"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"
import setupStore from "./store"
import "assets/js/jsencrypt.min"
import "drag-drop-touch"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const { store, persistor } = setupStore()

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.Fragment>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <App />
          <ToastContainer />
        </BrowserRouter>
      </React.Fragment>
    </PersistGate>
  </Provider>,
)

serviceWorker.unregister()
