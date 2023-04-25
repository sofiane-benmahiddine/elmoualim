import Head from "next/head";
import { type GetStaticProps, type NextPage } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import AddQuestionCard from "~/components/AddQuestionCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { type DraggableLocation } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { type Answer, type Question } from "@prisma/client";

interface DraggedItem {
  source: DraggableLocation;
  destination: DraggableLocation | null;
}
type TQuestion = Question & {
  answers: Answer[];
};

const ExamPage: NextPage<{ id: string }> = ({ id }) => {
  const [questionList, setQuestionList] = useState<TQuestion[]>([]);

  const reorder = (list: TQuestion[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    if (removed) result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDrag = ({ source, destination }: DraggedItem) => {
    // dropped outside the list
    if (!destination) {
      return;
    }

    const newQuestionList = reorder(
      questionList,
      source.index,
      destination.index
    );
    setQuestionList(newQuestionList);
  };

  const { data } = api.exams.getById.useQuery(
    { id },
    {
      onSuccess: (data) => {
        setQuestionList(data.questions);
      },
    }
  );
  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div className="flex w-full flex-col justify-center gap-2 p-2 xl:flex-row">
        <AddQuestionCard id={id} />
        <div className="flex w-full max-w-5xl flex-col gap-2">
          <div className="flex rounded-lg bg-slate-200 p-4 text-2xl">
            {`Title: ${data.title}`}
          </div>
          <DragDropContext onDragEnd={handleDrag}>
            <Droppable droppableId="dropable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questionList.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="py-1"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="flex flex-col rounded-lg bg-slate-200 p-3">
                            <div className="mx-2 flex justify-between gap-3 rounded-lg bg-neutral-400 p-2">
                              <div className="text-xl font-semibold text-white">{`Question ${
                                index + 1
                              }`}</div>
                              <div className="flex items-center gap-2 pr-2 text-lg">
                                <div className="rounded-lg bg-blue-500/90 px-2 py-1 text-sm text-white">
                                  Edit
                                </div>
                                <div className="rounded-lg bg-red-500/90 px-2 py-1 text-sm text-white">
                                  Remove
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                              <div className="m-2 grow rounded-lg bg-slate-300 p-2">
                                <div className="text-lg font-medium">
                                  Question:
                                </div>
                                <div className="mb-2 pl-4">
                                  - {question.statement}
                                </div>
                                <div className="text-lg font-medium">
                                  Answers:
                                </div>

                                {question.answers.map((answer) => (
                                  <ul
                                    className="max-w-md list-inside space-y-1 pl-4"
                                    key={answer.id}
                                  >
                                    <li className="flex items-center gap-1">
                                      {answer.isCorrect ? (
                                        <FontAwesomeIcon
                                          icon={faCircleCheck}
                                          className="text-emerald-500"
                                        />
                                      ) : (
                                        <FontAwesomeIcon
                                          icon={faCircleXmark}
                                          className="text-red-400"
                                        />
                                      )}
                                      {answer.content}
                                    </li>
                                  </ul>
                                ))}
                              </div>
                            </div>
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
