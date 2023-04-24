import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data } = api.questions.getAll.useQuery();
  if (!data) return <div />;
  return (
    <>
      <Head>
        <title>El Moualim</title>
        <meta name="description" content="El Moualim App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center py-8">
        <div className="w-full overflow-y-scroll  rounded-md bg-slate-200 p-4 shadow-md md:max-w-4xl">
          <div className="flex justify-center py-4 text-2xl font-semibold">
            Quizz Title
          </div>
          {data.map((question, index) => (
            <div className="flex flex-col" key={question.id}>
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
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
