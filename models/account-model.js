const pool = require('../database/');
const bcrypt = require('bcryptjs');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ]);
  } catch (error) {
    console.error("model error: " + error);
    return null;
  }
}

/* ****************************
 *   Check for existing email
 * ************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    console.error("Error in checkExistingEmail: " + error);
    return 0;
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in getAccountByEmail: " + error);
    return null;
  }
}

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in getAccountById: " + error);
    return null;
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
  getAccountByEmail,  
  updateAccount,
  updatePassword
}