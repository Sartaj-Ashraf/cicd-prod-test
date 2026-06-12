"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { QuestionList } from "@/components/dashboard/questions/QuestionList";
import { EditQuestionModal } from "@/components/dashboard/questions/EditQuestionModal";
import CreateQuestionDialog from "@/components/dashboard/questions/CreateQuestionDialog";

import {
  getAdminQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestion,
  Question,
  Chip,
  getAdminChips,
  createChip,
  deleteChip,
} from "@/services/questions/question.service";

import { Button } from "@/components/ui/button";
import { ChipList } from "@/components/dashboard/chips/ChipList";
import CreateChips from "@/components/dashboard/chips/CreateChip";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const [text, setText] = useState("");

  const [editId, setEditId] = useState("");
  const [editText, setEditText] = useState("");
  
  const [questionMode,setQuestionMode] = useState<"Private"|"Feedback">("Private");
  const [chips,setChips] = useState<Chip[]>([]);

  // ---------------- FETCH ----------------
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await getAdminQuestions();
      setQuestions(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchChips = async () => {
    try {
      setLoading(true);
      const res = await getAdminChips();
      setChips(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  
  useEffect(()=>{
     if(questionMode==="Feedback"){
       fetchChips()
     }
  },[questionMode])

  // ---------------- CREATE ----------------
  const handleCreate = async () => {
    if (!text.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    try {
      setCreating(true);

      const res = await createQuestion(text);

      // optimistic update
      setQuestions((prev) => [res.data, ...prev]);

      setText("");
      setCreateOpen(false);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateChip= async ()=>{
      if (!text.trim()) {
      toast.error("Chip cannot be empty");
      return;
    }

    try {
      setCreating(true);

      const res = await createChip(text);

      // optimistic update
      setChips((prev) => [res.data, ...prev]);

      setText("");
      setCreateOpen(false);
    } finally {
      setCreating(false);
    }
  }

  // ---------------- DELETE ----------------
  const handleDelete = async (id: string) => {
    await deleteQuestion(id);

    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  const handleDeleteChip= async(id:string)=>{
     await deleteChip(id);
     setChips(prev=>(prev.filter((chip:Chip)=>chip._id !== id)))
  }

  // ---------------- TOGGLE ----------------
  const handleToggle = async (id: string) => {
    await toggleQuestion(id);

    setQuestions((prev) =>
      prev.map((q) =>
        q._id === id ? { ...q, isActive: !q.isActive } : q
      )
    );
  };

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    if (!editText.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    try {
      setUpdating(true);

      await updateQuestion(editId, editText);

      setQuestions((prev) =>
        prev.map((q) =>
          q._id === editId ? { ...q, text: editText } : q
        )
      );

      setEditId("");
      setEditText("");
    } finally {
      setUpdating(false);
    }
  };

  return (
  <div className="min-h-screen select-none p-4">
    <div className="inline-flex items-center rounded-lg border border-border bg-card p-1 shadow-sm mb-10">
        <button
          onClick={() => setQuestionMode("Private")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            questionMode === "Private"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Private Questions
        </button>

        <button
          onClick={() => setQuestionMode("Feedback")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            questionMode === "Feedback"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Feedback Badges
        </button>
    </div>
      {questionMode === "Private" && <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="mb-2">Questions Panel</h4>
            <p className="text-muted-foreground">
              Manage your feedback questions
            </p>
          </div>

          <Button
            onClick={() => setCreateOpen(true)}
            className="py-5 bg-mango-orange!"
          >
            + Add Question
          </Button>
        </div>

        {/* LIST */}
        <QuestionList
          questions={questions}
          loading={loading}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={(q) => {
            setEditId(q._id);
            setEditText(q.text);
          }}
        />

        {/* EDIT MODAL */}
        <EditQuestionModal
          open={!!editId}
          text={editText}
          setText={setEditText}
          onClose={() => {
            setEditId("");
            setEditText("");
          }}
          onSave={handleUpdate}
          loading={updating}
        />

        {/* CREATE MODAL */}
        <CreateQuestionDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          text={text}
          setText={setText}
          onCreate={handleCreate}
          loading={creating}
        />
      </div>}

      {questionMode === "Feedback" && <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="mb-2">Chips Panel</h4>
            <p className="text-muted-foreground">
              Manage your Chips
            </p>
          </div>

          <Button
            onClick={() => setCreateOpen(true)}
            className="py-5 bg-mango-orange!"
          >
            + Add Chip
          </Button>
        </div>

        {/* LIST */}
        <ChipList
          chips={chips}
          loading={loading}
          onToggle={handleToggle}
          onDelete={handleDeleteChip}
          onEdit={(q) => {
            setEditId(q._id);
            setEditText(q.text);
          }}
        />

        {/* CREATE MODAL */}
        <CreateChips
          open={createOpen}
          onOpenChange={setCreateOpen}
          text={text}
          setText={setText}
          onCreate={handleCreateChip}
          loading={creating}
        />
      </div>}
    </div>
  );
}