import { Schema, model } from "mongoose";
import { IBoard } from "../utils/types";

const boardSchema = new Schema<IBoard>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        icon: { type: String, default: "🏷️" },
        title: { type: String, default: "Untitled" },
        description: {
            type: String,
            default: `Add description here..
    🟢 You can add multiline description
    🟢 Let's start...
    `,
        },
        position: { type: Number },
        favourite: { type: Boolean, default: false },
        favouritePosition: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const boardModel = model<IBoard>("Board", boardSchema);

export default boardModel;
