const form = document.getElementById("loginForm")
const msg = document.getElementById("msg")

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  msg.textContent = ""

  const payload = {
    username: document.getElementById("username").value.trim(),
    password: document.getElementById("password").value,
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (!data.ok) {
      msg.textContent = data.message
      return
    }

    // localStorage
    localStorage.setItem("user", JSON.stringify(data.user))

    window.location.href = "/view/rooms.html"
  } catch (err) {
    msg.textContent = "Network error"
  }
})
