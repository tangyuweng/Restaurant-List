const message_err = document.querySelector('.message_err')
const message_suc = document.querySelector('.message_suc')

function showMessage(element) {
  if (element) {
    element.classList.add('show')

    setTimeout(() => {
      element.classList.remove('show')
    }, 3000)
  }
}

showMessage(message_err)
showMessage(message_suc)

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
