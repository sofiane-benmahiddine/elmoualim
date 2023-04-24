import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { questionSchema } from "common/validation/question";
export const questionsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const questions = await ctx.prisma.question.findMany({
      include: { answers: true },
    });
    const newQuestions = questions.map((question) => {
      const newAnswers = question.answers.map((answer) => ({
        ...answer,
        isCorrect: false,
      }));
      return { ...question, answers: newAnswers };
    });
    return newQuestions;
  }),
  create: publicProcedure
    .input(questionSchema)
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.create({
        data: {
          statement: input.question.statement,
        },
      });
      const createAnswerData = input.answers.map((answer) => ({
        ...answer,
        questionId: question.id,
      }));
      await ctx.prisma.answer.createMany({
        data: createAnswerData,
      });
    }),
});
