import Link from "next/link";
import SubmissionForm from "@/components/submission-form";

export const metadata = {
  title: "Share your interview — dev-interviews",
  description: "Add your UK developer interview experience to the directory.",
};

export default function SubmitPage() {
  return (
    <main className="flex w-full max-w-3xl flex-col gap-6 px-5 py-8 font-sans sm:px-8 lg:px-10">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-sm font-medium text-lime-700 hover:underline">
          ← All interviews
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Share your interview
        </h1>
        <p className="text-gray-600">
          The structured facts, the questions you were asked, and the story of
          how it actually felt.
        </p>
      </div>
      <SubmissionForm />
    </main>
  );
}
