import Head from "next/head";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IQuestion } from "common/validation/question";
import { questionSchema } from "common/validation/question";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { type DraggableLocation } from "@hello-pangea/dnd";
import {
  faArrowsUpDownLeftRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

const AddQuestion = () => {
  const [answerValue, setAnswerValue] = useState("");
  const { mutate } = api.questions.create.useMutation({
    onSuccess: () => {
      console.log("success");
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors: { question: questionError, answers: answersError },
    },
  } = useForm<IQuestion>({
    resolver: zodResolver(questionSchema),
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "answers",
  });

  interface DraggedItem {
    source: DraggableLocation;
    destination: DraggableLocation | null;
  }

  const handleDrag = ({ source, destination }: DraggedItem) => {
    if (destination) {
      move(source.index, destination.index);
    }
  };

  const onSubmit = (data: IQuestion) => {
    console.log(data);
    mutate({ question: data.question, answers: data.answers });
  };

  return (
    <>
      <Head>
        <title>Add Question</title>
      </Head>
      <main className="flex justify-center md:px-2 md:py-8">
        <div className="flex w-full flex-col rounded-lg border border-gray-300 bg-slate-200 p-4 md:max-w-2xl">
          <h3 className="flex justify-center py-8 text-2xl">Add a question</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="statement"
                className={`mb-2 block text-sm ${
                  questionError ? "text-red-500" : "text-slate-900"
                }`}
              >
                Statement:
              </label>
              <textarea
                id="statement"
                rows={3}
                className={`block w-full rounded-lg border ${
                  questionError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                } " bg-slate-50 p-2.5 text-sm outline-none`}
                placeholder="Write your statement here..."
                {...register("question.statement")}
              ></textarea>
              {questionError && (
                <p className="text-sm text-red-500">
                  {questionError.statement?.message}
                </p>
              )}
            </div>
            <div className="mt-2">
              <label
                htmlFor="answer"
                className={`mb-2 block text-sm ${
                  answersError ? "text-red-500" : "text-slate-900"
                }`}
              >
                Answer:
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="answer"
                  onChange={(e) => setAnswerValue(e.target.value)}
                  value={answerValue}
                  className={`block w-full rounded-lg border bg-slate-50 p-2.5 text-sm ${
                    answersError
                      ? "border-red-300 text-red-500 outline-none focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 text-slate-900 outline-none focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Write your answer here..."
                />
                <button
                  type="button"
                  className="ml-2 inline-flex items-center rounded-lg bg-slate-700 p-2.5 text-center text-sm text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:bg-slate-400"
                  onClick={() => {
                    if (answerValue !== "") {
                      append({ content: answerValue, isCorrect: false });
                      setAnswerValue("");
                    }
                  }}
                  disabled={answerValue === ""}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="mt-2">
              <DragDropContext onDragEnd={handleDrag}>
                <Droppable droppableId="answers-items">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {fields.map((field, index) => (
                        <Draggable
                          key={`answers[${index}]`}
                          draggableId={`field-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              key={field.id}
                              ref={provided.innerRef}
                              className="min-h-8 my-2 flex divide-x rounded-lg bg-slate-50"
                              {...provided.draggableProps}
                            >
                              <div className="flex grow flex-col gap-1 divide-y p-2 text-sm">
                                <div className="relative flex">
                                  <input
                                    id={field.id}
                                    type="text"
                                    className="grow rounded-lg bg-slate-200 p-2 outline-none disabled:bg-slate-50"
                                    {...register(`answers.${index}.content`)}
                                  />
                                </div>

                                <div className="flex gap-2 pl-2">
                                  <span className="py-1 text-xs font-semibold">
                                    Correct answer?
                                  </span>
                                  <input
                                    {...register(`answers.${index}.isCorrect`)}
                                    type="checkbox"
                                    className="accent-emerald-600 hover:accent-emerald-500"
                                  />
                                </div>
                              </div>
                              <div
                                className="flex items-center justify-center"
                                {...provided.dragHandleProps}
                              >
                                <FontAwesomeIcon
                                  icon={faArrowsUpDownLeftRight}
                                  className="px-4 text-lg"
                                />
                              </div>
                              <div className="flex items-center justify-center">
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="cursor-pointer px-4 text-lg text-red-500"
                                  onClick={() => remove(index)}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            {answersError && (
              <p className="text-sm text-red-500">
                Provide at least one correct answer
              </p>
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-2 inline-flex items-center rounded-lg bg-slate-700 p-2.5 text-center text-sm text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};
export default AddQuestion;
