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
// let student = await new StudentService().getStudentById(1);
// console.log(student);
// let courses = await new CourseService().getAllCourses();
// console.log(courses);
// student.courses = courses
//   .filter((c) => {
//     if (student.courses.includes(c.id)) return c;
//   })
//   .map((c) => c.name);
// console.log(student);
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

// No need for DOMContentLoaded - modules are deferred by default
// 1) Create DataTable instance;
import DataTable from "./components/DataTable.js";
import Pagination from "./components/Pagination.js";

// ---------- TEST: DataTable + Pagination with real students ----------

// 1) Create instances
const studentService = new StudentService();
const table = new DataTable("#table-head", "#table-body");
const pagination = new Pagination("#pagination-info", "#pagination");

// Config
let currentPage = 1;
const pageSize = 10;

// 2) Configure table columns
table.setColumns([
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "age", label: "Age" },
  { key: "courses", label: "Courses" },
  { key: "department", label: "Department" },
]);

// 3) Load one page and render table + pagination
async function loadPage(page) {
  const result = await studentService.getStudentPage(page, pageSize);
  // result: { data, total, totalPages, currentPage, hasNext, hasPrev }
  console.log(result)
  // Render table rows
  table.renderRows(result.data);

  // Render pagination UI
  pagination.render(
    result.currentPage,
    result.totalPages,
    result.total,
    pageSize,
  );
}

// 4) Hook pagination -> when user changes page, reload
pagination.onPageChange = (newPage) => {
  currentPage = newPage;
  loadPage(currentPage);
};

// 5) Optional: hook edit/delete & sort for extra testing
table.onEdit = (item) => {
  console.log("EDIT clicked:", item);
  alert(`Edit ${item.name}`);
};

table.onDelete = (item) => {
  console.log("DELETE clicked:", item);
  alert(`Delete ${item.name}`);
};

table.onSortChange = async (field, order) => {
  console.log("SORT changed:", field, order);
  // If you want server‑side sort with pagination later, call a different service method.
  // For now, we just sort in memory the current page:
  const result = await studentService.getStudentPage(currentPage, pageSize);
  const sorted = [...result.data].sort((a, b) => {
    if (a[field] < b[field]) return order === "asc" ? -1 : 1;
    if (a[field] > b[field]) return order === "asc" ? 1 : -1;
    return 0;
  });
  table.renderRows(sorted);
};

// 6) Initial load
loadPage(currentPage);
