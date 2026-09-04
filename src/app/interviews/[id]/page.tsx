import InterviewStory from "@/components/interview-story";

export default async function InterviewPage(props: PageProps<"/interviews/[id]">) {
  const { id } = await props.params;

  return (
    <main className="flex w-full max-w-3xl flex-col px-5 py-8 font-sans sm:px-8 lg:px-10">
      <InterviewStory id={id} />
    </main>
  );
}
