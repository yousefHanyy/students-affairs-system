// Navbar Component for navigation and tabs
import logoImg from "../../public/logo.svg";
class Navbar {
  constructor(navContainerId = "#navbar-container") {
    this.container = document.querySelector(navContainerId);
  }

  render() {
    const navbarHTML = `
      <!-- Top navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
        <h1 class="navbar-brand">Students Affairs System</h1>
        <img src="${logoImg}" alt="Logo" width="50" height="50" class="d-inline-block align-text-top me-2">
        </div>
      </nav>

      <div class="container-fluid py-4">
        <!-- Tabs for sections -->
        <ul class="nav nav-tabs mb-3" id="main-tabs">
          <li class="nav-item">
            <button
              class="nav-link active"
              data-entity="students"
              id="tab-students"
            >
              Students
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-entity="courses" id="tab-courses">
              Courses
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              data-entity="instructors"
              id="tab-instructors"
            >
              Instructors
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-entity="employees" id="tab-employees">
              Employees
            </button>
          </li>
        </ul>
      </div>
    `;

    this.container.innerHTML = navbarHTML;
  }
}

export default Navbar;
