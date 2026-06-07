import pool from '../db/db.js';


export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;


    const existing = await pool.query(
      `SELECT * FROM tags WHERE name = $1 AND user_id = $2`,
      [name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Tag already exists' });
    }

    const tag = await pool.query(
      `INSERT INTO tags (name, user_id) VALUES ($1, $2) RETURNING *`,
      [name, userId]
    );

    res.status(201).json(tag.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTags = async (req, res) => {

  try {
    const userId = req.user.id;
    const tags = await pool.query(`SELECT * FROM tags WHERE user_id = $1 ORDER BY name ASC`, [userId]);
    res.json(tags.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};