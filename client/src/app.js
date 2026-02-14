// Our Main JavaScript Entry File.
// app.js is your main application controller. It's the entry point that:
// Initializes the application when the page loads.
// Handles navigation between different sections (Students, Courses, Instructors, Employees).
// Coordinates between services and components.
// Sets up event listeners for the navigation menu.

//* import BaseApi from "./api/baseApi.js";

//* let test = new BaseApi();

//* console.log(await test.get("/students"));

import CourseService from "./services/courseService.js";
import StudentService from "./services/studentService.js";
//test add student
// console.log(await new StudentService().addStudent("John Doe", "john.doe@student.edu.eg", "01012345678", 20, "Computer Science", [1, 2, 3]));
//test edit student
let student = await new StudentService().getStudentById(1);
console.log(student);
let courses = await new CourseService().getAllCourses();
console.log(courses);
student.courses = courses
  .filter((c) => {
    if (student.courses.includes(c.id)) return c;
  })
  .map((c) => c.name);
console.log(student);
// student.name = "medhat mansour";
// console.log(await new StudentService().editStudent(student))
//test delete student
// console.log(await new StudentService().deleteStudent(31));
//test get all students
// console.log(await new StudentService().getAllStudents());
// console.log(await new StudentService().getStudentById(1));
// console.log(await new StudentService().searchStudentsByName("Adel Mansour"));
// console.log(await new StudentService().getSortedStudents("email", "desc"));
// console.log(await new StudentService().getSortedStudents());
// console.log(await new StudentService().getStudentsPaginated());
// console.log(await new StudentService().getStudentsPaginated(2, 15));
// import StudentService from "./services/studentService.js";
// console.log(await new StudentService().getAllStudents());
// console.log(await new StudentService().getStudentPage(2, 15));
//-----------------------------
//*Testing DataTable Component:
// import DataTable from "./components/DataTable.js";

// document.addEventListener("DOMContentLoaded", () => {
//   // 1) Create DataTable instance
//   const table = new DataTable("#table-head", "#table-body");

//   // 2) Set columns (for example, Student columns)
//   table.setColumns([
//     { key: "id", label: "ID", sortable: true },
//     { key: "name", label: "Name", sortable: true },
//     { key: "email", label: "Email", sortable: true },
//     { key: "department", label: "Department", sortable: true },
//   ]);

//   // 3) Provide some fake data
//   const fakeStudents = [
//     { id: 1, name: "Ahmed Ali", email: "ahmed@example.com", department: "CS" },
//     { id: 2, name: "Sara Omar", email: "sara@example.com", department: "IT" },
//     {
//       id: 3,
//       name: "Mohamed Zaki",
//       email: "mohamed@example.com",
//       department: "IS",
//     },
//   ];

//   // 4) Render rows
//   table.renderRows(fakeStudents);

//   // 5) Hook callbacks to see if buttons and sort work
//   table.onEdit = (item) => {
//     console.log("EDIT clicked:", item);
//     alert(`Edit ${item.name}`);
//   };

//   table.onDelete = (item) => {
//     console.log("DELETE clicked:", item);
//     alert(`Delete ${item.name}`);
//   };

//   table.onSortChange = (field, order) => {
//     console.log("SORT changed:", field, order);
//     // For testing, just sort the fake array in memory
//     const sorted = [...fakeStudents].sort((a, b) => {
//       if (a[field] < b[field]) return order === "asc" ? -1 : 1;
//       if (a[field] > b[field]) return order === "asc" ? 1 : -1;
//       return 0;
//     });
//     table.renderRows(sorted);
//   };
// });
