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

function confirmDelete(restaurantId) {
  const strRestaurantId = restaurantId.toString()
  if (confirm('是否删除?')) {
    document.querySelector('#deleteForm_' + strRestaurantId).submit()
  }
}
