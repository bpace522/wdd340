const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

// -------------------- Classification --------------------
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters. Letters/numbers only."),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
    })
  }
  next()
}

// -------------------- Inventory --------------------
validate.inventoryRules = () => {
  return [
    body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),
    body("inv_year")
      .trim()
      .notEmpty().withMessage("Year is required.")
      .isInt({ min: 1886, max: 2099 }).withMessage("Year must be a valid number."),
    body("inv_description")
      .trim().escape()
      .notEmpty().withMessage("Description is required.")
      .isLength({ min: 10 }).withMessage("Description must be at least 10 characters."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price")
      .trim()
      .notEmpty().withMessage("Price is required.")
      .isFloat({ min: 0 }).withMessage("Price must be a number 0 or greater."),
    body("inv_miles")
      .trim()
      .notEmpty().withMessage("Miles is required.")
      .isInt({ min: 0 }).withMessage("Miles must be an integer 0 or greater."),
    body("inv_color").trim().escape().notEmpty().withMessage("Color is required."),
    body("classification_id")
      .trim()
      .notEmpty().withMessage("Classification is required.")
      .isInt().withMessage("Classification is required."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  const nav = await utilities.getNav()
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  const classificationList = await utilities.buildClassificationList(classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color,
    })
  }
  next()
}

module.exports = validate
