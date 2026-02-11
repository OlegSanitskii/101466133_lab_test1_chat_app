const signupForm = document.getElementById("signupForm")
const msg = document.getElementById("msg")

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  msg.textContent = ""

  const firstname = document.getElementById("firstname").value.trim()
  const lastname = document.getElementById("lastname").value.trim()
  const username = document.getElementById("username").value.trim()
  const password = document.getElementById("password").value.trim()

  if (!firstname || !lastname || !username || !password) {
    msg.textContent = "Please fill all fields"
    return
  }

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, username, password }),
    })

    const data = await res.json()
    if (!data.ok) {
      msg.textContent = data.message || "Signup failed"
      return
    }

    window.location.href = "/view/login.html"
  } catch (err) {
    msg.textContent = "Network error"
  }
})
