// Form Component for Show Adding and Editing Class Models (Course, Employee, Instructor, Student).
// Note: Validation logic is implemented in utils/validators.js, and the form handles both adding and editing based on props.

import { Modal } from "bootstrap";
import Course from "../models/Course.js";
import Employee from "../models/Employee.js";
import Instructor from "../models/Instructor.js";
import Student from "../models/Student.js";

class Form {
  constructor(modalContainerId = "#modal-container") {
    this.modalContainer = document.querySelector(modalContainerId);
    this.formElement = null;
    this.modal = null;
    this.currentEntity = "student";
    this.currentItem = null;
    this.onSubmit = null;
    this.courseService = null;

    this.renderModal();
    this.initEvents();
  }

  renderModal() {
    const modalHTML = `
      <div class="modal fade" id="entity-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <form
            id="entity-form"
            class="modal-content needs-validation"
            novalidate
          >
            <div class="modal-header">
              <h5 class="modal-title" id="entity-modal-title">Add</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div class="modal-body" id="entity-form-body">
              <!-- Form fields will be rendered here -->
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.modalContainer.innerHTML = modalHTML;

    this.formElement = document.querySelector("#entity-form");
    this.modal = new Modal(document.querySelector("#entity-modal"));

    this.initEvents();
  }

  // Show a confirmation modal and return a Promise<boolean>
  showConfirm(title = "Confirm", message = "Are you sure?") {
    // If confirm modal doesn't exist, create it
    let confirmModalEl = document.querySelector("#confirm-modal");
    if (!confirmModalEl) {
      const confirmHtml = `
        <div class="modal fade" id="confirm-modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="confirm-modal-title"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body" id="confirm-modal-body"></div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirm-modal-ok">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Append confirm modal markup to container
      this.modalContainer.insertAdjacentHTML("beforeend", confirmHtml);
      confirmModalEl = document.querySelector("#confirm-modal");
    }

    const modalInstance = new Modal(confirmModalEl);
    const titleEl = confirmModalEl.querySelector("#confirm-modal-title");
    const bodyEl = confirmModalEl.querySelector("#confirm-modal-body");
    const okBtn = confirmModalEl.querySelector("#confirm-modal-ok");

    titleEl.textContent = title;
    bodyEl.textContent = message;

    return new Promise((resolve) => {
      const cleanup = () => {
        okBtn.removeEventListener("click", onOk);
        confirmModalEl.removeEventListener("hidden.bs.modal", onHidden);
      };

      const onOk = () => {
        cleanup();
        modalInstance.hide();
        resolve(true);
      };

      const onHidden = () => {
        cleanup();
        resolve(false);
      };

      okBtn.addEventListener("click", onOk);
      confirmModalEl.addEventListener("hidden.bs.modal", onHidden, {
        once: true,
      });

      modalInstance.show();
    });
  }

  initEvents() {
    const form = this.getFormElement();
    if (form) {
      // Remove existing listener if any to avoid duplicates
      form.removeEventListener("submit", this.handleSubmit.bind(this));
      form.addEventListener("submit", (e) => {
        this.handleSubmit(e);
      });
    }
  }

  getFormElement() {
    return this.formElement || document.querySelector("#entity-form");
  }

  getModalTitleElement() {
    return document.querySelector("#entity-modal-title");
  }

  getFormBodyElement() {
    return document.querySelector("#entity-form-body");
  }

  async initCourseService() {
    if (!this.courseService) {
      // dynamically import to save memory space if course service is not needed right now
      const { default: CourseService } =
        await import("../services/courseService.js");
      this.courseService = new CourseService();
    }
  }

  async buildFields(entity, item = null) {
    // normalize entity names (app uses plurals like 'students')
    const normalizedEntity =
      entity && entity.endsWith("s") ? entity.slice(0, -1) : entity;
    this.currentEntity = normalizedEntity;
    this.currentItem = item;

    let html = ``;

    if (normalizedEntity === "student") {
      await this.initCourseService();
      const courses = await this.courseService.getAllCourses();

      html = `
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input name="name" type="text" class="form-control" required value="${item?.name ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input name="email" type="email" class="form-control" required value="${item?.email ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Phone</label>
          <input name="phone" type="text" class="form-control" required value="${item?.phone ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Age</label>
          <input name="age" type="number" class="form-control" required value="${item?.age ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Department</label>
          <input name="department" type="text" class="form-control" required value="${item?.department ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Courses</label>
          <div id="courses-checkbox-group" class="row g-2">
            ${(() => {
              // Display 3 courses per row
              const perRow = 3;
              let html = "";
              for (let i = 0; i < courses.length; i += perRow) {
                html += '<div class="row">';
                for (let j = i; j < i + perRow && j < courses.length; j++) {
                  const course = courses[j];
                  html += `
                    <div class="col-md-4 col-12">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="courses" id="course-${course.id}" value="${course.id}" ${
                          item &&
                          item.courses &&
                          item.courses.map(String).includes(String(course.id))
                            ? "checked"
                            : ""
                        }>
                        <label class="form-check-label" for="course-${course.id}">${course.name}</label>
                      </div>
                    </div>
                  `;
                }
                html += "</div>";
              }
              return html;
            })()}
          </div>
          <div id="courses-error-placeholder"></div>
        </div>
      `;
    } else if (normalizedEntity === "course") {
      html = `
        <div class="mb-3">
          <label class="form-label">Course Name</label>
          <input name="name" type="text" class="form-control" required value="${item?.name ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Course Code</label>
          <input name="code" type="text" class="form-control" required value="${item?.code ?? ""}">
        </div>
      `;
    } else if (normalizedEntity === "employee") {
      html = `
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input name="name" type="text" class="form-control" required value="${item?.name ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input name="email" type="email" class="form-control" required value="${item?.email ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Age</label>
          <input name="age" type="number" class="form-control" required value="${item?.age ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Position</label>
          <input name="position" type="text" class="form-control" required value="${item?.position ?? ""}">
        </div>
      `;
    } else if (normalizedEntity === "instructor") {
      // Load courses for instructor dropdown
      await this.initCourseService();
      const courses = await this.courseService.getAllCourses();

      html = `
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input name="name" type="text" class="form-control" required value="${item?.name ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input name="email" type="email" class="form-control" required value="${item?.email ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Age</label>
          <input name="age" type="number" class="form-control" required value="${item?.age ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Department</label>
          <input name="department" type="text" class="form-control" required value="${item?.department ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Assigned Course</label>
          <select name="assignedCourses" class="form-select" required>
            <option value="">Select a course</option>
            ${courses
              .map(
                (course) => `
              <option value="${course.id}" ${item?.assignedCourses?.[0]?.courseId === Number(course.id) ? "selected" : ""}>
                ${course.name}
              </option>
            `,
              )
              .join("")}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Start Date</label>
          <input name="startDate" type="date" class="form-control" required value="${item?.assignedCourses?.[0]?.startDate ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">End Date</label>
          <input name="endDate" type="date" class="form-control" required value="${item?.assignedCourses?.[0]?.endDate ?? ""}">
        </div>
      `;
    }

    this.getFormBodyElement().innerHTML = html;
    const titleEntity =
      normalizedEntity.charAt(0).toUpperCase() + normalizedEntity.slice(1);
    this.getModalTitleElement().textContent = item
      ? `Edit ${titleEntity}`
      : `Add ${titleEntity}`;
  }

  async show(entity, item = null) {
    await this.buildFields(entity, item);
    this.modal.show();
  }

  clearErrors() {
    const form = this.getFormElement();
    if (!form) return;

    // Remove all 'is-invalid' classes from inputs and selects
    form.querySelectorAll(".is-invalid").forEach((element) => {
      element.classList.remove("is-invalid");
    });

    // Remove all error message divs
    form.querySelectorAll(".invalid-feedback").forEach((element) => {
      element.remove();
    });
    // Also clear the courses error placeholder
    const coursesErrorDiv = document.getElementById(
      "courses-error-placeholder",
    );
    if (coursesErrorDiv) {
      coursesErrorDiv.innerHTML = "";
    }
  }

  displayErrors(errors) {
    const form = this.getFormElement();
    if (!form) return;

    // Iterate through each field error
    Object.keys(errors).forEach((fieldName) => {
      const errorValue = errors[fieldName];

      // Special handling for courses (show error under header, not per checkbox)
      if (fieldName === "courses" && errorValue) {
        const coursesErrorDiv = document.getElementById(
          "courses-error-placeholder",
        );
        if (coursesErrorDiv) {
          coursesErrorDiv.innerHTML = `<div class="invalid-feedback" style="display:block">${errorValue}</div>`;
        }
        return;
      }

      // Handle nested objects (e.g., assignedCourses: { courseId: "...", startDate: "..." })
      if (typeof errorValue === "object" && errorValue !== null) {
        Object.keys(errorValue).forEach((nestedField) => {
          let input = null;
          const errorMessage = errorValue[nestedField];

          if (fieldName === "assignedCourses") {
            if (nestedField === "courseId") {
              input = form.querySelector(`[name="assignedCourses"]`);
            } else if (
              nestedField === "startDate" ||
              nestedField === "endDate"
            ) {
              input = form.querySelector(`[name="${nestedField}"]`);
            }
          }

          if (input && errorMessage) {
            this.applyErrorToInput(input, errorMessage);
          }
        });
      } else {
        // Handle simple string errors (direct field errors)
        const input = form.querySelector(`[name="${fieldName}"]`);
        if (input) {
          this.applyErrorToInput(input, errorValue);
        }
      }
    });
  }

  applyErrorToInput(input, message) {
    input.classList.add("is-invalid");
    const errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    errorDiv.style.display = "block";
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    this.clearErrors();

    const formData = new FormData(this.getFormElement());
    const data = Object.fromEntries(formData.entries());

    const formEl = this.getFormElement();
    let model;

    if (this.currentEntity === "student") {
      const checkedCourses = formEl.querySelectorAll(
        'input[name="courses"]:checked',
      );
      data.courses = checkedCourses
        ? Array.from(checkedCourses).map((ch) => Number(ch.value))
        : [];

      model = new Student(
        this.currentItem?.id,
        data.name,
        data.email,
        data.phone,
        parseInt(data.age),
        data.department,
        data.courses,
      );
    } else if (this.currentEntity === "course") {
      model = new Course(this.currentItem?.id, data.name, data.code);
    } else if (this.currentEntity === "instructor") {
      const courseSelect = formEl.querySelector(
        'select[name="assignedCourses"]',
      );
      data.assignedCourses = courseSelect.value
        ? [
            {
              courseId: Number(courseSelect.value),
              startDate: data.startDate,
              endDate: data.endDate,
            },
          ]
        : [];

      model = new Instructor(
        this.currentItem?.id,
        data.name,
        data.email,
        parseInt(data.age),
        data.department,
        data.assignedCourses,
      );
    } else if (this.currentEntity === "employee") {
      model = new Employee(
        this.currentItem?.id,
        data.name,
        data.email,
        parseInt(data.age),
        "employee",
        data.position,
      );
    }

    const validation = model.validate();
    if (!validation.isValid) {
      this.displayErrors(validation.errors);
      return;
    }

    if (this.onSubmit) {
      await this.onSubmit(model, this.currentItem ? "edit" : "add");
    }

    this.modal.hide();
    formEl.reset();
  }

  renderToolbar(toolbarContainerId = "#toolbar-container") {
    const toolbarContainer = document.querySelector(toolbarContainerId);
    const toolbarHTML = `
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h4 mb-0" id="page-title">Students</h2>
          <button id="btn-add" class="btn btn-success">
            <i class="bi bi-plus-lg"></i> Add
          </button>
        </div>
      </div>
    `;
    if (toolbarContainer) {
      toolbarContainer.innerHTML = toolbarHTML;
    }
  }
}

export default Form;
