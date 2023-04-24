import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { LoadingPage } from "~/components/Loading";

import { api } from "~/utils/api";

const CreateExamPage: NextPage = () => {
  const [examTitle, setExamTitle] = useState<string>("");
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
        <title>Create</title>
      </Head>
      <div className="flex justify-center px-2 py-12">
        <div className="flex w-full max-w-xl flex-col justify-center gap-2">
          <div className="flex flex-col gap-2 rounded-lg bg-slate-200 p-4">
            <label htmlFor="title" className="block text-sm text-slate-900">
              Title:
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              id="title"
              placeholder="Write your title here..."
              className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex justify-center">
              <button
                type="button"
                className="flex w-fit items-center gap-2 rounded-lg bg-slate-700 p-2.5 text-center text-sm text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:bg-slate-400"
                onClick={() => mutate({ title: examTitle })}
              >
                Next
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateExamPage;
