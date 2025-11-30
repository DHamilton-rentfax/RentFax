"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { MessageSquare, X, Send } from "lucide-react";

import { db } from "@/firebase/client";
import { useAuth } from "@/hooks/use-auth";


export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !chatId) return;

    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("createdAt", "asc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setMessages(list);
    });
    return () => unsub();
  }, [user, chatId]);

  const getOrCreateChat = async () => {
    if (!user) return;

    const chatRef = doc(db, "chats", user.uid); // Use user UID as chat ID for simplicity
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        userId: user.uid,
        userName: user.email, // Or display name
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        status: "new",
      });
    }
    setChatId(user.uid);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !chatId) {
      getOrCreateChat();
    }
  };

  async function sendMessage() {
    if (!chatId || !message.trim() || !user) return;
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      senderId: user.uid,
      text: message,
      createdAt: serverTimestamp(),
    });
    await setDoc(
      doc(db, "chats", chatId),
      {
        lastMessageAt: serverTimestamp(),
        lastMessageText: message,
        status: "open",
      },
      { merge: true },
    );
    setMessage("");
  }

  return (
    <div>
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white shadow-2xl rounded-lg flex flex-col">
          <div className="p-3 bg-blue-600 text-white rounded-t-lg">
            <h3 className="font-bold">Live Chat</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.senderId === user?.uid ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs ${m.senderId === user?.uid ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 flex border-t">
            <input
              className="flex-1 border rounded-full px-4 py-2"
              value={message}
              onChange={(e) => setMessage(e.taget.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-2 bg-blue-600 text-white rounded-full"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
