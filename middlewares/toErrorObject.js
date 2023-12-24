// 將表單驗證錯誤訊息轉成 key-value pair
module.exports = function (errors) {
  const errorObject = {}
  errors.array().forEach((error) => {
    errorObject[error.path] = error.msg
  })
  return errorObject
}
