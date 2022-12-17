import { object, string, TypeOf } from "zod";

export const RegisterSchema = object({
    body: object({
        name: string({ required_error: "please provide name" })
            .min(3, "name must contain atleast 3 characters")
            .max(20, "name cannot contain more than 30 characters"),
        email: string({ required_error: "please provide email" }).email(
            "invalid email"
        ),
        password: string({ required_error: "password is required" }),
        confirmPassword: string({
            required_error: "confirmPassword is required",
        }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "confirm password dosen't matches with the password",
        path: ["confirmPassword"],
    }),
});

export type TRegisterInput = Omit<
    TypeOf<typeof RegisterSchema>["body"],
    "confirmPassword"
>;
