import pool from '../db/db.js';

export const togglePin = async(req, res) => {
  try{
    const { id } = req.params;
    const userId = req.user.id;

    const note = await pool.query(
      `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if(note.rows.length === 0) {
      return res.status(404).json({
        message: 'Note not found'
      })
    }

    const updated = await pool.query(
      `UPDATE notes 
      SET is_pinned = NOT is_pinned,
       updated_at = NOW() 
     WHERE id = $1
      RETURNING * `,
      [id]
    );

    res.json(updated.rows[0]);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
  
}


