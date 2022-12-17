import mongoose from "mongoose";
import config from "config";

const DB_URL = config.get<string>("dbUrl");

const connectDb = async () => {
    await mongoose
        .connect(DB_URL)
        .then(() => console.log("DB Connected..."))
        .catch((err: any) => console.log(err.message));
};

export default connectDb;
