// models/inventory-model.js
const pool = require("../database/")

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return data
  } catch (error) {
    console.error("getClassifications error " + error)
    throw error
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
    throw error
  }
}

/* ***************************
 *  Get classification name by classification_id
 * ************************** */
async function getClassificationNameById(classification_id) {
  try {
    const data = await pool.query(
      "SELECT classification_name FROM public.classification WHERE classification_id = $1",
      [classification_id]
    )
    return data.rows[0].classification_name
  } catch (error) {
    console.error("getClassificationNameById error " + error)
    throw error
  }
}

/* ***************************
 *  Get inventory item by inventory_id
 * ************************** */
async function getInventoryItemById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryItemById error " + error)
    throw error
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getClassificationNameById,
  getInventoryItemById,
}