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
import CourseService from "./services/courseService.js";
import InstructorService from "./services/instructorService.js";
import EmployeeService from "./services/employeeService.js";
import Navbar from "./components/Navbar.js";
import DataTable from "./components/DataTable.js";
import Pagination from "./components/Pagination.js";
import Navbar from "./components/Navbar.js";
import Form from "./components/Form.js";

// Initialize components
const navbar = new Navbar("#navbar-container");
const dataTable = new DataTable(
  "#datatable-container",
  "#table-head",
  "#table-body",
);
const form = new Form("#modal-container");
const pagination = new Pagination(
  "#pagination-container",
  "#pagination-info",
  "#pagination",
);

// Render HTML components
navbar.render();
form.renderToolbar("#toolbar-container");
form.renderModal();
dataTable.renderTableContainer();
pagination.renderContainer();

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
// console.log(await new StudentService().getStudentPageWithSearch(2, 15));
//-----------------------------
//*Testing DataTable Component:

// No need for DOMContentLoaded - modules are deferred by default
// 1) Create DataTable instance;

// ---------- TEST: DataTable + Pagination with real students ----------

// 1) Create instances
const studentService = new StudentService();
const courseService = new CourseService();
const instructorService = new InstructorService();
const employeeService = new EmployeeService();
const table = dataTable;

// Config
let currentPage = 1;
let pageSize = 10;
let currentEntity = "students"; // For future extension to courses, employees, etc.
let searchTerm = ""; // Added for search functionality
const columnsConfig = {
  students: [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "age", label: "Age" },
    { key: "courses", label: "Courses" },
    { key: "department", label: "Department" },
  ],
  courses: [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
  ],
  instructors: [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
    { key: "department", label: "Department" },
    { key: "assignedCourses", label: "Assigned Courses" },
  ],
  employees: [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
    { key: "position", label: "Position" },
  ],
};

table.setColumns(columnsConfig["students"]);
// 2) work with nav tabs to change currentEntity and reload data accordingly (not implemented yet, but you can add event listeners to navbar tabs to set currentEntity and call loadPage(1) to reset to first page)
let navTabs = document.querySelectorAll("#main-tabs .nav-link");
let pageTitle = document.querySelector("#page-title");
const searchInput = document.querySelector("#search-input"); // Added for search
navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Update active class
    navTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    // Update current entity based on data attribute
    currentEntity = tab.getAttribute("data-entity");
    // Update page title
    pageTitle.textContent =
      currentEntity.charAt(0).toUpperCase() + currentEntity.slice(1);
    // Update table columns based on selected entity
    table.setColumns(columnsConfig[currentEntity ?? "students"]);
    console.log(currentEntity);
    // Reset to first page and load data for the selected entity
    currentPage = 1;
    searchTerm = ""; // Clear search term
    if (searchInput) searchInput.value = ""; // Clear search input
    loadPage(currentPage, currentEntity);
  });
});
// 3) Load one page and render table + pagination
async function loadPage(page, currentEntity = "students") {
  let result;
  try {
    switch (currentEntity) {
      case "students":
        if (searchTerm) {
          result = await studentService.getStudentPageWithSearch(
            page,
            pageSize,
            searchTerm,
          );
        } else {
          result = await studentService.getStudentPageWithSearch(
            page,
            pageSize,
          );
        }
        break;
      case "courses":
        if (searchTerm) {
          result = await courseService.getCoursePageWithSearch(
            page,
            pageSize,
            searchTerm,
          );
        } else {
          result = await courseService.getCoursePageWithSearch(page, pageSize);
        }
        break;
      case "instructors":
        if (searchTerm) {
          result = await instructorService.getInstructorPageWithSearch(
            page,
            pageSize,
            searchTerm,
          );
        } else {
          result = await instructorService.getInstructorPageWithSearch(
            page,
            pageSize,
          );
        }
        break;
      case "employees":
        if (searchTerm) {
          result = await employeeService.getEmployeePageWithSearch(
            page,
            pageSize,
            searchTerm,
          );
        } else {
          result = await employeeService.getEmployeePageWithSearch(
            page,
            pageSize,
          );
        }
        break;
      default:
        console.error("Unknown entity:", currentEntity);
        return;
    }

    // result: { data, total, totalPages, currentPage, hasNext, hasPrev }

    console.log("Loaded page data:", result);
    console.log("First student courses:", result.data[0]?.courses);

    // Render table rows
    table.renderRows(result.data);

    // Render pagination UI
    pagination.render(
      result.currentPage,
      result.totalPages,
      result.total,
      pageSize,
    );
  } catch (error) {
    console.error("Error loading page:", error);
    alert("Error loading data: " + error.message);
  }
}

// 4) Hook pagination -> when user changes page, reload
pagination.onPageChange = (newPage) => {
  currentPage = newPage;
  loadPage(currentPage, currentEntity);
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
  const result = await studentService.getStudentPageWithSearch(
    currentPage,
    pageSize,
  );
  const sorted = [...result.data].sort((a, b) => {
    if (a[field] < b[field]) return order === "asc" ? -1 : 1;
    if (a[field] > b[field]) return order === "asc" ? 1 : -1;
    return 0;
  });
  table.renderRows(sorted);
};

// 6) Initial load
loadPage(currentPage);

// 7) Hook page size selector
const pageSizeSelect = document.querySelector("#page-size");
if (pageSizeSelect) {
  pageSizeSelect.addEventListener("change", (event) => {
    pageSize = parseInt(event.target.value);
    currentPage = 1; // Reset to first page
    loadPage(currentPage, currentEntity);
  });
}

// 8) Implement search functionality with debounce
let debounceTimer;
if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchTerm = event.target.value.trim();
      currentPage = 1;
      loadPage(currentPage, currentEntity);
    }, 500);
  });
}
