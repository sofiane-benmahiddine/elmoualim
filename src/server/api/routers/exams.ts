import { examSchema, updateExamSchema } from "common/validation/exam";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const examsRouter = createTRPCRouter({
  create: publicProcedure.input(examSchema).mutation(async ({ ctx, input }) => {
    const exam = await ctx.prisma.exam.create({
      data: { title: input.title },
      select: { id: true },
    });
    return exam;
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const exam = await ctx.prisma.exam.findFirst({
        where: { id: input.id },
        include: {
          questions: {
            include: { answers: true },
          },
        },
      });
      if (!exam) throw new TRPCError({ code: "NOT_FOUND" });
      return exam;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const exams = await ctx.prisma.exam.findMany();
    return exams;
  }),
  update: publicProcedure.input(updateExamSchema).mutation(({ ctx, input }) => {
    const exam = ctx.prisma.exam.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title,
      },
    });
    return exam;
  }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const exam = ctx.prisma.exam.delete({
        where: {
          id: input.id,
        },
      });
      return exam;
    }),
});
