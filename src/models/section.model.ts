import { model, Schema } from "mongoose";

const sectionSchema = new Schema({
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    title: { type: String, default: "" },
});

const sectionModel = model("Section", sectionSchema);

export default sectionModel;
