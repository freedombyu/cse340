// models/inventory-model.js
const pool = require("../database/")

const invModel = {
  // Get all classification data
  getClassifications: async function() {
    try {
      const sql = "SELECT * FROM classification ORDER BY classification_name";
      const result = await pool.query(sql);
      return result; // Return the full result with rows property
    } catch (error) {
      console.error("getClassifications error:", error);
      return { rows: [] }; // Return empty rows on error
    }
  },

  // Get inventory by classification id
  getInventoryByClassificationId: async function(classification_id) {
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
      console.error("getInventoryByClassificationId error:", error)
      return []
    }
  },

  // Get inventory by inventory id
  getInventoryByInventoryId: async function(inventory_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory WHERE inv_id = $1`,
        [inventory_id]
      )
      return data.rows
    } catch (error) {
      console.error("getInventoryByInventoryId error:", error)
      return []
    }
  },

  // Get classification name by id
  getClassificationNameById: async function(classification_id) {
    try {
      const data = await pool.query(
        `SELECT classification_name FROM public.classification WHERE classification_id = $1`,
        [classification_id]
      )
      return data.rows[0].classification_name
    } catch (error) {
      console.error("getClassificationNameById error:", error)
      return "Unknown Classification"
    }
  },

  // Check if classification already exists
  checkExistingClassification: async function(classification_name) {
    try {
      const sql = "SELECT * FROM classification WHERE classification_name = $1";
      const result = await pool.query(sql, [classification_name]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("checkExistingClassification error:", error);
      return false;
    }
  },

  // Add classification
  addClassification: async function(classification_name) {
    try {
      const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
      const result = await pool.query(sql, [classification_name]);
      return result.rows[0];
    } catch (error) {
      console.error("addClassification error:", error);
      return null;
    }
  },

  // Add inventory item
  addInventoryItem: async function(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
      const sql = `
        INSERT INTO public.inventory (
          inv_make, inv_model, inv_year, inv_description, inv_image, 
          inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      
      const data = await pool.query(sql, [
        inv_make, inv_model, inv_year, inv_description, inv_image, 
        inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      ]);
      
      return data.rows[0];
    } catch (error) {
      console.error("addInventoryItem error:", error);
      return null;
    }
  }
};

module.exports = invModel;