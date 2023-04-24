import { examSchema } from "common/validation/exam";
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
});
