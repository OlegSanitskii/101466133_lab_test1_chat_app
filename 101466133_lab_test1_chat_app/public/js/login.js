const loginForm = document.getElementById("loginForm")
const msg = document.getElementById("msg")

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  msg.textContent = ""

  const username = document.getElementById("username").value.trim()
  const password = document.getElementById("password").value.trim()

  if (!username || !password) {
    msg.textContent = "Please enter username and password"
    return
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    if (!data.ok) {
      msg.textContent = data.message || "Login failed"
      return
    }

    localStorage.setItem("user", JSON.stringify(data.user))
    window.location.href = "/view/rooms.html"
  } catch (err) {
    msg.textContent = "Network error"
  }
})
