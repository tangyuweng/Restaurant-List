const message = document.querySelector('.message')

if (message) {
  message.classList.add('show')

  setTimeout(() => {
    message.classList.remove('show')
  }, 3000)
}

function submitForm() {
  const restaurantForm = document.querySelector('#restaurantForm')
  let selectedValue = document.querySelector('#sort-select').value
  restaurantForm.action = '/restaurants?sort=' + selectedValue
  restaurantForm.submit()
}
