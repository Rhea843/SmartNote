import { MdPushPin } from "react-icons/md";
import { IoMdClock } from "react-icons/io";
import { FaTag } from "react-icons/fa6";


const WelcomeScreen = ({ user, notes, allTags, onNewNote }) => {

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

 const totalNotes = notes.filter(n => !n.deleted_at && !n.is_archived).length;
 const pinnedNotes = notes.filter(n => n.is_pinned && !n.deleted_at).length;

 const sevenDaysAgo = new Date();
 sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);


 const recentNotes = notes.filter(n => {
  if (!n.updated_at || n.deleted_at) return false;
 return new Date(n.updated_at) > sevenDaysAgo;
}).length;


  return (
    <div className="flex flex-col justify-center h-full px-8 text-center gap-8">

      <div className="flex flex-col items-center gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A1B25] mb-2">{getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋!</h1>
          <p className="text-gray-400 text-sm">Ready to capture your ideas?</p>
        </div>

        <div>
          <button
            onClick={onNewNote}
             className="flex items-center gap-2 bg-[#3A506A] text-white py-3 px-6 rounded-md hover:bg-[#254160] transition w-40" 
          >
           Add new note
          </button>
        </div>
        
      </div>

      


      <div className="grid grid-cols-2 gap-4 w-full ">
        
        <div className="bg-[#415A77]/20 rounded-md p-6 text-left shadow-full">
          <p className="text-2xl font-bold text-[#1A1B25]">{totalNotes}</p>
          <p className="text-xs text-gray-400 mt-1">Total Notes</p>
        </div>

        <div className="bg-[#415A77]/20 rounded-md p-6 text-left shadow-full">
          <div className="flex items-center gap-1 text-2xl font-bold text-[#1A1B25]">
            <MdPushPin className="text-xl" />
            {pinnedNotes}
          </div>
          <p className="text-xs text-gray-400 mt-1">Pinned</p>
        </div>
        
        <div className="bg-[#415A77]/20 rounded-md p-6 text-left shadow-full">
          <div className="flex items-center gap-1 text-2xl font-bold text-[#1A1B25]">
            <IoMdClock className="text-xl" />
            {recentNotes}
          </div>
          <p className="text-xs text-gray-400 mt-1">Recent (7 days)</p>
        </div>

        <div className="bg-[#415A77]/20 rounded-xl p-6 text-left shadow-full">
          <div className="flex items-center gap-1 text-2xl font-bold text-[#1A1B25]">
            <FaTag className="text-xl" />
            {allTags.length}
          </div>
          <p className="text-xs text-gray-400 mt-1">Tags</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
