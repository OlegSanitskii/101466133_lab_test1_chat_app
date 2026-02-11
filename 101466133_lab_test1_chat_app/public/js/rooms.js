const who = document.getElementById("who")
const roomsList = document.getElementById("roomsList")
const privateForm = document.getElementById("privateForm")
const privateToInput = document.getElementById("privateTo")
const msg = document.getElementById("msg")
const logoutBtn = document.getElementById("logoutBtn")

function getUser() {
  const raw = localStorage.getItem("user")
  return raw ? JSON.parse(raw) : null
}

const user = getUser()
if (!user) window.location.href = "/view/login.html"

who.textContent = `You: ${user.firstname} ${user.lastname} (@${user.username})`

const rooms = ["General", "Sports", "Music", "Movies", "Tech"]

function makeRoomItem(room) {
  const item = document.createElement("div")
  item.className = "list-item"

  const meta = document.createElement("div")
  meta.className = "meta"

  const title = document.createElement("div")
  title.className = "title"
  title.textContent = room

  const desc = document.createElement("div")
  desc.className = "desc"
  desc.textContent = "Group chat room"

  meta.appendChild(title)
  meta.appendChild(desc)

  const btn = document.createElement("button")
  btn.className = "btn btn-primary"
  btn.textContent = "Join"
  btn.addEventListener("click", () => {
    localStorage.setItem("chatMode", "group")
    localStorage.setItem("roomName", room)
    localStorage.removeItem("privateTo")
    window.location.href = "/view/chat.html"
  })

  item.appendChild(meta)
  item.appendChild(btn)
  return item
}

roomsList.innerHTML = ""
rooms.forEach((r) => roomsList.appendChild(makeRoomItem(r)))

privateForm.addEventListener("submit", (e) => {
  e.preventDefault()
  msg.textContent = ""

  const to = (privateToInput.value || "").trim()
  if (!to) {
    msg.textContent = "Please enter a username"
    return
  }
  if (to === user.username) {
    msg.textContent = "You cannot start a private chat with yourself"
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
  localStorage.removeItem("chatMode")
  localStorage.removeItem("privateTo")
  window.location.href = "/view/login.html"
})
