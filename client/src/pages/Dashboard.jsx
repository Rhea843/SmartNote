import { useState, useEffect, useCallback , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar'
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import Topbar from '../components/Topbar';
import Bottombar from '../components/Bottombar';
import ArchivedNotes from '../components/ArchivedNotes.jsx';




const Dashboard = () => {
const [notes, setNotes] = useState([]);
const [showForm, setShowForm] = useState(false);
const [selectedNote, setSelectedNote] = useState(null); // null = new note, note object = editing
const [activeView, setActiveView] = useState('notes');
const [user, setUser] = useState(null);
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
const token = localStorage.getItem('token');
const navigate = useNavigate();
 

const selectedNoteRef = useRef(null);
const sortedNotes = [...notes].sort((a,b) => b.is_pinned - a.is_pinned);

useEffect(() => {
  selectedNoteRef.current = selectedNote;
}, [selectedNote]);

useEffect(() => {
  if (notes.length === 0) return;

  const isDesktop = window.innerWidth >= 768;
  const hasSelection = selectedNoteRef.current !== null;

  if (!hasSelection && isDesktop && !showForm) {
    setSelectedNote(notes[0]);
    setShowForm(true);
    setActiveView('notes');
  }
}, [notes, showForm]);

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
  setSelectedNote(data.note);
  await getNotes()

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
 setSelectedNote(data.note);
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

const togglePin = async (id) => {
  try{

    const token = localStorage.getItem('token');

    const res = await fetch(
      `http://localhost:8080/api/notes/${id}/pin`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const updatedNote = await res.json();

    setNotes(prevNotes => 
      prevNotes.map(note =>
        note.id === id ? updatedNote : note
      )
    );
  } catch (error){
    console.log(error);
  }
}

const toggleArchive = async (id) => {
  try{
    const token = localStorage.getItem('token');

    const res = await fetch(
      `http://localhost:8080/api/notes/${id}/archive`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const updatedNote = await res.json();

    setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
  } catch (error){
    console.log(error);
  }
};

console.log('archived notes:', notes.filter(note => note.is_archived))

  return (
    <div>
      <div className="flex flex-col h-screen pb-16 lg:pb-0">

        <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} user={user} />

        <div className="flex flex-1 overflow-hidden">
          {/* side bar */}
          <div className="hidden lg:block lg:basis-2/12 shrink-0">
           <Sidebar getNotes={getNotes} setActiveView={setActiveView} activeView={activeView} user={user} setShowForm={setShowForm}  setSelectedNote={setSelectedNote}  />
          </div>
       

         {/* note list */}
          
          {(activeView === 'notes' || activeView === 'archived') && (
            <div className="shrink-0 w-full  lg:w-4/12 transition-all duration-300"> 
            {activeView === 'notes' &&
              
              <NoteList 
                notes={sortedNotes.filter(note => !note.is_archived)} 
                onDelete={deleteNote} 
                onUpdate={updateNote} 
                onTogglePin={togglePin}
                onToggleArchive={toggleArchive}
                onSelectNote={(note) => {     
                setSelectedNote(note);
                setShowForm(true);
                  if(window.innerWidth < 1024) {
                    setActiveView(null);
                  } else{
                    setActiveView('notes');
                  }
                }}
              />
            }
              

            {activeView === 'archived' &&
              <ArchivedNotes
                notes={notes.filter(note => note.is_archived)} 
                onDelete={deleteNote} 
                onUpdate={updateNote} 
                onUnarchive={toggleArchive}
                onSelectNote={(note) => {     
                setSelectedNote(note);
                setShowForm(true);
                  if(window.innerWidth < 1024) {
                    setActiveView(null);
                  } else{
                    setActiveView('archived');
                  }
                }}
              />
            }
            </div>
          
          )}
          
         {/* note form */}
          {showForm && (
            <div className={`min-w-0 transition-all duration-300 ${activeView === 'notes' || activeView === 'archived' ? 'flex-1' : 'w-full'}`}>
              <NoteForm
                selectedNote={selectedNote}    
                onCreate={createNote}
                onUpdate={updateNote}
                onDelete={deleteNote}
                onToggleArchive={toggleArchive}
                onClose={() => {               
                  setShowForm(false);
                  setSelectedNote(null);
                  if (window.innerWidth < 1024) {
                    setActiveView('notes');
                  }
                }}
              />
            </div>
          )}
        </div>

        <Bottombar getNotes={getNotes} setActiveView={setActiveView} activeView={activeView}  setShowForm={setShowForm}  setSelectedNote={setSelectedNote} />
        
      </div>
    </div>
  )
}

export default Dashboard
