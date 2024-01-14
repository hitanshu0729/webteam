import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    subjects: [
      {
        subjectCode: {
          type: String,
          required: true,
        },
        subjectName: {
          type: String,
          required: true,
        },
        marks: {
          type: Number,
          default: 0, // You can set a default value for marks
        },
        default: [],
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Student = mongoose.model("Student", studentSchema);
export default Student;
