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

  initEvents() {
    const form = this.getFormElement();
    if (form) {
      //makes sure the old form doesnt have the event listener still if itsn't being used
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
      //dynamically import to save memory space if course service is not needed right now
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

    let courses = [];
    if (normalizedEntity === "student") {
      await this.initCourseService();
      courses = await this.courseService.getAllCourses();
    }

    let html = ``;

    if (normalizedEntity === "student") {
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
          <input name="age" type="number" class="form-control" value="${item?.age ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Department</label>
          <input name="department" type="text" class="form-control" required value="${item?.department ?? ""}">
        </div>
        <div class="mb-3">
          <label class="form-label">Courses</label>
          <select name="courses" class="form-select" multiple>
            ${courses
              .map(
                (course) => `
              <option value="${course.id}" ${item?.courses?.includes(String(course.name)) ? "selected" : ""}>
                ${course.name}
              </option>
            `,
              )
              .join("")}
          </select>
          <div class="form-text">Hold Ctrl/Cmd to select multiple courses</div>
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
          <input name="age" type="number" class="form-control" value="${item?.age ?? ""}">
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
      <input name="age" type="number" class="form-control" value="${item?.age ?? ""}">
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

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.getFormElement());
    const data = Object.fromEntries(formData.entries());

    const formEl = this.getFormElement();
    if (this.currentEntity === "student") {
      const coursesSelect = formEl.querySelector('select[name="courses"]');
      data.courses = coursesSelect
        ? Array.from(coursesSelect.selectedOptions).map((opt) =>
            Number(opt.value),
          )
        : [];
    }

    let model;
    if (this.currentEntity === "student") {
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
      const courseSelect = this.getFormElement().querySelector(
        'select[name="assignedCourses"]',
      );
      data.assignedCourses = courseSelect.value
        ? [{ courseId: Number(courseSelect.value) }]
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
      alert(validation.errors.join("\n"));
      return;
    }
    if (this.onSubmit) {
      await this.onSubmit(model, this.currentItem ? "edit" : "add");
    }
    this.modal.hide();
    this.getFormElement().reset();
  }

  renderToolbar(toolbarContainerId = "#toolbar-container") {
    const toolbarContainer = document.querySelector(toolbarContainerId);
    const toolbarHTML = `
      <div class="container-fluid">
        <!-- Toolbar: title + add button -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h4 mb-0" id="page-title">Students</h2>
          <button id="btn-add" class="btn btn-primary">
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
