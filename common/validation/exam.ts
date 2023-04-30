import * as z from "zod";

export const examSchema = z.object({
  title: z.string().min(1, "The exam title is required!").max(255),
});
const hasId = z.object({ id: z.string() });

export const updateExamSchema = examSchema.merge(hasId);

export type IExam = z.infer<typeof examSchema>;
export type IExamUpdate = z.infer<typeof updateExamSchema>;
