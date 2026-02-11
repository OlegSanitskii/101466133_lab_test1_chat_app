const title = document.getElementById("title")
const who = document.getElementById("who")
const messagesDiv = document.getElementById("messages")
const sendForm = document.getElementById("sendForm")
const messageInput = document.getElementById("messageInput")
const msg = document.getElementById("msg")
const backBtn = document.getElementById("backBtn")
const logoutBtn = document.getElementById("logoutBtn")

function getUser() {
  const raw = localStorage.getItem("user")
  return raw ? JSON.parse(raw) : null
}

const user = getUser()
const roomName = (localStorage.getItem("roomName") || "").trim()

if (!user) window.location.href = "/view/login.html"
if (!roomName) window.location.href = "/view/rooms.html"

title.textContent = `Room: ${roomName}`
who.textContent = `You: ${user.firstname} ${user.lastname} (@${user.username})`

function renderMessage(m) {
  const line = document.createElement("div")
  const name = `${m.firstname} ${m.lastname} (@${m.username})`
  line.textContent = `${name}: ${m.message}`
  messagesDiv.appendChild(line)
  messagesDiv.scrollTop = messagesDiv.scrollHeight
}

async function loadHistory() {
  try {
    const res = await fetch(`/api/messages/group?roomName=${encodeURIComponent(roomName)}`)
    const data = await res.json()
    if (!data.ok) {
      msg.textContent = data.message || "Failed to load messages"
      return
    }
    messagesDiv.innerHTML = ""
    data.messages.forEach(renderMessage)
  } catch (e) {
    msg.textContent = "Network error while loading history"
  }
}

const socket = io()

socket.on("connect", () => {
  socket.emit("joinRoom", roomName)
})

socket.on("newGroupMessage", (m) => {
  if (m.roomName !== roomName) return
  renderMessage(m)
})

sendForm.addEventListener("submit", (e) => {
  e.preventDefault()
  msg.textContent = ""

  const text = (messageInput.value || "").trim()
  if (!text) return

  socket.emit("sendGroupMessage", {
    roomName,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    message: text,
  })

  messageInput.value = ""
})

backBtn.addEventListener("click", () => {
  window.location.href = "/view/rooms.html"
})

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user")
  localStorage.removeItem("roomName")
  window.location.href = "/view/login.html"
})

loadHistory()
