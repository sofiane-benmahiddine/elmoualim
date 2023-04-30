import Head from "next/head";
import { type GetStaticProps, type NextPage } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import AddQuestionCard from "~/components/AddQuestionCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { type DraggableLocation } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsUpDownLeftRight,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { type Answer, type Question } from "@prisma/client";
import { useModal } from "@ebay/nice-modal-react";
import DeleteModal from "~/components/DeleteModal";
import { LoadingSpinner } from "~/components/Loading";

interface DraggedItem {
  source: DraggableLocation;
  destination: DraggableLocation | null;
}
type TQuestion = Question & {
  answers: Answer[];
};

const ExamPage: NextPage<{ id: string }> = ({ id }) => {
  const [questionList, setQuestionList] = useState<TQuestion[]>([]);

  const modal = useModal(DeleteModal);

  const reorder = (list: TQuestion[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    if (removed) result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDrag = ({ source, destination }: DraggedItem) => {
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
  const ctx = api.useContext();

  const { data } = api.exams.getById.useQuery(
    { id },
    {
      onSuccess: (data) => {
        setQuestionList(data.questions);
      },
    }
  );
  const { mutate, isLoading } = api.questions.delete.useMutation({
    onSuccess: () => ctx.exams.getById.invalidate(),
    onError: () => console.log("error"),
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div className="flex w-full flex-col justify-center gap-2 p-2 xl:flex-row">
        <AddQuestionCard id={id} />
        <div className="flex w-full max-w-5xl flex-col gap-2">
          <div className="flex rounded-sm bg-slate-200 p-4 text-2xl">
            {`Title: ${data.title}`}
          </div>
          {isLoading ? (
            <div className="flex justify-center p-12">
              <LoadingSpinner size={64} />
            </div>
          ) : data.questions.length > 0 ? (
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
                        {(provided, snapshot) => (
                          <div
                            className="py-1"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <div
                              className={`${
                                snapshot.isDragging
                                  ? "bg-blue-200"
                                  : "bg-gray-200"
                              } flex flex-col rounded-sm p-3`}
                            >
                              <div className="mx-2 flex justify-between gap-3 rounded-xl pb-5 pt-2">
                                <div className="text-xl font-medium text-slate-600">{`Question ${
                                  index + 1
                                }`}</div>
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-xl"
                                >
                                  <FontAwesomeIcon
                                    icon={faArrowsUpDownLeftRight}
                                  />
                                </div>
                                <div className="flex items-center gap-2 text-lg">
                                  <button className="rounded-sm bg-blue-500/90 px-2 py-1 text-sm text-white">
                                    Edit
                                  </button>
                                  <button
                                    className="rounded-sm bg-red-500/90 px-2 py-1 text-sm text-white"
                                    onClick={() =>
                                      modal
                                        .show()
                                        .then(() => mutate({ id: question.id }))
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row">
                                <div className="m-2 grow rounded-sm bg-white p-4">
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
          ) : (
            <div className="flex justify-center p-4 text-xl text-slate-400">
              No questions added yet
            </div>
          )}
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
