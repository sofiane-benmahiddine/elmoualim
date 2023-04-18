import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>El Moualim</title>
        <meta name="description" content="El Moualim App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center py-8">
        <div className="w-full rounded-md  bg-slate-200 p-4 shadow-md md:max-w-4xl overflow-y-scroll">
          <div className="flex justify-center py-4 text-2xl font-semibold">
            Quizz Title
          </div>
          <div className="flex flex-col">
            <div>
              <div className="font-medium">Question 01:</div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quaerat dolores at, rem repellat officia voluptas magni
                excepturi nihil in aliquam fuga sit quam, illo itaque cupiditate
                assumenda! Maiores, nesciunt accusantium?
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 01</label>
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 02</label>
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 03</label>
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 04</label>
              </div>
            </div>
            <div className="py-6"></div>
            <div>
              <div className="font-medium">Question 02:</div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quaerat dolores at, rem repellat officia voluptas magni
                excepturi nihil in aliquam fuga sit quam, illo itaque cupiditate
                assumenda! Maiores, nesciunt accusantium?
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 01</label>
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 02</label>
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 03</label>
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 04</label>
              </div>
            </div>
            <div className="py-6"></div>
            <div>
              <div className="font-medium">Question 03:</div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quaerat dolores at, rem repellat officia voluptas magni
                excepturi nihil in aliquam fuga sit quam, illo itaque cupiditate
                assumenda! Maiores, nesciunt accusantium?
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 01</label>
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 02</label>
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 03</label>
              </div>
              <div className="flex gap-1 pt-1">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">choice 04</label>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-6"><button type="submit" className="bg-slate-300 py-1 px-4 text-slate-600 hover:bg-slate-400">Submit</button></div>
        </div>
      </main>
    </>
  );
};

export default Home;
