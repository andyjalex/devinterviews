// Firestore helpers for the `submissions` collection.
//
// A submission is one candidate's account of a real interview: the structured
// basics, the list of questions they were asked (kept as a flat array so we can
// mine "most common questions at Company X" later), and the free-text narrative.

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const INTERVIEW_STAGES = [
  "Recruiter screen",
  "Phone / video screen",
  "Take-home assignment",
  "Technical interview",
  "System design",
  "Onsite / final round",
  "Other",
] as const;

export type InterviewStage = (typeof INTERVIEW_STAGES)[number];

/** Shape written to Firestore (no `id`; `createdAt` is a server timestamp). */
export interface SubmissionInput {
  company: string;
  role: string;
  /** ISO date string, e.g. "2026-08-14". */
  interviewDate: string;
  stage: InterviewStage;
  /** Questions the candidate remembers being asked, in order. */
  questions: string[];
  /** The story: how it felt, what happened, what surprised them. */
  narrative: string;
  /** Display name, or null when posted anonymously. */
  authorName: string | null;
}

/** A submission read back from Firestore. */
export interface Submission extends SubmissionInput {
  id: string;
  createdAt: Timestamp | null;
}

const submissionsCollection = collection(db, "submissions");

/** Write a new submission. Returns the new document id. */
export async function addSubmission(input: SubmissionInput): Promise<string> {
  const ref = await addDoc(submissionsCollection, {
    ...input,
    questions: input.questions.map((q) => q.trim()).filter(Boolean),
    authorName: input.authorName?.trim() || null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

function toSubmission(id: string, data: Record<string, unknown>): Submission {
  return {
    id,
    company: (data.company as string) ?? "",
    role: (data.role as string) ?? "",
    interviewDate: (data.interviewDate as string) ?? "",
    stage: (data.stage as InterviewStage) ?? "Other",
    questions: Array.isArray(data.questions) ? (data.questions as string[]) : [],
    narrative: (data.narrative as string) ?? "",
    authorName: (data.authorName as string | null) ?? null,
    createdAt: (data.createdAt as Timestamp) ?? null,
  };
}

/** All submissions, newest interview first, for the homepage feed. */
export async function getSubmissions(): Promise<Submission[]> {
  const snapshot = await getDocs(
    query(submissionsCollection, orderBy("interviewDate", "desc")),
  );
  return snapshot.docs.map((d) => toSubmission(d.id, d.data()));
}

/** A single submission by id, or null if it doesn't exist. */
export async function getSubmission(id: string): Promise<Submission | null> {
  const snapshot = await getDoc(doc(db, "submissions", id));
  return snapshot.exists() ? toSubmission(snapshot.id, snapshot.data()) : null;
}
