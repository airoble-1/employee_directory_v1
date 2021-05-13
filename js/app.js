"use strict"

// API variables
let employees = []
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`

// DOM selector variables
const gridContainer = document.querySelector(".grid-container")

// Display employee data in gallery
async function DisplayEmployeeData(url) {
  const response = await fetch(url)
  const object = await response.json()
  const employees = object.results
  console.log(employees[0])

  employees.forEach((employee) => {
    const picture = employee.picture.large
    const firstName = employee.name.first
    const lastName = employee.name.last
    const email = employee.email
    const city = employee.location.city

    const htmlCard = `
    <div class="card">
    <img class="avatar" src=${picture} alt="employee photo" />
    <div class="text-container">
      <h2>${firstName} ${lastName}</h2>
      <p>${email}</p>
      <p>${city}</p>
    </div>
    `

    gridContainer.insertAdjacentHTML("beforeend", htmlCard)
  })
}

DisplayEmployeeData(urlAPI)
