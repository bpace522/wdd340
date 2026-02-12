const utilities = require("../utilities")
const favoriteModel = require("../models/favorite-model")

/* *****************************
 * Build Favorites view
 * ***************************** */
async function buildFavorites(req, res) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id

  const favorites = await favoriteModel.getFavoritesByAccount(account_id)

  res.render("account/favorites", {
    title: "My Favorites",
    nav,
    errors: null,
    favorites,
  })
}

/* *****************************
 * Add Favorite
 * ***************************** */
async function addFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const inv_id = Number(req.body.inv_id)

  const result = await favoriteModel.addFavorite(account_id, inv_id)

  if (result) req.flash("notice", "Added to favorites.")
  else req.flash("notice", "That vehicle is already in your favorites.")

  // send them back where they came from
  return res.redirect(req.get("Referrer") || "/account/favorites")
}

/* *****************************
 * Remove Favorite
 * ***************************** */
async function removeFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const inv_id = Number(req.body.inv_id)

  const result = await favoriteModel.removeFavorite(account_id, inv_id)

  if (result) req.flash("notice", "Removed from favorites.")
  else req.flash("notice", "Favorite not found.")

  return res.redirect(req.get("Referrer") || "/account/favorites")
}

module.exports = {
  buildFavorites,
  addFavorite,
  removeFavorite,
}
