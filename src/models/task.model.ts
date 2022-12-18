import { model, Schema } from "mongoose";
import { ITask } from "../utils/types";

const taskSchema = new Schema<ITask>(
    {
        section: {
            type: Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },
        title: { type: String, default: "" },
        content: { type: String, default: "" },
        position: { type: Number },
    },
    { timestamps: true }
);

const taskModel = model<ITask>("Task", taskSchema);

export default taskModel;
