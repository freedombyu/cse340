const pool = require('../database/');
const bcrypt = require('bcryptjs');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(client_firstname, client_lastname, client_email, client_password) {
  try {
    // Hash the password before storing
    let hashedPassword
    try {
      // Regular password hashing
      hashedPassword = await bcrypt.hashSync(client_password, 10)
    } catch (error) {
      console.error("Password hashing error:", error)
      throw error
    }
    
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password)
      VALUES 
        ($1, $2, $3, $4)
      RETURNING *
    `
    return await pool.query(sql, [
      client_firstname,
      client_lastname,
      client_email,
      hashedPassword
    ])
  } catch (error) {
    console.error("Error in registerAccount model function:", error.message)
    return null
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(client_email) {
  try {
    const sql = `
      SELECT * FROM account 
      WHERE account_email = $1
    `
    const email = await pool.query(sql, [client_email])
    return email.rowCount
  } catch (error) {
    console.error("Error in checkExistingEmail:", error.message)
    throw error
  }
}

/* *****************************
*   Get account by ID
* *************************** */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email 
      FROM account 
      WHERE account_id = $1
    `
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error in getAccountById:", error.message)
    throw error
  }
}

/* *****************************
*   Update account information
* *************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = `
      UPDATE account 
      SET account_firstname = $1, account_lastname = $2, account_email = $3 
      WHERE account_id = $4 
      RETURNING *
    `
    const result = await pool.query(sql, [
      account_firstname, 
      account_lastname, 
      account_email, 
      account_id
    ])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error in updateAccount:", error.message)
    return false
  }
}

/* *****************************
*   Update account password
* *************************** */
async function updatePassword(hashedPassword, account_id) {
  try {
    const sql = `
      UPDATE account 
      SET account_password = $1 
      WHERE account_id = $2
    `
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error in updatePassword:", error.message)
    return false
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountById,
  updateAccount,
  updatePassword
}