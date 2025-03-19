import mongoose from "mongoose";

const PasteSchema = new mongoose.Schema({
    pasteId: { type: String, unique: true, required: true },
    content: String,
    createdAt: { type: Date, default: Date.now, expires: "7d" },
  });
  
  export const Paste = mongoose.model("Paste", PasteSchema);