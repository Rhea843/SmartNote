
import pool from '../db/db.js';

export const addTagToNote = async (req, res) => {
  
  try{
    const {noteId} = req.params;
    const {tagId} = req.body;
    const userId = req.user.id;


    const note = await pool.query(
      `SELECT * FROM notes WHERE Id = $1 AND user_id = $2`,
      [noteId, userId]
    )

    if(note.rowCount === 0){
      return res.status(404).json({error: 'Note not found'});
    }
    await pool.query(
      `INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [noteId, tagId]
    );

    const updated = await pool.query(
      `SELECT notes.*, 
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', tags.id, 'name', tags.name)
          ) FILTER (WHERE tags.id IS NOT NULL), 
          '[]'
        ) AS tags
      FROM notes
      LEFT JOIN note_tags ON notes.id = note_tags.note_id
      LEFT JOIN tags ON note_tags.tag_id = tags.id
      WHERE notes.id = $1
      GROUP BY notes.id`,
      [noteId]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
};


export const removeTagFromNote = async (req, res) => {
  try{
    const {noteId, tagId} = req.params;
    const userId = req.user.id;

    const note = await pool.query(
      `SELECT * FROM notes WHERE Id = $1 AND user_id = $2`,
      [noteId, userId]
    )

    if(note.rowCount === 0){
      return res.status(404).json({error: 'Note not found'});
    }

    await pool.query(
      `DELETE FROM note_tags WHERE note_id = $1 AND tag_id = $2`,
      [noteId, tagId]
    );

    const updated = await pool.query(
      `SELECT notes.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', tags.id, 'name', tags.name)
          ) FILTER (WHERE tags.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM notes
      LEFT JOIN note_tags ON notes.id = note_tags.note_id
      LEFT JOIN tags ON note_tags.tag_id = tags.id
      WHERE notes.id = $1
      GROUP BY notes.id`,
      [noteId]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
};


export const getNotesByTag = async (req, res) => {
  try{
    const {tagId} = req.params;
    const userId = req.user.id;


    const notes = await pool.query(
      `SELECT notes.*, 
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', tags.id, 'name', tags.name)
          ) FILTER (WHERE tags.id IS NOT NULL), 
          '[]'
        ) AS tags
      FROM notes
      LEFT JOIN note_tags ON notes.id = note_tags.note_id
      LEFT JOIN tags ON note_tags.tag_id = tags.id
      WHERE notes.user_id = $1
      AND notes.id IN (
        SELECT note_id FROM note_tags WHERE tag_id = $2
      )
      GROUP BY notes.id
      ORDER BY notes.id DESC`,
      [userId, tagId]
    );

    res.json({notes: notes.rows});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
}