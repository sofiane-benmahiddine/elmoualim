import * as z from "zod";

export const questionSchema = z.object({
  question: z.object({
    statement: z
      .string()
      .min(1, "The question statement is required!")
      .max(255),
  }),
  answers: z
    .array(
      z.object({
        content: z.string().min(1),
        isCorrect: z.boolean(),
      })
    )
    .min(1, "Provide at least one answer")
    .refine((data) => data.some((answer) => answer.isCorrect === true), {
      message: "At least one answer must be true",
    }),
});

export type IQuestion = z.infer<typeof questionSchema>;