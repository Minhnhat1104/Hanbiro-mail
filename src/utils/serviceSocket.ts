// @ts-nocheck
import io from "socket.io-client"

let locationInfo = window.location
const { hostname } = locationInfo
let domainUser = hostname

// console.log("connect socket ==> ", userData)

// Check mode development
if (hostname == "localhost" || hostname == "127.0.0.1") {
  domainUser = "global3.hanbiro.com"
}

let wsUrl = ""
if (document.location.protocol == "https:") {
  wsUrl = "https://" + domainUser + ":" + 8082
  // wsUrl = "https://" + domainUser + ":" + 28388;
} else {
  wsUrl = "http://" + domainUser + ":" + 8081
  // wsUrl = "http://" + domainUser + ":" + 2838;
}

export const socket = io.connect(wsUrl, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 10000,
  randomizationFactor: 0.9,
  reconnectionDelayMax: 10000, // Reconnect after 1 to 10 seconds (10 seconds ± 9 seconds, max 10 seconds).
  forceNew: true,
})
