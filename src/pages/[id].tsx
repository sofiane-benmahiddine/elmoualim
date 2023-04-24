import Head from "next/head";
import { type GetStaticProps, type NextPage } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import AddQuestionCard from "~/components/AddQuestionCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const ExamPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.exams.getById.useQuery({ id });
  if (!data) return <div />;
  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div className="flex justify-center px-2 py-12">
        <div className="flex w-full max-w-xl flex-col justify-center gap-2">
          <div className="flex justify-center rounded-lg bg-slate-200 p-4 text-2xl">
            {`Title: ${data.title}`}
          </div>
          {data.questions.map((question) => (
            <div
              className="flex flex-col rounded-lg bg-slate-200 p-4"
              key={question.id}
            >
              {/* <div className="font-medium">{`Question ${(index + 1)
                .toString()
                .padStart(2, "0")}:`}</div> */}
              <div className="mb-2 text-lg">{question.statement}</div>
              {question.answers.map((answer) => (
                <ul className="max-w-md list-inside space-y-1" key={answer.id}>
                  <li className="flex items-center gap-1">
                    {answer.isCorrect ? (
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-emerald-500"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="text-red-500"
                      />
                    )}
                    {answer.content}
                  </li>
                </ul>
              ))}
            </div>
          ))}

          <AddQuestionCard id={id} />
        </div>
      </div>
    </>
  );
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id !== "string") throw Error("no Id");

  await ssg.exams.getById.prefetch({ id });
  return {
    props: { trpcState: ssg.dehydrate(), id },
  };
};

export default ExamPage;
