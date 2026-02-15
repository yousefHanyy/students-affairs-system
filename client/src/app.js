// Our Main JavaScript Entry File.
// app.js is your main application controller. It's the entry point that:
// Initializes the application when the page loads.
// Handles navigation between different sections (Students, Courses, Instructors, Employees).
// Coordinates between services and components.
// Sets up event listeners for the navigation menu.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import StudentService from "./services/studentService.js";
import CourseService from "./services/courseService.js";
import InstructorService from "./services/instructorService.js";
import EmployeeService from "./services/employeeService.js";
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
let currentSortField = null;
let currentSortOrder = "asc";
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
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
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
    currentSortField = null; // Clear sort when switching entity
    currentSortOrder = "asc";
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
        if (currentSortField) {
          result = await studentService.getSortedStudentsPage(
            page,
            pageSize,
            currentSortField,
            currentSortOrder,
            searchTerm,
          );
        } else {
          result = await studentService.getStudentPageWithSearch(
            page,
            pageSize,
            searchTerm,
          );
        }
        break;
      case "courses":
        if (currentSortField) {
          result = await courseService.getSortedCoursesPage(
            page,
            pageSize,
            currentSortField,
            currentSortOrder,
            searchTerm,
          );
        } else {
          result = await courseService.getCoursePageWithSearch(
            page,
            pageSize,
            searchTerm,
          );
        }
        break;
      case "instructors":
        if (currentSortField) {
          result = await instructorService.getSortedInstructorsPage(
            page,
            pageSize,
            currentSortField,
            currentSortOrder,
            searchTerm,
          );
        } else {
          result = await instructorService.getInstructorPageWithSearch(
            page,
            pageSize,
            searchTerm,
          );
        }
        break;
      case "employees":
        if (currentSortField) {
          result = await employeeService.getSortedEmployeesPage(
            page,
            pageSize,
            currentSortField,
            currentSortOrder,
            searchTerm,
          );
        } else {
          result = await employeeService.getEmployeePageWithSearch(
            page,
            pageSize,
            searchTerm,
          );
        }
        break;
      default:
        console.error("Unknown entity:", currentEntity);
        return;
    }

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
// table.onEdit = (item) => {
//   console.log("EDIT clicked:", item);
//   alert(`Edit ${item.name}`);
// };

// table.onDelete = (item) => {
//   console.log("DELETE clicked:", item);
//   alert(`Delete ${item.name}`);
// };

table.onSortChange = (field, order) => {
  // store sort state and reload first page with paginated server-side sort
  currentSortField = field;
  currentSortOrder = order;
  currentPage = 1;
  loadPage(currentPage, currentEntity);
};
// 5) Hook Add/Edit/Delete with Form:
form.onSubmit = async (model, action) => {
  try {
    switch (currentEntity) {
      case "students":
        if (action === "add") {
          await studentService.addStudent(
            model.name,
            model.email,
            model.phone,
            model.age || null,
            model.department,
            model.courses || [],
          );
        } else {
          await studentService.editStudent(model);
        }
        break;
      case "courses":
        if (action === "add") {
          await courseService.addCourse(model.name, model.code);
        } else {
          await courseService.editCourse(model);
        }
        break;
      case "instructors":
        if (action === "add") {
          await instructorService.addInstructor(
            model.name,
            model.email,
            model.age,
            model.department,
            model.assignedCourses || [],
            model.startDate,
            model.endDate,
          );
        } else {
          await instructorService.editInstructor(model);
        }
        break;
      case "employees":
        if (action === "add") {
          await employeeService.addEmployee(
            model.name,
            model.email,
            model.age,
            "employee",
            model.position,
          );
        } else {
          await employeeService.editEmployee(model);
        }
        break;
    }
    await loadPage(currentPage, currentEntity);
  } catch (error) {
    alert(`Error ${action}ing: ${error}`);
  }
};

// Edit
table.onEdit = (item) => {
  form.show(currentEntity, item);
};

// Delete
table.onDelete = async (item) => {
  try {
    const confirmed = await form.showConfirm(
      "Confirm delete",
      `Delete ${item.name}?`,
    );
    if (!confirmed) return;

    switch (currentEntity) {
      case "students":
        await studentService.deleteStudent(item.id);
        break;
      case "courses":
        await courseService.deleteCourse(item.id);
        break;
      case "employees":
        await employeeService.deleteEmployee(item.id);
        break;
      case "instructors":
        await instructorService.deleteInstructor(item.id);
        break;
      // Add cases for instructors/employees when services ready
    }
    await loadPage(currentPage, currentEntity);
  } catch (error) {
    alert("Delete failed: " + error);
  }
};

// Add button handler
document.addEventListener("click", (e) => {
  //e.target.closest used for delegation instad of adding a click listener for every button
  if (e.target.closest("#btn-add")) {
    form.show(currentEntity);
  }
});

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
