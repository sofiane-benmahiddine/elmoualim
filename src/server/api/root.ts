import { createTRPCRouter } from "~/server/api/trpc";
import { questionsRouter } from "./routers/questions";
import { examsRouter } from "./routers/exams";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  questions: questionsRouter,
  exams: examsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
