import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const QuestionsPage: NextPage = () => {
  const { data } = api.questions.getAll.useQuery();
  if (!data) return <div />;
  return (
    <>
      <Head>
        <title>Exam 01</title>
      </Head>
      <main className="flex justify-center py-8">
        <div className="w-full overflow-y-auto rounded-md bg-slate-200 p-4 shadow-md md:max-w-4xl">
          <div className="flex justify-center py-4 text-2xl">Exam 01</div>
          <div className="flex flex-col">
            {data.map((question, index) => (
              <div key={question.id}>
                <div className="flex flex-col">
                  <div className="font-medium">{`Question ${(index + 1)
                    .toString()
                    .padStart(2, "0")}:`}</div>
                  <div>{question.statement}</div>
                  {question.answers.map((answer) => (
                    <div className="flex gap-1 pt-1" key={answer.id}>
                      <input type="checkbox" name="" id="" />
                      <label htmlFor="">{answer.content}</label>
                    </div>
                  ))}
                </div>
                {data.length > index + 1 && (
                  <div className="my-2 border border-slate-300" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center py-4 text-2xl">Good Luck!</div>
        </div>
      </main>
    </>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const ssg = generateSSGHelper();
//   await ssg.questions.getAll.prefetch();
//   return {
//     props: { trpcState: ssg.dehydrate() },
//   };
// };

export default QuestionsPage;
