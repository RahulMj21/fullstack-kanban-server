import { object, string, TypeOf } from "zod";

export const LoginSchema = object({
    body: object({
        email: string({ required_error: "please provide email" }).email(
            "invalid email"
        ),
        password: string({ required_error: "password is required" }),
    }),
});

export type TLoginInput = TypeOf<typeof LoginSchema>["body"];
