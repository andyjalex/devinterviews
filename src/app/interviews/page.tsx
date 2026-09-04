import Feed from "@/components/feed";

export const metadata = {
  title: "Interviews — dev-interviews",
  description: "Every real UK developer interview story shared so far.",
};

export default function InterviewsPage() {
  return (
    <main className="flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 pb-14 pt-4 font-sans sm:px-8 lg:px-10">
      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Interviews
      </h1>
      <Feed />
    </main>
  );
}
