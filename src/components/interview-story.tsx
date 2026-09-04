"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSubmission, type Submission } from "@/lib/submissions";

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

export default function InterviewStory({ id }: { id: string }) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">(
    "loading",
  );

  useEffect(() => {
    getSubmission(id)
      .then((s) => {
        setSubmission(s);
        setStatus(s ? "ready" : "missing");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, [id]);

  if (status === "loading") {
    return <p className="text-sm text-gray-500">Loading…</p>;
  }

  if (status === "error") {
    return (
      <p className="text-sm text-red-600">
        Couldn&apos;t load this story. Check your Firebase config.
      </p>
    );
  }

  if (status === "missing" || !submission) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-600">This interview story doesn&apos;t exist.</p>
        <Link href="/" className="text-sm font-medium text-lime-700 underline">
          Back to the feed
        </Link>
      </div>
    );
  }

  const s = submission;

  return (
    <article className="flex w-full max-w-2xl flex-col gap-6">
      <Link href="/" className="text-sm font-medium text-lime-700 hover:underline">
        ← All interviews
      </Link>

      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">{s.company}</h1>
        <p className="text-lg text-gray-700">{s.role}</p>
        <p className="text-sm text-gray-500">
          {[s.stage, formatDate(s.interviewDate)].filter(Boolean).join(" · ")}
        </p>
        <p className="text-sm text-gray-500">
          Shared by {s.authorName ? s.authorName : "Anonymous"}
        </p>
      </header>

      {s.questions.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Questions asked
          </h2>
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-[15px] text-gray-800">
            {s.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-900">The story</h2>
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-800">
          {s.narrative}
        </div>
      </section>
    </article>
  );
}
