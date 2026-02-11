const form = document.getElementById("signupForm")
const msg = document.getElementById("msg")

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  msg.textContent = ""

  const payload = {
    username: document.getElementById("username").value.trim(),
    firstname: document.getElementById("firstname").value.trim(),
    lastname: document.getElementById("lastname").value.trim(),
    password: document.getElementById("password").value,
  }

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (!data.ok) {
      msg.textContent = data.message
      return
    }

    msg.textContent = "Signup success ✅ Now login..."
    setTimeout(() => (window.location.href = "/view/login.html"), 800)
  } catch (err) {
    msg.textContent = "Network error"
  }
})
