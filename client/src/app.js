// Our Main JavaScript Entry File.
// app.js is your main application controller. It's the entry point that:
// Initializes the application when the page loads.
// Handles navigation between different sections (Students, Courses, Instructors, Employees).
// Coordinates between services and components.
// Sets up event listeners for the navigation menu.

//* import BaseApi from "./api/baseApi.js";

//* let test = new BaseApi();

//* console.log(await test.get("/students"));

import StudentService from "./services/studentService.js";
console.log(await new StudentService().getAllStudents());
console.log(await new StudentService().getStudentById(1));
console.log(await new StudentService().searchStudentsByName("Adel Mansour"));
console.log(await new StudentService().getSortedStudents("email", "desc"));
console.log(await new StudentService().getSortedStudents());
console.log(await new StudentService().getStudentsPaginated());
console.log(await new StudentService().getStudentsPaginated(2, 15));
// import StudentService from "./services/studentService.js";
// console.log(await new StudentService().getAllStudents());
// console.log(await new StudentService().getStudentPage(2, 15));
