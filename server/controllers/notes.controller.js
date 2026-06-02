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
      GROUP BY notes.id
      ORDER BY notes.id DESC`, 
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

    const noteWithTags = await pool.query(
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

    res.json({
      message: "Note updated",
      note: noteWithTags.rows[0]
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