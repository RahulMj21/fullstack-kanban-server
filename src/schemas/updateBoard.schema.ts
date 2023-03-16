import { boolean, object, string, TypeOf } from "zod";

export const UpdateBoard = object({
    body: object({
        title: string({ required_error: "please provide board title" })
            .trim()
            .min(3, "title must contain atleast 3 chracters")
            .max(20, "title must contain less than 20 characters")
            .optional(),
        description: string()
            .trim()
            .max(500, "description must contain less than 500 characters")
            .optional(),
        icon: string().trim().max(1, "you can add only one icon").optional(),
        favourite: boolean().optional(),
    }),
});

export type TUpdateBoardInput = TypeOf<typeof UpdateBoard>["body"];
