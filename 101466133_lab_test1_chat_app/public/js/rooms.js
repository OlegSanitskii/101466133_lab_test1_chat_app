const userRaw = localStorage.getItem("user")
if (!userRaw) window.location.href = "/view/login.html"

const user = JSON.parse(userRaw)
document.getElementById("welcome").textContent = `Welcome, ${user.firstname} ${user.lastname} (@${user.username})`

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user")
  window.location.href = "/view/login.html"
})
