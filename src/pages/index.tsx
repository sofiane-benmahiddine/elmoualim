import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { LoadingPage } from "~/components/Loading";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

import { api } from "~/utils/api";

const HomePage: NextPage = () => {
  const [examTitle, setExamTitle] = useState<string>("");
  const { data } = api.exams.getAll.useQuery();
  const router = useRouter();
  const { mutate, isLoading } = api.exams.create.useMutation({
    onSuccess: async (data) => {
      await router.push(data.id);
    },
    onError: (e) => {
      console.log(e);
    },
  });
  if (isLoading) return <LoadingPage />;
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex justify-center px-2 py-12">
        <div className="flex w-full max-w-xl flex-col justify-center gap-2">
          <div className="flex flex-col gap-2 rounded-sm bg-slate-200 p-4">
            <label htmlFor="title" className="block text-sm text-slate-900">
              Title:
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              id="title"
              placeholder="Write your title here..."
              className="block w-full rounded-sm border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex justify-center">
              <button
                type="button"
                className="flex w-fit items-center gap-2 rounded-sm bg-slate-700 px-4 py-2 text-center text-sm text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:bg-slate-400"
                onClick={() => mutate({ title: examTitle })}
              >
                Create
              </button>
            </div>
            <div className="pt-12 flex flex-col gap-2">
              <div className="pb-4">Exam List:</div>
              {!data || data.length < 1 ? (
                <div>No exam added yet</div>
              ) : (
                data.map((exam) => (
                  <Link
                    href={exam.id}
                    key={exam.id}
                    className="rounded-sm bg-neutral-600 px-2 py-1 text-white hover:bg-neutral-400"
                  >
                    {exam.title}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps = async () => {
  const ssg = generateSSGHelper();
  await ssg.exams.getAll.prefetch();
  return {
    props: { trpcState: ssg.dehydrate() },
  };
};
