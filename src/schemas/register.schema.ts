import { object, string, TypeOf } from "zod";

export const RegisterSchema = object({
    body: object({
        name: string({ required_error: "please provide name" })
            .min(3, "name must contain atleast 3 characters")
            .max(20, "name cannot contain more than 30 characters"),
        email: string({ required_error: "please provide email" }).email(
            "invalid email"
        ),
        password: string({ required_error: "password is required" })
            .min(8, "password must contain atleast 8 characters")
            .max(20, "password must contain less than 20 characters"),
        confirmPassword: string({
            required_error: "confirmPassword is required",
        })
            .min(8, "confirm password must contain atleast 8 characters")
            .max(20, "confirm password must contain less than 20 characters"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "confirm password dosen't matches with the password",
        path: ["confirmPassword"],
    }),
});

export type TRegisterInput = Omit<
    TypeOf<typeof RegisterSchema>["body"],
    "confirmPassword"
>;
