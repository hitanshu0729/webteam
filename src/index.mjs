import express from "express";
import fs from "fs";
import "./db/conn.mjs";
// const bcrypt = require('bcrypt');
import bvrypt from "bcrypt";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";
import Student from "./models/registerations.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const partialsPath = path.join(__dirname, "../views/partials"); // Adjust the path based on your project structure
// console.log(partialsPath);
const port = process.env.PORT || 8000;
app.set("view engine", "hbs");
app.use(express.static("./public"));

hbs.registerPartials(partialsPath);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.get("/", async(req, res) => {
//     try{
//         res.render('index.hbs');
//         console.log("home site working ")
//     }catch (error){
//         console.error(error);
//         res.status(500).render('Internal Server Error');
//     }
// });
app.get("/register", async (req, res) => {
  try {
    res.render("index");
    console.log("home site working ");
  } catch (error) {
    console.error(error);
    res.status(500).render("Internal Server Error");
  }
});
app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  try {
    // Convert registrationNumber to uppercase
    const registrationNumber = req.body.registrationNumber.toUpperCase();

    // Create a new instance of the Student model with data from req.body
    const newStudent = new Student({
      name: req.body.name,
      batch: req.body.batch,
      registrationNumber: registrationNumber, // Use the converted value
      semester: req.body.semester,
      subjects: req.body.subjects,
    });

    // Save the new student to the database
    const user = await Student.findOne({
      registrationNumber: registrationNumber,
    });

    if (user !== null) {
      res.render("addSubject", {
        message: `User already exists with same registration no.`,
      });
    } else {
      const savedStudent = await newStudent.save();
      console.log(savedStudent);
      res.render("index", {
        message: `Successfully added ${savedStudent.registrationNumber}`,
      });
    }
    // res.render("index");
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

// app.post("/login", async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;
//     console.log(`${email} is your email`);
//     const useremail = await User.findOne({ email: email });

//     if (
//       useremail &&
//       useremail.email === email &&
//       useremail &&
//       useremail.password === password
//     ) {
//       res.sendFile("C:/Users/HP/Desktop/node/regform/backend/public/main.html");
//     } else {
//       res.send("<h1>Invalid login details</h1>");
//     }
//     console.log(useremail);
//   } catch (e) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// Add a new route to handle adding subjects and marks for a student
app.get("/addSubject", async (req, res) => {
  res.render("addSubject"); // Assuming you have a corresponding HBS file for this route
});

app.post("/addSubject", async (req, res) => {
  try {
    // Find the student based on the registration number
    const student = await Student.findOne({
      registrationNumber: req.body.registrationNumber.toUpperCase(),
    });

    if (!student) {
      return res.render("error", { message: "Student not found" });
    }

    const subjectCodeToCheck = req.body.subjectCode; // Assuming subjectCode is sent in the request body

    // Check if subjectCode already exists in the subject array
    const isSubjectCodeExists = student.subjects.some(
      (subject) => subject.subjectCode === subjectCodeToCheck
    );

    if (isSubjectCodeExists) {
      return res.render("error", {
        message: "Subject code already exists for this student",
      });
    }
    if (req.body.marks > 100 || req.body.marks < 0) {
      return res.render("error", {
        message: "Marks should be between 0 and 100",
      });
    }
    // if()
    // Add a new subject to the student's subjects array
    const newSubject = {
      subjectCode: req.body.subjectCode,
      subjectName: req.body.subjectName,
      marks: req.body.marks,
    };

    // Update total and percentage
    student.total = +req.body.marks + +student.total;
    student.subjects.push(newSubject);
    student.percentage = +(student.total / +student.subjects.length).toFixed(2);

    // Save the updated student to the database
    const updatedStudent = await student.save();

    console.log(updatedStudent);
    res.render("addSubject", {
      message: `Successfully added ${newSubject.subjectName}`,
    });
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

app.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.render("allStudents", { students });
  } catch (error) {
    console.error(error);
    alert(error.message);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});
app.get("/all-students/:registrationNumber", async (req, res) => {
  try {
    const registrationNumber = req.params.registrationNumber;

    // Find the student in the database based on the registration number
    const student = await Student.findOne({ registrationNumber });

    if (!student) {
      // If the student is not found, you can handle this case (e.g., render an error page)
      return res.render("error", { message: "Student not found" }); // Create a studentNotFound.hbs view
    }
    console.log(student);
    const percentage = student.total / student.subjects.length;
    // Render a page with details about the specific student
    res.render("studentDetails", { student });
  } catch (error) {
    // Handle other errors
    console.error(error);
    res.status(500).render("error"); // Create an error.hbs view
  }
});
// Import necessary modules and models
// ...

// Add a new route to render the "addMarks" page
app.get("/subjectMarks", (req, res) => {
  // Assuming you are using a template engine like hbs
  res.render("subjectMarks", {
    Student,
  });
});
// Add a route to handle the form submission for adding marks

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
