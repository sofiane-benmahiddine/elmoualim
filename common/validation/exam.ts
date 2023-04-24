import * as z from "zod";

export const examSchema = z.object({
  title: z.string().min(1, "The exam title is required!").max(255),
});

export type IExam = z.infer<typeof examSchema>;
