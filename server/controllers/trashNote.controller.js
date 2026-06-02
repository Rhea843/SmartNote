import pool from '../db/db.js';

export const moveToTrash = async (req, res) => {
  try{
    const{ id } = req.params;
    const userId = req.user.id;

    const note = await pool.query(
      `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if(note.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updated = await pool.query(
      `UPDATE notes
      SET deleted_at = NOW(),
          updated_at = now()
      WHERE id =  $1
      RETURNING *`,
      [id]   
    );

    res.json(updated.rows[0]);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const restoreNote = async (req, res) => {
  try{
    const { id } = req.params;
    const userId = req.user.id;


    const updated = await pool.query(
      `UPDATE notes 
      SET deleted_at = NULL,
       updated_at = now()
      WHERE id = $1 and user_id = $2
      RETURNING *`,
      [id, userId]
    );

    res.json(updated.rows[0]);
  } catch (error) {
    console.error('Error restoring note:', error);
    res.status(500).json({ message: 'Error restoring note' });
  }
};