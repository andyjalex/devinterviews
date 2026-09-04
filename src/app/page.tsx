import Link from "next/link";
import Feed from "@/components/feed";

export default function Home() {
  return (
    <main className="flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 pb-14 pt-4 font-sans sm:px-8 lg:px-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Real UK developer interviews, told round by round
        </h1>
        <p className="text-gray-600">
          Not a question bank — the actual story of what an interview felt like,
          in the candidate&apos;s own words, alongside the structured facts.
        </p>
        <Link
          href="/submit"
          className="self-start rounded-lg bg-lime-400 px-5 py-3 text-base font-semibold text-black hover:bg-lime-300"
        >
          Share your interview
        </Link>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Latest stories</h2>
        <Feed />
      </section>
    </main>
  );
}
