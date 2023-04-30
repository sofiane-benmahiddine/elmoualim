import Head from "next/head";
import Link from "next/link";
import { type GetStaticProps, type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useModal } from "@ebay/nice-modal-react";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { LoadingPage, LoadingSpinner } from "~/components/Loading";
import DeleteModal from "~/components/DeleteModal";
import EditExamModal from "~/components/EditExamModal";

const HomePage: NextPage = () => {
  const [examTitle, setExamTitle] = useState<string>("");
  const ctx = api.useContext();
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
  const { mutate: mutateDelete, isLoading: loadingDelete } =
    api.exams.delete.useMutation({
      onSuccess: async () => {
        console.log("success");
        await ctx.exams.getAll.invalidate();
      },
      onError: (e) => {
        console.log(e);
      },
    });
  const { mutate: mutateEdit, isLoading: loadingEdit } =
    api.exams.update.useMutation({
      onSuccess: async () => {
        console.log("success");
        await ctx.exams.getAll.invalidate();
      },
      onError: (e) => {
        console.log(e);
      },
    });
  const deleteModal = useModal(DeleteModal);
  const editModal = useModal(EditExamModal);

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex justify-center px-2 py-12">
        <div className="flex w-full max-w-xl flex-col justify-center gap-2">
          <div className="flex flex-col gap-2 ">
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
                  disabled={examTitle.length < 1}
                >
                  Create
                </button>
              </div>
            </div>
            <div className="rounded-sm bg-slate-200 p-4">
              <div className="flex flex-col gap-2">
                <div className="pb-4">Exam List:</div>
                {!data || data.length < 1 ? (
                  <div className="mx-auto text-slate-500">
                    No exam added yet
                  </div>
                ) : !loadingEdit && !loadingDelete ? (
                  data.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between rounded-sm bg-white px-2 py-1 shadow-sm hover:bg-neutral-100"
                    >
                      <Link href={exam.id}> {exam.title}</Link>
                      <div className="flex gap-2">
                        <button
                          className="rounded-sm bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-700 disabled:bg-blue-300"
                          onClick={async () => {
                            await editModal
                              .show({ title: exam.title })
                              .then((v) => {
                                if (typeof v === "string")
                                  mutateEdit({ title: v, id: exam.id });
                              });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-sm bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-700 disabled:bg-red-300"
                          onClick={async () => {
                            await deleteModal
                              .show()
                              .then(() => mutateDelete({ id: exam.id }));
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-4">
                    <LoadingSpinner size={30} />
                  </div>
                )}
              </div>
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
