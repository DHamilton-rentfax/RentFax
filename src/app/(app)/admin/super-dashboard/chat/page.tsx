
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, Plus } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      const snap = await getDocs(collection(db, "chats"));
      const data: any[] = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setChats(data);
      setLoading(false);
    }
    fetchChats();
  }, []);

  async function createNewChat() {
    if (!user) return;

    // 1. Create the chat session
    const chatRef = await addDoc(collection(db, "chats"), {
        customerName: "New Customer",
        status: "PENDING",
        createdAt: new Date().toISOString(),
        messages: []
    });

    // 2. Find all ADMINs and CUSTOMER_SUPPORT staff
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "in", ["ADMIN", "CUSTOMER_SUPPORT"]));
    const supportStaffSnap = await getDocs(q);

    if (supportStaffSnap.empty) {
        console.error("No support staff found to notify!");
        return;
    }

    // 3. Create a notification for each staff member
    const notificationPromises = supportStaffSnap.docs.map(staffDoc => {
        return addDoc(collection(db, "notifications"), {
            message: `New chat request from a customer.`,
            type: "CHAT_NEW",
            link: `/admin/super-dashboard/chat/${chatRef.id}`,
            read: false,
            createdAt: new Date().toISOString(),
            userId: staffDoc.id, // Assign to the specific staff member
            sendEmail: true, 
            emailSent: false,
            priority: "high", // Add priority
        });
    });

    await Promise.all(notificationPromises);

    alert(`New chat created and notifications sent to all available support staff.`);
    
    // Refresh list
    const newChat = { id: chatRef.id, customerName: "New Customer", status: "PENDING" };
    setChats([newChat, ...chats]);
  }

  if (loading) {
    return <p className="p-6 text-gray-500">Loading chats...</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Live Chat Support</h1>
      
      <div className="mb-6">
        <button onClick={createNewChat} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
          <Plus className="w-5 h-5 mr-2"/> (DEMO) Simulate New Chat Request
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold p-4 border-b">Active Chat Sessions</h2>
        {chats.length > 0 ? (
            chats.map(c => (
                <div key={c.id} className="flex items-center p-4 border-b">
                    <MessageSquare className="w-6 h-6 text-gray-500" />
                    <div className="ml-4 flex-grow">
                        <p className="font-semibold">{c.customerName}</p>
                        <p className="text-sm text-gray-500">Status: <span className="font-medium text-green-600">{c.status}</span></p>
                    </div>
                    <button className="text-sm text-blue-500 hover:underline">Open Chat</button>
                </div>
            ))
        ) : (
            <p className="p-6 text-center text-gray-500">No active chats.</p>
        )}
      </div>
    </div>
  );
}
