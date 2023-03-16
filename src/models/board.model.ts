import { Schema, model } from "mongoose";
import { IBoard } from "../utils/types";

const boardSchema = new Schema<IBoard>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        icon: { type: String, default: "🏷️" },
        title: { type: String, required: true, unique: true },
        description: {
            type: String,
            default: `Add description here..
    🟢 You can add multiline description
    🟢 Let's start...
    `,
        },
        position: { type: Number, required: true },
        favourite: { type: Boolean, default: false },
        favouritePosition: { type: Number },
    },
    { timestamps: true }
);

const boardModel = model<IBoard>("Board", boardSchema);

export default boardModel;
