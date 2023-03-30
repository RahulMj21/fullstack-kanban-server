import { object, string, TypeOf } from "zod";

export const SectionSchema = object({
    body: object({
        title: string({ required_error: "please provide section title" })
            .min(3, "title must contain atleast 3 characters")
            .max(15, "title must contain less than 15 characters"),
    }),
});

export type TSectionInput = TypeOf<typeof SectionSchema>["body"];
