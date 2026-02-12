const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const favoriteController = require("../controllers/favoriteController")
const favValidate = require("../utilities/favorite-validation")

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.buildFavorites)
)

router.post(
  "/add",
  utilities.checkLogin,
  favValidate.favoriteRules(),
  favValidate.checkFavoriteData,
  utilities.handleErrors(favoriteController.addFavorite)
)

router.post(
  "/remove",
  utilities.checkLogin,
  favValidate.favoriteRules(),
  favValidate.checkFavoriteData,
  utilities.handleErrors(favoriteController.removeFavorite)
)

module.exports = router
