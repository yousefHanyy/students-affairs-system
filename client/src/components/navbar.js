// Navbar Component for navigation and tabs
class Navbar {
  constructor(navContainerId = "#navbar-container") {
    this.container = document.querySelector(navContainerId);
  }

  render() {
    const navbarHTML = `
      <!-- Top navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Students Affairs System</a>
        </div>
      </nav>

      <div class="container-fluid py-4">
        <!-- Tabs for sections -->
        <ul class="nav nav-tabs mb-3" id="main-tabs">
          <li class="nav-item">
            <button
              class="nav-link active"
              data-entity="student"
              id="tab-students"
            >
              Students
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-entity="course" id="tab-courses">
              Courses
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              data-entity="instructor"
              id="tab-instructors"
            >
              Instructors
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-entity="employee" id="tab-employees">
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
