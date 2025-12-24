export default function ChatLauncher({ open }: { open: () => void }) {
  return (
    <button
      onClick={open}
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg"
    >
      Chat
    </button>
  );
}
