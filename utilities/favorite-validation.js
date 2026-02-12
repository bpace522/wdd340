const { body, validationResult } = require("express-validator")
const utilities = require("./index")
const validate = {}

validate.favoriteRules = () => [
  body("inv_id")
    .trim()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Invalid vehicle id."),
]

validate.checkFavoriteData = async (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  req.flash("notice", "Unable to process that request.")
  return res.redirect("/account/")
}

module.exports = validate
