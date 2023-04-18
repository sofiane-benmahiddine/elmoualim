import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Home: NextPage = () => {
  const [choices, setChoices] = useState<string[]>([]);
  const [choice, setChoice] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  return (
    <>
      <Head>
        <title>Question Wizard</title>
      </Head>
      <main className="flex h-screen justify-center md:py-8 md:px-2">
        <div className="flex w-full flex-col bg-slate-200 p-4 shadow-md md:max-w-2xl">
          <div className="flex flex-col grow">
          <div className="flex justify-center py-4 text-2xl font-semibold">
            Question Wizard
          </div>
          <div className="pb-2 font-medium">Statement:</div>
          <textarea
            name=""
            id=""
            cols={80}
            rows={3}
            className="p-1 outline-none"
          ></textarea>
          <div className="pb-2 pt-6 font-medium">Add the choices:</div>
          <div className="flex">
            <input
              type="text"
              name=""
              id=""
              className="w-full p-1 outline-none"
              value={choice}
              onChange={(e) => setChoice(e.target.value)}
            />
            <button
              className="ml-2 bg-slate-300 px-4 py-1 text-slate-600 hover:bg-slate-400"
              onClick={() => {
                if (choice !== "") {
                  choices.push(choice);
                  setChoices(choices);
                  setChoice("");
                }
              }}
            >
              Add
            </button>
          </div>
          <div className="pb-2 pt-6 font-medium">
            Choice list:{" "}
            <span className="text-sm text-red-500">
              *Check the right answer
            </span>
          </div>
          {choices.map((choice) => (
            <div key={choice} className="flex items-center gap-1">
              <input
                value={choice}
                type="checkbox"
                className="accent-green-500"
                onChange={(e) => {
                  if (e.target.checked) {
                    setAnswers([...answers, e.target.value]);
                  } else {
                    const newAnswers = answers.filter(
                      (el) => el !== e.target.value
                    );
                    setAnswers(newAnswers);
                  }
                }}
              />
              <label htmlFor="">{choice}</label>
              <FontAwesomeIcon
                icon={faTrashCan}
                color="#f87171"
                className="cursor-pointer pl-4"
                onClick={() => {
                  const newChoices = choices.filter((el) => el !== choice);
                  const newAnswers = answers.filter((el) => el !== choice);
                  setChoices(newChoices);
                  setAnswers(newAnswers);
                }}
              />
            </div>
          ))}
          </div>
          <div className="flex justify-center py-6">
            <button
              type="submit"
              className="bg-slate-300 px-4 py-1 text-slate-600 hover:bg-slate-400"
              onClick={() => {
                if (answers.length < 1) {
                  console.log("no answers selected");
                } else {
                  console.log("answer submitted");
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
