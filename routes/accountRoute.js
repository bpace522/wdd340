const express = require("express")
const router = express.Router()
const utilities = require("../utilities/index")
const accController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accController.buildLogin))
router.get("/register", utilities.handleErrors(accController.buildRegister))
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagement))
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
)

router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accController.buildUpdateView)
)

router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accController.updateAccount)
)

router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accController.updatePassword)
)

router.get(
  "/logout",
  utilities.checkLogin,
  utilities.handleErrors(accController.accountLogout)
)

module.exports = router