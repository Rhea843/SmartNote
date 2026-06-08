import { MdPushPin } from "react-icons/md";
import { IoMdClock } from "react-icons/io";
import { FaTag } from "react-icons/fa6";
import { FaArchive } from "react-icons/fa";



const WelcomeScreen = ({ user, notes, allTags, onNewNote, setActiveView }) => {

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };


 const sevenDaysAgo = new Date();
 sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);


 const recentNotes = notes.filter(n => {
  if (!n.updated_at || n.deleted_at) return false;
 return new Date(n.updated_at) > sevenDaysAgo;
}).length;

const pinnedCount = notes.filter(
  note => note.is_pinned && !note.deleted_at
).length;

const archivedCount = notes.filter(
  note => note.is_archived && !note.deleted_at
).length;


  return (
    <div className="flex flex-col justify-center h-full px-8 text-center gap-8">

      <div className="flex flex-col items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1B25] mb-2">{getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋!</h1>
          <p className="text-gray-400 text-sm">Ready to capture your ideas?</p>
        </div>

        <div>
          <button
            onClick={onNewNote}
             className="flex items-center gap-2 bg-[#3A506A] text-white py-3 px-6 rounded-md hover:bg-[#1E2533] transition w-40" 
          >
           Add new note
          </button>
        </div>
        
      </div>

      {/* md screeens above */}
      <div className="hidden md:grid grid-cols-2 gap-4 w-full">

        <button
         onClick={() => setActiveView('notes')}
         className="bg-[#415A77]/20 rounded-md p-6 shadow-full flex items-center gap-3"
        >
          <div className="bg-[#2d5be3]/20 p-3 rounded-full w-11 h-11">
            <IoMdClock  className="text-xl text-[#2d5be3]" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xl font-bold text-[#1A1B25]">{recentNotes}</p>
            <p className="text-xs text-gray-400 font-medium">Recent Notes (7 days)</p>
          </div>
        </button>

        <button
         onClick={() => setActiveView('notes')}
         className="bg-[#415A77]/20 rounded-md p-6 shadow-full flex items-center gap-3"
        >
          <div className="bg-[#2d5be3]/20 p-3 rounded-full w-11 h-11">
            <MdPushPin className="text-xl text-[#2d5be3]" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xl font-bold text-[#1A1B25]">{pinnedCount}</p>
            <p className="text-xs text-gray-400 font-medium">Pinned Notes</p>
          </div>
        </button>

        <button
         onClick={() => setActiveView('archived')}
         className="bg-[#415A77]/20 rounded-md p-6 shadow-full flex items-center gap-3"
        >
          <div className="bg-[#2d5be3]/20 p-3 rounded-full w-11 h-11">
            <FaArchive  className="text-xl text-[#2d5be3]" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xl font-bold text-[#1A1B25]">{archivedCount}</p>
            <p className="text-xs text-gray-400 font-medium">Archived Notes</p>
          </div>
        </button>

        <button
         onClick={() => setActiveView('tags')}
          className="bg-[#415A77]/20 rounded-md p-6 shadow-full flex items-center gap-3"
        >
          <div className="bg-[#2d5be3]/20 p-3 rounded-full w-11 h-11">
            <FaTag className="text-xl text-[#2d5be3]" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xl font-bold text-[#1A1B25]">{allTags.length}</p>
            <p className="text-xs text-gray-400 font-medium">Tag Notes</p>
          </div>
        </button>
      
      </div>

     {/* Mobile screens */}
      <div className="md:hidden grid grid-cols-2 gap-4 w-full ">

        <button
         onClick={() => setActiveView('notes')}
         className="bg-[#415A77]/20 rounded-md p-4 shadow-full flex flex-col items-center gap-3"
        >
          <div className="bg-[#2d5be3]/20 p-3 rounded-full w-11 h-11">
            <IoMdClock  className="text-xl text-[#2d5be3]" />
          </div>
           
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl font-bold text-[#1A1B25]">{recentNotes}</p>
            <p className="text-sm text-gray-400 font-medium"> Recent Notes<br /> (7 days)</p>
          </div>
        </button>

        <button
         onClick={() => setActiveView('notes')}
         className="bg-[#415A77]/20 rounded-md p-6 shadow-full flex flex-col items-center gap-3"
        >
          <div className="bg-[#2d5be3]/20 p-3 rounded-full w-11 h-11">
            <MdPushPin className="text-xl text-[#2d5be3]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl font-bold text-[#1A1B25]">{pinnedCount}</p>
            <p className="text-sm text-gray-400 font-medium"> Pinned Notes</p>
          </div>
        </button>

        <button
         onClick={() => setActiveView('archived')}
         className="bg-[#415A77]/20 rounded-md p-6 shadow-full flex flex-col items-center gap-3"
        >
          <div className="bg-[#2d5be3]/20 p-3 rounded-full w-11 h-11">
            <FaArchive  className="text-xl text-[#2d5be3]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl font-bold text-[#1A1B25]">{archivedCount}</p>
            <p className="text-sm text-gray-400 font-medium"> Archived Notes</p>
          </div>
        </button>

        <button
         onClick={() => setActiveView('tags')}
          className="bg-[#415A77]/20 rounded-md p-6 shadow-full flex flex-col items-center gap-3"
        >
          <div className="bg-[#2d5be3]/20 p-3 rounded-full w-11 h-11">
            <FaTag className="text-xl text-[#2d5be3]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl font-bold text-[#1A1B25]">{allTags.length}</p>
            <p className="text-sm text-gray-400 font-medium"> Tag Notes</p>
          </div>
        </button>
      
      </div>
    </div>
  )
}

export default WelcomeScreen
