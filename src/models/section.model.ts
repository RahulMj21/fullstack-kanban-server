import { model, Schema } from "mongoose";
import { ISection } from "../utils/types";

const sectionSchema = new Schema<ISection>({
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    title: { type: String, default: "" },
});

const sectionModel = model("Section", sectionSchema);

export default sectionModel;
