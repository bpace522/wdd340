const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByModelId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const vehicle = await invModel.getModelInfoByInventoryId(inventory_id)
  let nav = await utilities.getNav()

  res.render("./inventory/model", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicle,
  })
}

invCont.buildManagement = async function(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav, 
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

invCont.buildAddClassification = async function(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav, 
      errors: null,
      classification_name: "",
    })
  } catch (err) {
    next(err)
  }
}

invCont.addClassification = async function(req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", "Classification added successfully")
      const nav = await utilities.getNav()
      return res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the classification could not be added.")
      const nav = await utilities.getNav()
      return res.render("inventory/add-classification", {
        title: "Add classification",
        nav,
        errors: null,
        classification_name,
      })
    }
  } catch (err) {
    next(err)
  }
}

invCont.buildAddInventory = async function(req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: ""
  })
}

invCont.addInventory = async function(req, res, next) {
  const nav = await utilities.getNav()
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  const result = await invModel.addInventoryItem(
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  )

  if (result) {
    req.flash("notice", "Inventory item added successfully.")
    const newNav = await utilities.getNav()
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav: newNav,
      errors: null,
    })
  }

  req.flash("notice", "Sorry, the inventory item could not be added.")
  const classificationList = await utilities.buildClassificationList(classification_id)
  return res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color,
  })
}

module.exports = invCont