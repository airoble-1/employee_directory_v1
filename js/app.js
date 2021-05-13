"use strict"

// API variables
let employees = []
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`

// DOM selector variables
const gridContainer = document.querySelector(".grid-container")
const overlay = document.querySelector(".overlay")
const modalContent = document.querySelector(".modal-content")
const modalClose = document.querySelector(".modal-close")

// Render error on screen
const renderError = function (msg) {
  gridContainer.insertAdjacentText("beforeend", msg)
}

// Display employee data in gallery
const DisplayEmployeeData = async function (url) {
  try {
    const response = await fetch(url)
    // Manual rejection of promise incase of server response 403, 404 etc...
    if (!response.ok) throw new Error("Problem getting the employee data")
    const object = await response.json()
    const employeesData = object.results

    employeesData.forEach((employeeData, index) => {
      const picture = employeeData.picture.large
      const firstName = employeeData.name.first
      const lastName = employeeData.name.last
      const fullName = firstName + lastName
      const email = employeeData.email
      const city = employeeData.location.city

      const htmlCard = `
    <div class="card"  data-index-number=${index}>
    <img class="avatar" src=${picture} alt=${fullName} photo/>
    <div class="text-container">
      <h2>${firstName} ${lastName}</h2>
      <p>${email}</p>
      <p>${city}</p>
    </div>
    `
      gridContainer.insertAdjacentHTML("beforeend", htmlCard)
    })
    return employeesData
  } catch (err) {
    console.error(err)
    renderError(`Something went wrong =( ${err.message}`)
  }
}

// Display modal for selected employee
function displayModal(employeeData) {
  const picture = employeeData.picture.large
  const firstName = employeeData.name.first
  const lastName = employeeData.name.last
  const fullName = firstName + lastName
  const email = employeeData.email
  const city = employeeData.location.city
  const phone = employeeData.phone
  const street = employeeData.location.street
  const state = employeeData.location.state
  const postalcode = employeeData.location.postcode

  const htmlModal = `
    <img
    class="avatar"
    src=${picture}
    alt=${fullName} photo"
    />
  <div class="text-container">
    <h2>${firstName} ${lastName}</h2>
    <p>${email}</p>
    <p>${city}</p>
    <hr />
    <p>${phone}</p>
    <p class="address">${street.number} ${street.name} ${city}, ${state} ${postalcode}</p>
    <p>Birthday: 01/04/85</p>
  </div>
  `
  modalContent.insertAdjacentHTML("beforeend", htmlModal)
  overlay.classList.remove("hidden")
}

;(async function () {
  try {
    employees = await DisplayEmployeeData(urlAPI)
  } catch (err) {
    console.error(err.message)
  }
  // Listen for employee card clicks
  gridContainer.addEventListener("click", (e) => {
    if (e.target.nodeName !== "MAIN") {
      let employeeCardNum = e.target
        .closest(".card")
        .getAttribute("data-index-number")
      const selectedEmployee = employees[employeeCardNum]
      displayModal(selectedEmployee)
    }
  })
})()

// close the modal return to gallery
gridContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-close")) {
    overlay.classList.add("hidden")
    modalContent.innerHTML = ""
  }
})

function filterImages() {
  let input = document.getElementById("search").value.toLowerCase()
  let avatars = document.getElementsByClassName("avatar")
  // Loop through all the employees images and hide the parent of those who don't match the search query
  for (let i = 0; i < avatars.length; i++) {
    let alternateText = avatars[i].alt.toLowerCase()
    if (!alternateText.includes(input)) {
      avatars[i].parentElement.style.display = "none"
    } else {
      avatars[i].parentElement.style.display = "flex"
    }
  }
}
