const welcome = document.getElementById("welcome")
const msg = document.getElementById("msg")
const logoutBtn = document.getElementById("logoutBtn")

const joinBtn = document.getElementById("joinBtn")
const roomInput = document.getElementById("roomInput")

const privateTo = document.getElementById("privateTo")
const privateGoBtn = document.getElementById("privateGoBtn")
const privateMsg = document.getElementById("privateMsg")

function getUser() {
  const raw = localStorage.getItem("user")
  return raw ? JSON.parse(raw) : null
}

const user = getUser()
if (!user) {
  window.location.href = "/view/login.html"
} else {
  welcome.textContent = `Welcome, ${user.firstname} ${user.lastname} (@${user.username})`
}

function goToRoom(roomName) {
  const clean = (roomName || "").trim()
  if (!clean) {
    msg.textContent = "Room name is required"
    return
  }
  localStorage.setItem("chatMode", "group")
  localStorage.setItem("roomName", clean)
  localStorage.removeItem("privateTo")
  window.location.href = "/view/chat.html"
}

joinBtn.addEventListener("click", () => {
  msg.textContent = ""
  goToRoom(roomInput.value)
})

document.querySelectorAll(".roomBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    msg.textContent = ""
    goToRoom(btn.dataset.room)
  })
})

privateGoBtn.addEventListener("click", () => {
  privateMsg.textContent = ""
  const to = (privateTo.value || "").trim()
  if (!to) {
    privateMsg.textContent = "Username is required"
    return
  }
  if (to === user.username) {
    privateMsg.textContent = "You cannot chat with yourself"
    return
  }

  localStorage.setItem("chatMode", "private")
  localStorage.setItem("privateTo", to)
  localStorage.removeItem("roomName")
  window.location.href = "/view/chat.html"
})

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user")
  localStorage.removeItem("roomName")
  localStorage.removeItem("privateTo")
  localStorage.removeItem("chatMode")
  window.location.href = "/view/login.html"
})
