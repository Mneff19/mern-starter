const pool = require("../database/")

/* ***************************
 *  Get all reviews by inv_id
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT r.*, a.account_firstname, a.account_lastname
            FROM public.review AS r
            JOIN public.account AS a
            ON r.account_id = a.account_id
            JOIN public.inventory AS i 
            ON r.inv_id = i.inv_id 
            WHERE r.inv_id = $1
            ORDER BY r.review_date DESC`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getReviewsByInventoryId error " + error)
    }
}

/* ***************************
 *  Get all reviews by account_id
 * ************************** */
async function getReviewsByAccountId(account_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.review AS r
            JOIN public.account AS a 
            ON r.account_id = a.account_id 
            WHERE r.account_id = $1
            ORDER BY r.review_date DESC`,
            [account_id]
        )
        return data.rows
    } catch (error) {
        console.error("getReviewsByAccountId error " + error)
    }
}

/* *****************************
*   Add new review
* *************************** */
async function addReview (review_text, inv_id, account_id){
    try {
      const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
      return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
      return error.message
    }
  }

module.exports = {getReviewsByInventoryId, getReviewsByAccountId, addReview};