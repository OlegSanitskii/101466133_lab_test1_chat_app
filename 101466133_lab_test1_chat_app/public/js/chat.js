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
if (!user) window.location.href = "/view/login.html"

// mode + targets
const chatMode = localStorage.getItem("chatMode") || "group"
const roomName = (localStorage.getItem("roomName") || "").trim()
const privateTo = (localStorage.getItem("privateTo") || "").trim()

// guard
if (chatMode === "group" && !roomName) window.location.href = "/view/rooms.html"
if (chatMode === "private" && !privateTo) window.location.href = "/view/rooms.html"

// header
if (chatMode === "group") {
  title.textContent = `Room: ${roomName}`
} else {
  title.textContent = `Private chat with: @${privateTo}`
}
who.textContent = `You: ${user.firstname} ${user.lastname} (@${user.username})`

function clearMessages() {
  messagesDiv.innerHTML = ""
}

function addLine(text) {
  const line = document.createElement("div")
  line.textContent = text
  messagesDiv.appendChild(line)
  messagesDiv.scrollTop = messagesDiv.scrollHeight
}

function renderGroupMessage(m) {
  const name = `${m.firstname} ${m.lastname} (@${m.username})`
  addLine(`${name}: ${m.message}`)
}

function renderPrivateMessage(m) {
  const sender =
    m.from === user.username
      ? `${user.firstname} ${user.lastname} (@${user.username})`
      : `@${m.from}`
  addLine(`${sender}: ${m.message}`)
}

async function loadHistory() {
  msg.textContent = ""
  clearMessages()

  try {
    if (chatMode === "group") {
      const res = await fetch(`/api/messages/group?roomName=${encodeURIComponent(roomName)}`)
      const data = await res.json()

      if (!data.ok) {
        msg.textContent = data.message || "Failed to load group history"
        return
      }

      data.messages.forEach(renderGroupMessage)
      return
    }

    // private
    const res = await fetch(
      `/api/messages/private?userA=${encodeURIComponent(user.username)}&userB=${encodeURIComponent(privateTo)}`
    )
    const data = await res.json()

    if (!data.ok) {
      msg.textContent = data.message || "Failed to load private history"
      return
    }

    data.messages.forEach(renderPrivateMessage)
  } catch (e) {
    msg.textContent = "Network error while loading history"
  }
}

// Socket init
const socket = io()

socket.on("connect", () => {
  // IMPORTANT: register current user so private messages reach this browser
  socket.emit("registerUser", user.username)

  if (chatMode === "group") {
    socket.emit("joinRoom", roomName)
  }
})

socket.on("connect_error", (err) => {
  msg.textContent = "Socket connection error"
  console.log("socket connect_error:", err)
})

// GROUP incoming
socket.on("newGroupMessage", (m) => {
  if (chatMode !== "group") return
  if (m.roomName !== roomName) return
  renderGroupMessage(m)
})

// PRIVATE incoming
socket.on("newPrivateMessage", (m) => {
  if (chatMode !== "private") return

  const isThisChat =
    (m.from === user.username && m.to === privateTo) ||
    (m.from === privateTo && m.to === user.username)

  if (!isThisChat) return

  renderPrivateMessage(m)
})

// SEND
sendForm.addEventListener("submit", (e) => {
  e.preventDefault()
  msg.textContent = ""

  const text = (messageInput.value || "").trim()
  if (!text) return

  if (chatMode === "group") {
    socket.emit("sendGroupMessage", {
      roomName,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      message: text,
    })
  } else {
    socket.emit("sendPrivateMessage", {
      from: user.username,
      to: privateTo,
      message: text,
    })
  }

  messageInput.value = ""
})

backBtn.addEventListener("click", () => {
  window.location.href = "/view/rooms.html"
})

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user")
  localStorage.removeItem("roomName")
  localStorage.removeItem("chatMode")
  localStorage.removeItem("privateTo")
  window.location.href = "/view/login.html"
})

loadHistory()
