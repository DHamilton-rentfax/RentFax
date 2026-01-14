'use client';

import { useEffect, useState } from "react";

// Modal component for flagging AI responses
function FlagModal({ message, thread, onClose, onFeedbackSubmit }: { message: Message, thread: any, onClose: () => void, onFeedbackSubmit: () => void }) {
  const [corrected, setCorrected] = useState("");
  const [reason, setReason] = useState("accuracy");
  const [severity, setSeverity] = useState(1);

  async function submit() {
    // A real implementation would require a more robust way to find the original user message
    const originalQuery = "Could not automatically determine query"; 

    await fetch("/api/support/ai-feedback", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId: thread.id,
        messageId: message.id,
        originalQuery,
        aiResponse: message.text,
        correctedResponse: corrected,
        improvementType: reason,
        context: thread.context,
        userRole: thread.userRole,
        severity
      }),
    });

    onFeedbackSubmit();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] space-y-4">
        <h2 className="font-semibold text-lg">Flag AI Response</h2>

        <div className="text-sm bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold">Original AI Response:</p>
            <p>{message.text}</p>
        </div>

        <select
          className="border p-2 rounded w-full"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="accuracy">Inaccurate</option>
          <option value="clarity">Unclear</option>
          <option value="missing_info">Missing Info</option>
          <option value="wrong_role">Wrong Role Context</option>
          <option value="policy_violation">Policy Violation</option>
        </select>

        <textarea
          className="border p-2 rounded w-full h-32"
          placeholder="Provide the correct and complete answer..."
          value={corrected}
          onChange={(e) => setCorrected(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full"
          value={severity}
          onChange={(e) => setSeverity(parseInt(e.target.value))}
        >
          <option value={1}>Severity 1: Minor mistake</option>
          <option value={2}>Severity 2: Moderate impact</option>
          <option value={3}>Severity 3: Critical error</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={submit} disabled={!corrected}>
            Submit Correction
          </button>
        </div>
      </div>
    </div>
  );
}


interface Message {
  id: string;
  sender: string;
  text: string;
  createdAt: any;
}

interface Note {
    id: string;
    createdByRole: string;
    createdAt: any;
    category: string;
    note: string;
    escalationLevel: string;
}

function AssignmentPanel({ threadId, thread, onUpdate }: { threadId: string, thread: any, onUpdate: () => void }) {
  const [staff, setStaff] = useState([]);
  const [selected, setSelected] = useState(thread.assignedTo || "");

  useEffect(() => {
    fetch("/api/admin/staff")
      .then(res => res.json())
      .then(data => setStaff(data.staff));
  }, []);

  async function assign() {
    const person = staff.find(s => s.uid === selected);
    await fetch(`/api/support/inbox/${threadId}/assign`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        staffId: person?.uid || null,
        staffName: person?.name || null,
      }),
    });
    onUpdate();
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="font-semibold mb-2">Assignment</h2>

      <select
        className="border rounded-lg p-2 w-full"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Unassigned</option>
        {staff.map((s: any) => (
          <option key={s.uid} value={s.uid}>
            {s.name} ({s.role})
          </option>
        ))}
      </select>

      <button
        onClick={assign}
        className="mt-3 bg-blue-600 text-white px-3 py-2 rounded-lg w-full"
      >
        {selected ? 'Assign' : 'Unassign'}
      </button>
    </div>
  );
}

function SettingsPanel({ threadId, thread, onUpdate }: { threadId: string, thread: any, onUpdate: () => void }) {
    const [category, setCategory] = useState(thread.category || 'general');
    const [priority, setPriority] = useState(thread.priority || 'normal');

    async function updateSettings() {
        await fetch(`/api/support/inbox/${threadId}/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, priority }),
        });
        onUpdate();
    }

    return (
        <div className="border rounded-lg p-4 bg-white">
            <h2 className="font-semibold mb-2">Settings</h2>
            <div className="space-y-3">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-lg p-2"
                >
                    <option value="general">General</option>
                    <option value="billing">Billing</option>
                    <option value="incident">Incident</option>
                    <option value="identity">Identity</option>
                    <option value="technical">Technical</option>
                    <option value="account">Account</option>
                </select>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border rounded-lg p-2"
                >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
                <button
                    onClick={updateSettings}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg w-full"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
}

function InternalNotes({ threadId }: { threadId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [category, setCategory] = useState("user_confusion");
  const [escalation, setEscalation] = useState("none");

  async function loadNotes() {
    const res = await fetch(`/api/support/inbox/${threadId}/notes`);
    const data = await res.json();
    setNotes(data.notes);
  }

  useEffect(() => {
    loadNotes();
  }, [threadId]);

  async function addNote() {
    await fetch(`/api/support/inbox/${threadId}/notes`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        note: newNote,
        category,
        escalationLevel: escalation,
      }),
    });

    setNewNote("");
    loadNotes();
  }

  return (
    <div className="border rounded-xl p-4 bg-white mt-6">
      <h2 className="text-xl font-semibold mb-4">Internal Notes</h2>
      <textarea
        className="w-full border p-3 rounded-lg mb-2"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add internal note..."
      />

      <div className="flex gap-4 mb-4 items-center">
        <select
          className="border rounded p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="user_confusion">User Confusion</option>
          <option value="AI_correction">AI Correction</option>
          <option value="policy">Policy Issue</option>
          <option value="bug">Product Bug</option>
        </select>

        <select
          className="border rounded p-2"
          value={escalation}
          onChange={(e) => setEscalation(e.target.value)}
        >
          <option value="none">No Escalation</option>
          <option value="support_admin">Escalate to Support Admin</option>
          <option value="super_admin">Escalate to Super Admin</option>
        </select>

        <button
          onClick={addNote}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          disabled={!newNote}
        >
          Add Note
        </button>
      </div>

      <ul className="space-y-4">
        {notes.map(n => (
          <li
            key={n.id}
            className="border rounded-lg p-3 bg-gray-50"
          >
            <div className="text-sm text-gray-600 mb-1">
              {n.createdByRole} • {n.createdAt && new Date(n.createdAt._seconds * 1000).toLocaleString()}
            </div>
            <div className="font-medium mb-1">{n.category}</div>
            {n.note}

            {n.escalationLevel !== "none" && (
              <div className="text-xs text-red-600 mt-2 font-semibold">
                Escalated: {n.escalationLevel}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default function ThreadView({ params }: { params: { threadId: string } }) {
  const { threadId } = params;

  const [thread, setThread] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  async function loadThread() {
    setLoading(true);
    const res = await fetch(`/api/support/inbox/${threadId}`);
    const data = await res.json();
    setThread({ id: threadId, ...data.thread });
    setMessages(data.messages);
    setLoading(false);
  }

  useEffect(() => {
    loadThread();
  }, [threadId]);

  function openFlagModalFor(message: Message) {
    setSelectedMessage(message);
    setShowFlagModal(true);
  }

  function handleFeedbackSubmit() {
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 3000); // Hide banner after 3 seconds
  }

  if (loading || !thread) {
    return <div className="max-w-6xl mx-auto py-10"><p>Loading thread...</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      {showSuccessBanner && (
          <div className="fixed top-5 right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50">
              AI feedback submitted successfully!
          </div>
      )}
      {showFlagModal && selectedMessage && (
          <FlagModal 
            message={selectedMessage} 
            thread={thread} 
            onClose={() => setShowFlagModal(false)} 
            onFeedbackSubmit={handleFeedbackSubmit}
          />
      )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Support Thread</h1>
                    <span className="text-sm font-mono text-gray-500">ID: {threadId}</span>
                </div>
                <div className="border rounded-xl p-4 bg-white">
                    {messages.map((m) => (
                        <div key={m.id} className="py-4 border-b last:border-b-0">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm font-semibold ${
                                    m.sender === 'user' ? 'text-blue-600' : 'text-gray-700'
                                }`}>
                                    {m.sender.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {m.createdAt && new Date(m.createdAt._seconds * 1000).toLocaleString()}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-800">{m.text}</p>
                            {m.sender === "bot" && (
                                <button
                                    onClick={() => openFlagModalFor(m)}
                                    className="text-xs text-red-600 hover:underline mt-2"
                                >
                                    Flag AI Response
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <InternalNotes threadId={threadId} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sticky top-10">
                <AssignmentPanel threadId={threadId} thread={thread} onUpdate={loadThread} />
                <SettingsPanel threadId={threadId} thread={thread} onUpdate={loadThread} />
            </div>
        </div>
    </div>
  );
}
