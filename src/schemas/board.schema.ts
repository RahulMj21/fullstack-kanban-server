import { object, string, TypeOf } from "zod";

export const BoardSchema = object({
    body: object({
        title: string({ required_error: "please provide board title" })
            .trim()
            .min(3, "title must contain atleast 3 chracters")
            .max(20, "title must contain less than 20 characters"),
        description: string()
            .trim()
            .max(500, "description must contain less than 500 characters")
            .optional(),
        icon: string().trim().max(1, "you can add only one icon").optional(),
    }),
});

export type TICreateBoardInput = TypeOf<typeof BoardSchema>["body"];
