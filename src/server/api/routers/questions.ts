import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { questionSchema } from "common/validation/question";
import { z } from "zod";
export const questionsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const questions = await ctx.prisma.question.findMany({
      include: { answers: true },
    });
    const newQuestions = questions.map((question) => {
      const newAnswers = question.answers.map((answer) => {
        const { id, content } = answer;
        return { id, content: content };
      });
      const { id, statement } = question;
      return { id, statement, answers: newAnswers };
    });
    return newQuestions;
  }),
  create: publicProcedure
    .input(questionSchema)
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.create({
        data: {
          statement: input.question.statement,
          examId: input.examId,
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
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.delete({
        where: {
          id: input.id,
        },
      });
      return question;
    }),
});
