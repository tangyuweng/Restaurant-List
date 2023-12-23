module.exports = (req, res, next) => {
  res.locals.success_msg = req.flash('success')
  res.locals.error_msg = req.flash('error')
  res.locals.validation_error = req.flash('validation_error')[0]

  next()
}
