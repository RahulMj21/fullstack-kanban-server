import { model, Schema } from "mongoose";
import { ISession } from "../utils/types";

const sessionSchema = new Schema<ISession>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        token: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const sessionModel = model<ISession>("Session", sessionSchema);

export default sessionModel;
