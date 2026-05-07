SCHEMA

users
- id (UUID or SERIAL)
- name
- email (unique)
- password_hash
- created_at

notes
- id
- user_id (FK → users.id)
- title
- content
- is_pinned (boolean)
- is_archived (boolean)
- deleted_at (nullable timestamp)
- created_at
- updated_at

tags
- id
- user_id (FK → users.id)
- name
- created_at

note_tags
- note_id (FK → notes.id)
- tag_id (FK → tags.id)

API ENDPOINTS

REGISTER USER:
POST /api/auth/register
BODY:
{
  "name": "Victoria",
  "email": "vic@email.com",
  "password": "123456"
}

LOGIN USER:
POST /api/auth/login
RESPONSE:
{
  "token": "JWT_TOKEN"
}


CREATE A NOTE:
 POST /api/notes
 BODY:
 {
  "title": "My first note",
  "content": "This is content"
}

GET ALL NOTES:
GET /api/notes

SEARCH/FILTER/PAGINATION
/api/notes?search=meeting&isPinned=true

GET A NOTE:
GET /api/notes/:id

UPDATE NOTE:
 PUT /api/notes/:id

SOFT DELETE NOTE(move to trash)
 DELETE /api/notes/:id

GET TRASH NOTES:
GET /api/notes/trash

RESTORE NOTE:
 PATCH /api/notes/:id/restore

PERMANENTLY DELETE NOTE
 DELETE /api/notes/:id/permanent

PIN NOTE
 PATCH /api/notes/:id/pin

ARCHIVE NOTE:
PATCH /api/notes/:id/archive

