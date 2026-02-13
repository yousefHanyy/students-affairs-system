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
