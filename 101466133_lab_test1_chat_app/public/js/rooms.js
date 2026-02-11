const welcome = document.getElementById("welcome")
const msg = document.getElementById("msg")
const logoutBtn = document.getElementById("logoutBtn")
const joinBtn = document.getElementById("joinBtn")
const roomInput = document.getElementById("roomInput")

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
  localStorage.setItem("roomName", clean)
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

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user")
  localStorage.removeItem("roomName")
  window.location.href = "/view/login.html"
})
