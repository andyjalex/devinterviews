"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSubmissions, type Submission } from "@/lib/submissions";

function snippet(text: string, max = 240) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      });
}

export default function Feed() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSubmissions()
      .then(setSubmissions)
      .catch((err) => {
        console.error(err);
        setError("Couldn't load interview stories. Check your Firebase config.");
      });
  }, []);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (submissions === null) {
    return <p className="text-sm text-gray-500">Loading interview stories…</p>;
  }

  if (submissions.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No stories yet.{" "}
        <Link href="/submit" className="font-medium text-lime-700 underline">
          Be the first to share one.
        </Link>
      </p>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-4">
      {submissions.map((s) => (
        <li key={s.id}>
          <Link
            href={`/interviews/${s.id}`}
            className="block rounded-xl border border-gray-200 p-5 transition-colors hover:border-lime-400 hover:bg-lime-50/40"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {s.company}
              </h3>
              <span className="text-sm text-gray-500">
                {formatDate(s.interviewDate)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {s.role}
              {s.stage ? ` · ${s.stage}` : ""}
            </p>
            {s.narrative && (
              <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
                {snippet(s.narrative)}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
              <span>{s.authorName ? s.authorName : "Anonymous"}</span>
              {s.questions.length > 0 && (
                <span>
                  {s.questions.length} question
                  {s.questions.length === 1 ? "" : "s"} logged
                </span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
