export default function ChatMessageBubble({ msg }: any) {
  const mine = msg.senderRole === "SUPPORT_STAFF";

  return (
    <div
      className={`max-w-sm p-3 rounded-lg ${
        mine ? "bg-blue-100 ml-auto" : "bg-gray-200 mr-auto"
      }`}
    >
      <p>{msg.message}</p>
      <p className="text-xs text-gray-500 mt-1">{msg.senderRole}</p>
    </div>
  );
}
