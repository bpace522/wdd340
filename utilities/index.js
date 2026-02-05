const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id && Number(row.classification_id) === Number(classification_id)) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  // default locals for every request
  res.locals.loggedin = 0
  res.locals.accountData = null

  const token = req.cookies.jwt
  if (!token) return next()

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      // Token bad/expired -> clear it, treat user as logged out, keep browsing
      res.clearCookie("jwt")
      return next()
    }

    res.locals.accountData = accountData
    res.locals.loggedin = 1
    return next()
  })
}


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = async (req, res, next) => {
  if (res.locals.loggedin) return next()

  req.flash("notice", "Please log in.")
  const nav = await Util.getNav()
  return res.status(401).render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

Util.checkAccountType = async (req, res, next) => {
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in.")
    const nav = await Util.getNav()
    return res.status(401).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

  const type = res.locals.accountData.account_type
  if (type === "Employee" || type === "Admin") return next()

  req.flash("notice", "You do not have permission to access that page.")
  const nav = await Util.getNav()
  return res.status(403).render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}


module.exports = Util