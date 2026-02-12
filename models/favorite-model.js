const pool = require("../database/index")

async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO public.favorites (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, inv_id) DO NOTHING
      RETURNING favorite_id;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    return null
  }
}

async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM public.favorites
      WHERE account_id = $1 AND inv_id = $2
      RETURNING favorite_id;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    return null
  }
}

async function checkFavorite(account_id, inv_id) {
  try {
    const sql = `
      SELECT favorite_id
      FROM public.favorites
      WHERE account_id = $1 AND inv_id = $2;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rowCount > 0
  } catch (error) {
    return false
  }
}

async function getFavoritesByAccount(account_id) {
  try {
    const sql = `
      SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_price, i.inv_thumbnail
      FROM public.favorites f
      JOIN public.inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.created_at DESC;
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    return []
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoritesByAccount,
}
