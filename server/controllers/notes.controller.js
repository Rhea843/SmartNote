import pool from '../db/db.js';

//create note
export const createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const {title, content} = req.body;

    const newNote = await pool.query(
      `INSERT INTO notes(user_Id, title, content) 
      VALUES($1, $2, $3)
      RETURNING *`, 
      [userId, title, content]
    );
    res.status(201).json({
      message: "Note created",
      note: newNote.rows[0]
    }); 


  } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
  }
};

//get notes

export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;


    const notes = await pool.query(
      `SELECT * FROM notes
       WHERE user_id = $1
       ORDER BY id DESC`, 
      [userId]
    );

    res.json({notes: notes.rows});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

//update note

export const updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    const { title, content } = req.body;

    const updated = await pool.query(
      `UPDATE notes
       SET title = $1, 
        content = $2,
        updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, content, noteId, userId]
    );

    if (updated.rows.length === 0) {
      return res.status(404).send({error: "Note not found"});
    }

    res.json({
      message: "Note updated",
      note: updated.rows[0]
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

//delete note

export const deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    const deleted = await pool.query(
      `DELETE FROM notes
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [noteId, userId]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).send({error: "Note not found"});
    }

    res.json({message: "Note deleted"});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};