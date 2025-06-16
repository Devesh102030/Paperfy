import { useEffect, useState } from "react";
import axios from "axios";


export default function Notes({ paperId, userId }: { paperId: string, userId: string }) {
    const [notes, setnotes] = useState<string[]>([]);
    const [text,settext] = useState<string>("");

    useEffect(()=>{
        async function fetchNotes(){
            const res = await axios.get("/api/getnotes",{
                params:{
                    userId,
                    paperId
                }
            })
            setnotes(res.data.notes);
        }
        fetchNotes();
    },[])

    async function saveNotes(content: string){
        const res = await axios.post("/api/savenotes",{
            content,
            paperId,
            userId
        })
    }
    
  return (
    <div className="flex flex-col h-full">

        <div className="p-4 border-b dark:border-neutral-700">
            <h3 className="font-semibold text-lg dark:text-white">Notes</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!notes.length ? 
                (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-neutral-400">
                        Notes will appear here
                    </div>
                ) : 
                (
                    notes.map((note, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 rounded-lg break-words bg-gray-200 text-black text-sm self-start mr-auto"
                            style={{ maxWidth: "80%", width: "fit-content" }}
                        >
                            {note}
                        </div>
                    ))
                )
            }
        </div>

        <div className="p-4 border-t dark:border-neutral-700">
            <div className="flex gap-2">
                <input
                    value={text}
                    onKeyDown={async (e) => {
                        if(e.key === "Enter"){
                            const temp = text;
                            settext("");
                            setnotes([...notes,temp]);
                            await saveNotes(temp);
                        }
                    }}
                    onChange={(e) => settext(e.target.value)}
                    type="text"
                    placeholder="Type your notes here..."
                    className="flex-1 border rounded-lg px-4 py-2 dark:bg-neutral-700 dark:border-neutral-600"
                />
                <button
                    onClick={async () => {
                        const temp = text;
                        settext("");
                        setnotes([...notes,temp]);
                        await saveNotes(temp);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Save
                </button>
            </div>
        </div>
    </div>
  );
}
