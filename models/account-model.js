const getAccountById = async (account_id) => {
    try {
      const result = await pool.query(
        "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
        [account_id]
      );
      return result.rows[0];
    } catch (error) {
      return new Error("No matching account found");
    }
  };
  
  const updateAccount = async (account_firstname, account_lastname, account_email, account_id) => {
    try {
      const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
      const result = await pool.query(sql, [
        account_firstname,
        account_lastname,
        account_email,
        account_id
      ]);
      return result.rowCount > 0;
    } catch (error) {
      return new Error("Update failed");
    }
  };
  
  const updatePassword = async (account_password, account_id) => {
    try {
      const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
      const result = await pool.query(sql, [account_password, account_id]);
      return result.rowCount > 0;
    } catch (error) {
      return new Error("Password update failed");
    }
  };