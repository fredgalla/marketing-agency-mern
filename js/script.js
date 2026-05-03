const button = document.querySelector(".btn");

button.addEventListener("click", function() {
  alert("Thanks for your interest! We will contact you soon.");
});

const form = document.querySelector("#contact-form");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // stops page refresh

  const name = document.querySelector("input[type='text']").value;
  const email = document.querySelector("input[type='email']").value;
  const message = document.querySelector("textarea").value;

  const formData = {
  name,
  email,
  message
};

fetch("http://localhost:3000/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(formData)
})
.then(function(response) {
  return response.json();
})
.then(function(data) {
  messageElement.textContent = data.message;
  form.reset();
})
.catch(function(error) {
  console.log(error);
  messageElement.textContent = "Something went wrong. Please try again.";
});

console.log(formData);

  const messageElement = document.querySelector("#form-message");

  messageElement.textContent = `Thank you, ${name}! We received your message.`;

  form.reset();
}); 