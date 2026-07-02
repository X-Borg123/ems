import mongoose, { Schema } from "mongoose";

const phoneSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true,
    maxlength: 15
  },
  note: {
    type: String
  }
}, { timestamps: true });

const Phone = mongoose.model("Phone", phoneSchema);
export default Phone;
