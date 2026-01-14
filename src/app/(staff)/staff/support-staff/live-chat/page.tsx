import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";

export default function LiveChatPage() {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}
