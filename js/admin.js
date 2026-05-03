const loginSection = document.querySelector("#login-section");
const adminSection = document.querySelector("#admin-section");
const passwordInput = document.querySelector("#admin-password");
const loginButton = document.querySelector("#login-button");
const loginMessage = document.querySelector("#login-message");
const logoutButton = document.querySelector("#logout-button");
const container = document.querySelector("#submissions-container");

loginButton.addEventListener("click", function() {
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      password: passwordInput.value
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        localStorage.setItem("adminToken", data.token);

        loginSection.style.display = "none";
        adminSection.style.display = "block";

        loadSubmissions();
      } else {
        loginMessage.textContent = "Incorrect password.";
      }
    })
    .catch(function(error) {
      console.log(error);
      loginMessage.textContent = "Login failed. Please try again.";
    });
});

function loadSubmissions() {
  container.innerHTML = "";

  fetch("http://localhost:3000/submissions", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
  })
    .then(function(response) {
      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        location.reload();
        return;
      }

      return response.json();
    })
    .then(function(data) {
      if (!data) {
        return;
      }

      if (data.length === 0) {
        container.textContent = "No submissions yet.";
        return;
      }

      data.forEach(function(submission) {
        const card = document.createElement("div");
        card.classList.add("submission-card");

        card.innerHTML = `
          <h3>${submission.name}</h3>
          <p><strong>Email:</strong> ${submission.email}</p>
          <p><strong>Message:</strong> ${submission.message}</p>
          <button>Delete</button>
        `;

        const deleteButton = card.querySelector("button");

        deleteButton.addEventListener("click", function() {
          const confirmDelete = confirm("Are you sure you want to delete this submission?");

          if (!confirmDelete) {
            return;
          }

          fetch(`http://localhost:3000/submissions/${submission._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
          })
            .then(function(response) {
              if (response.status === 401) {
                localStorage.removeItem("adminToken");
                location.reload();
                return;
              }

              return response.json();
            })
            .then(function(data) {
              if (!data) {
                return;
              }

              card.remove();
            })
            .catch(function(error) {
              console.log(error);
              alert("Failed to delete.");
            });
        });

        container.appendChild(card);
      });
    })
    .catch(function(error) {
      console.log(error);
      localStorage.removeItem("adminToken");
      location.reload();
    });
}

const savedToken = localStorage.getItem("adminToken");

if (savedToken) {
  loginSection.style.display = "none";
  adminSection.style.display = "block";
  loadSubmissions();
}

logoutButton.addEventListener("click", function() {
  localStorage.removeItem("adminToken");
  location.reload();
});