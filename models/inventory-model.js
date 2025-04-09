// models/inventory-model.js
const pool = require("../database/")

const invModel = {};

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
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
  }
}

/* ***************************
 *  Get inventory item by inventory_id
 * ************************** */
async function getInventoryByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByInventoryId error " + error)
  }
}

/* ***************************
 *  Get classification name by classification_id
 * ************************** */
async function getClassificationNameById(classification_id) {
  try {
    const data = await pool.query(
      `SELECT classification_name FROM public.classification WHERE classification_id = $1`,
      [classification_id]
    )
    return data.rows[0].classification_name
  } catch (error) {
    console.error("getClassificationNameById error " + error)
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    
    const data = await pool.query(sql, [classification_name])
    
    return data.rows[0]
  } catch (error) {
    console.error("addClassification error: " + error)
    return null
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventoryItem(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    
    const data = await pool.query(sql, [
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id
    ])
    
    return data.rows[0]
  } catch (error) {
    console.error("addInventoryItem error: " + error)
    return null
  }
}

// Check if classification already exists
invModel.checkExistingClassification = async function(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0;
  } catch (error) {
    return error.message;
  }
};

// Add new classification to database
invModel.addClassification = async function(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

// Get all classifications
invModel.getClassifications = async function() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name";
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    return error.message;
  }
};

// Add new inventory item
invModel.addInventoryItem = async function(inventoryData) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const params = [
      inventoryData.classification_id,
      inventoryData.inv_make,
      inventoryData.inv_model,
      inventoryData.inv_description,
      inventoryData.inv_image,
      inventoryData.inv_thumbnail,
      inventoryData.inv_price,
      inventoryData.inv_year,
      inventoryData.inv_miles,
      inventoryData.inv_color
    ];
    
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

// Check if classification already exists
invModel.checkExistingClassification = async function(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0;
  } catch (error) {
    return error.message;
  }
};

// Add new classification to database
invModel.addClassification = async function(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

// Get all classifications
invModel.getClassifications = async function() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name";
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  getClassificationNameById,
  addClassification,
  addInventoryItem
}