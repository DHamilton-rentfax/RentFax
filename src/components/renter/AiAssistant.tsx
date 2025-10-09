'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { db, auth } from '@/firebase/client'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

async function saveMessage(role:string,text:string){
  const user = auth.currentUser
  if(!user) return
  await addDoc(collection(db,'chatHistory'),{uid:user.uid,role,text,createdAt:serverTimestamp()})
}

export default function AiAssistant() {
  const [msg, setMsg] = useState('')
  const [chat, setChat] = useState<{role:string,text:string}[]>([])
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!msg.trim()) return;
    setLoading(true);
    const newChat = [...chat, { role:'user', text: msg }];
    setChat(newChat);
    await saveMessage('user', msg);
    setMsg('');

    try {
      const res = await fetch('/api/ai/analyze-dispute', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      setChat([...newChat, { role:'ai', text: data.reply }])
      await saveMessage('ai', data.reply);
    } catch (error) {
      const errorMsg = 'Sorry, I am having trouble connecting. Please try again.';
      setChat([...newChat, { role: 'ai', text: errorMsg }])
      await saveMessage('ai', errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-2xl w-80 border">
      <div className="h-64 overflow-y-auto space-y-4 text-sm p-2">
        {chat.map((c,i)=>(
          <div key={i} className={`flex ${c.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <p className={`p-2 rounded-lg max-w-[90%] ${c.role==='ai'?'bg-muted text-foreground':'bg-primary text-primary-foreground'}`}>
              <strong>{c.role==='ai'?'AI: ':'You: '}</strong>{c.text}
            </p>
          </div>
        ))}
         {loading && <div className="text-center text-muted-foreground">Thinking...</div>}
      </div>
      <div className="flex mt-2">
        <Input 
          value={msg} 
          onChange={(e)=>setMsg(e.target.value)} 
          placeholder="Ask RentFAX AI..." 
          onKeyPress={(e) => e.key === 'Enter' && send()}
          disabled={loading}
        />
        <Button onClick={send} className="ml-2" disabled={loading}><Send className="w-4 h-4"/></Button>
      </div>
    </div>
  )
}
