import { object, string, TypeOf } from "zod";

export const LoginSchema = object({
    body: object({
        email: string({ required_error: "please provide email" }).email(
            "invalid email"
        ),
        password: string({ required_error: "password is required" })
            .min(8, "password must contain atleast 8 characters")
            .max(20, "password must contain less than 20 characters"),
    }),
});

export type TLoginInput = TypeOf<typeof LoginSchema>["body"];
