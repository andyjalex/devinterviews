"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addSubmission,
  INTERVIEW_STAGES,
  type InterviewStage,
} from "@/lib/submissions";

const fieldClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 text-base placeholder-gray-400 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

let rowKey = 0;
const newRow = () => ({ key: ++rowKey, text: "" });

export default function SubmissionForm() {
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [stage, setStage] = useState<InterviewStage>(INTERVIEW_STAGES[1]);
  const [questions, setQuestions] = useState([newRow()]);
  const [narrative, setNarrative] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateQuestion(key: number, text: string) {
    setQuestions((rows) =>
      rows.map((row) => (row.key === key ? { ...row, text } : row)),
    );
  }

  function addQuestion() {
    setQuestions((rows) => [...rows, newRow()]);
  }

  function removeQuestion(key: number) {
    setQuestions((rows) =>
      rows.length === 1 ? rows : rows.filter((row) => row.key !== key),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const id = await addSubmission({
        company: company.trim(),
        role: role.trim(),
        interviewDate,
        stage,
        questions: questions.map((q) => q.text),
        narrative: narrative.trim(),
        authorName: anonymous ? null : authorName,
      });
      router.push(`/interviews/${id}`);
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong saving your story. Check your Firebase config and try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form className="flex w-full max-w-xl flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <label className={labelClass} htmlFor="company">
          Company name
        </label>
        <input
          id="company"
          name="company"
          className={fieldClass}
          placeholder="e.g. Monzo"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="role">
          Role
        </label>
        <input
          id="role"
          name="role"
          className={fieldClass}
          placeholder="e.g. Senior Frontend Engineer"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <label className={labelClass} htmlFor="interviewDate">
            Interview date
          </label>
          <input
            id="interviewDate"
            name="interviewDate"
            type="date"
            className={fieldClass}
            required
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className={labelClass} htmlFor="stage">
            Stage / type
          </label>
          <select
            id="stage"
            name="stage"
            className={fieldClass}
            value={stage}
            onChange={(e) => setStage(e.target.value as InterviewStage)}
          >
            {INTERVIEW_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelClass}>Questions you were asked</legend>
        <p className="-mt-1 text-sm text-gray-500">
          Add as many as you remember — one per row.
        </p>
        {questions.map((row, index) => (
          <div key={row.key} className="flex gap-2">
            <input
              className={fieldClass}
              placeholder={`Question ${index + 1}`}
              value={row.text}
              onChange={(e) => updateQuestion(row.key, e.target.value)}
            />
            <button
              type="button"
              className="shrink-0 rounded-lg border border-gray-300 px-3 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
              onClick={() => removeQuestion(row.key)}
              disabled={questions.length === 1}
              aria-label={`Remove question ${index + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="self-start rounded-lg border border-lime-400 px-3 py-2 text-sm font-medium text-lime-700 hover:bg-lime-50"
          onClick={addQuestion}
        >
          + Add question
        </button>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="narrative">
          The story
        </label>
        <p className="-mt-1 mb-1 text-sm text-gray-500">
          How did it feel, round by round? What happened, what surprised you?
        </p>
        <textarea
          id="narrative"
          name="narrative"
          className={`${fieldClass} min-h-[12rem] resize-y`}
          placeholder="Walk through the interview in your own words…"
          required
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Post anonymously
        </label>
        {!anonymous && (
          <input
            className={fieldClass}
            placeholder="Your name (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-lg bg-lime-400 px-5 py-3 text-base font-semibold text-black hover:bg-lime-300 disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? "Posting…" : "Post your interview story"}
      </button>
    </form>
  );
}
