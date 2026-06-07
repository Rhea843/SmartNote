import { useState, useEffect, useCallback , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar'
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import Topbar from '../components/Topbar';
import Bottombar from '../components/Bottombar';
import ArchivedNotes from '../components/ArchivedNotes.jsx';
import TrashNote from '../components/TrashNote.jsx';
import TagNote from'../components/TagNote.jsx';
import WelcomeScreen from '../components/WelcomeScreen.jsx';
import API_URL from '../api/api.js';





const Dashboard = () => {
const [notes, setNotes] = useState([]);
const [showForm, setShowForm] = useState(false);
const [selectedNote, setSelectedNote] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [activeView, setActiveView] = useState(
  window.innerWidth >= 1024 ? 'notes' : null
);
const [user, setUser] = useState(null);
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
const [allTags, setAllTags] = useState([]);

const token = localStorage.getItem('token');
const navigate = useNavigate();
 

const selectedNoteRef = useRef(null);
const sortedNotes = [...notes].sort((a,b) => b.is_pinned - a.is_pinned);

useEffect(() => {
  selectedNoteRef.current = selectedNote;
}, [selectedNote]);


const getNotes = useCallback(async () => {
  if (!token) {
    navigate('/login');
    return;
  }

  try {
    setIsLoading(true);
    setError(null);

    const res = await fetch(`${API_URL}/api/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch notes');
    }

    const data = await res.json();
    setNotes(data.notes);

  } catch (err) {
    setError(err.message || 'Something went wrong');
  } finally {
    setIsLoading(false);
  }
}, [token, navigate]);

const createNote =  useCallback(async(title, content) => {
  const res = await fetch(`${API_URL}/api/notes`, {
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
  await fetch(`${API_URL}/api/notes/${id}`, {
    method: "DELETE",

    headers:{
      'Authorization': `Bearer ${token}`
    }
  });
  setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
};


const updateNote = useCallback(async (id, title, content) => {
const res = await fetch(`${API_URL}/api/notes/${id}`, {
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

  const res = await fetch(`${API_URL}/api/auth/me`, {
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

    const res = await fetch(
      `${API_URL}/api/notes/${id}/pin`,
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

    const res = await fetch(
      `${API_URL}/api/notes/${id}/archive`,
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

const moveToTrash = async(id) => {
  try{

    const res = await fetch(
      `${API_URL}/api/notes/${id}/trash`,
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

const restoreNote = async (id) => {
  try{

    const res = await fetch(
      `${API_URL}/api/notes/${id}/restore`,
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

const getTags = useCallback(async () => {
  const res = await fetch(`${API_URL}/api/tags`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  setAllTags(data);
}, [token]);

useEffect(() => {
  getNotes();
  getUser();
  getTags();
}, [getNotes, getUser, getTags]);


const addTagToNote = async(noteId, tagId) => {
    console.log('noteId:', noteId, 'tagId:', tagId);
  try{
    const res = await fetch(`${API_URL}/api/notes/${noteId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ tagId: Number(tagId) })
    });

    const updatedNote = await res.json();
    await getNotes();
    setSelectedNote(updatedNote);
  } catch (err) {
    console.error(err);
  } 
}

const removeTagFromNote = async (noteId, tagId) => {
  try{
    const res = await fetch(`${API_URL}/api/notes/${noteId}/tags/${tagId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const updatedNote = await res.json();
    await getNotes();
    setSelectedNote(updatedNote);
  } catch (err) {
    console.error(err);
  }
}

const createTag = async (name) => {
  try {
    const res = await fetch(`${API_URL}/api/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    const newTag = await res.json();
    setAllTags(prev => [...prev, newTag]);
  } catch (err) {
    console.error(err);
  }
};


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
          
          {(activeView === 'notes' || activeView === 'archived' || activeView === 'trash' || activeView === 'tags') && (
            <div className="shrink-0 w-full  lg:w-4/12 transition-all duration-300"> 
            {activeView === 'notes' &&
              
              <NoteList 
                notes={sortedNotes.filter(note => !note.is_archived && !note.deleted_at)} 
                isLoading={isLoading}
                error={error}
                moveToTrash={moveToTrash} 
                onUpdate={updateNote} 
                onTogglePin={togglePin}
                onToggleArchive={toggleArchive}
                onBack={() => setActiveView(null)}
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
                isLoading={isLoading}
                error={error}
                moveToTrash={moveToTrash} 
                onUpdate={updateNote} 
                onUnarchive={toggleArchive}
                onBack={() => setActiveView(null)}
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

            {activeView === 'trash' &&
              <TrashNote
                notes={notes.filter(note => note.deleted_at !== null)}
                isLoading={isLoading}
                error={error}
                onDelete={deleteNote}
                onRestore={restoreNote}
                onBack={() => setActiveView(null)}
                onSelectNote={(note) => {
                setSelectedNote(note);
                setShowForm(true);
                  if(window.innerWidth < 1024) {
                    setActiveView(null);
                  } else{
                    setActiveView('trash');
                  }
                }}
              />
            }
            
            {activeView === 'tags' && (
              <TagNote
                notes={notes.filter(note => !note.deleted_at)}
                allTags={allTags}
                onCreateTag={createTag}
                onBack={() => setActiveView(null)}
                onSelectNote={(note) => {
                  setSelectedNote(note);
                  setShowForm(true);
                  if (window.innerWidth < 1024) setActiveView(null);
                  else setActiveView('tags');
                }}
              />
           )}

            </div>
          
          )}
          
         {/* note form */}
            <div className={`min-w-0 transition-all duration-300 ${activeView === 'notes' || activeView === 'archived' ? 'flex-1' : 'w-full'}`}>
              {showForm ? (
                <NoteForm
                  selectedNote={notes.find(n => n.id === selectedNote?.id) || selectedNote}  
                  onCreate={createNote}
                  onUpdate={updateNote}
                  onDelete={moveToTrash}
                  onToggleArchive={toggleArchive}
                  moveToTrash={moveToTrash}
                  onAddTag={addTagToNote}
                  onRemoveTag={removeTagFromNote}
                  allTags={allTags}
                  onClose={() => {               
                    setShowForm(false);
                    setSelectedNote(null);
                    if (window.innerWidth < 1024) {
                      setActiveView(null);
                    }
                  }}
                />
              ):(
                  <WelcomeScreen
                    user={user}
                    notes={notes}
                    allTags={allTags}
                    setActiveView={setActiveView} 
                    onNewNote={() => {
                      setSelectedNote(null);
                      setShowForm(true);
                    }}
                  />
                )}

            </div>
        </div>

        <Bottombar getNotes={getNotes} setActiveView={setActiveView} activeView={activeView}  setShowForm={setShowForm}  setSelectedNote={setSelectedNote} />
        
      </div>
    </div>
  )
}

export default Dashboard
