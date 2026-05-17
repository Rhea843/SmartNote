import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar'
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';




const Dashboard = () => {
const [notes, setNotes] = useState([]);
const [showForm, setShowForm] = useState(false);
const [selectedNote, setSelectedNote] = useState(null); // null = new note, note object = editing
const [activeView, setActiveView] = useState('notes');
const [user, setUser] = useState(null);
const token = localStorage.getItem('token');
const navigate = useNavigate();

  
const getNotes = useCallback(async () => {

  if (!token) {
  navigate('/login');
  return;
}

  const res = await fetch('http://localhost:8080/api/notes', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  setNotes(data.notes);
}, [token, navigate]);

useEffect(() => { 
  getNotes();
}, [getNotes])

const createNote =  useCallback(async(title, content) => {
  const res = await fetch('http://localhost:8080/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, content })
  });
  const data = await res.json();
  setNotes(prevNotes => [...prevNotes, data.note]);
},[token]);


const deleteNote = async (id) => {
  await fetch(`http://localhost:8080/api/notes/${id}`, {
    method: "DELETE",

    headers:{
      'Authorization': `Bearer ${token}`
    }
  });
  setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
};


const updateNote = useCallback(async (id, title, content) => {
const res = await fetch(`http://localhost:8080/api/notes/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ title, content })
});

const data = await res.json();
  
 setNotes(prevNotes => prevNotes.map(note => note.id === id ? data.note : note));
}, [token]);

const getUser = useCallback(async () => {
  if (!token) return;

  const res = await fetch('http://localhost:8080/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  setUser(data.user);
}, [token]);

useEffect(() => {
  getNotes();
  getUser();
}, [getNotes, getUser]);

  return (
    <div>
      <div className="flex">
        <div className="w-1/6">
         <Sidebar getNotes={getNotes} setActiveView={setActiveView} activeView={activeView} user={user} />
        </div>
        <div className="w-2/8">
          {activeView === 'notes' && 
            <NoteList 
              notes={notes} 
              onDelete={deleteNote} 
              onUpdate={updateNote} 
              onSelectNote={(note) => {     
              setSelectedNote(note);
              setShowForm(true);
              }}
            />
          }
        </div>
        <div className="w-3/6 h-screen">
          {showForm && (
            <NoteForm
              selectedNote={selectedNote}    
              onCreate={createNote}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onClose={() => {               
                setShowForm(false);
                setSelectedNote(null);
              }}
            />
         )}
        </div>
          
      </div>
    </div>
  )
}

export default Dashboard
