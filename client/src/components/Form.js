// Form Component for Show Adding and Editing Class Models (Course, Employee, Instructor, Student).
// Note: Validation logic is implemented in utils/validators.js, and the form handles both adding and editing based on props.

class Form {
  constructor(modalContainerId = "#modal-container") {
    this.modalContainer = document.querySelector(modalContainerId);
    this.formElement = null;
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
