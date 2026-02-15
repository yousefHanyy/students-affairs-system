// Data Table Component for displaying tabular data with sorting, and searching features.
class DataTable {
  constructor(
    containerSelector = "#datatable-container",
    tableHeadId = "#table-head",
    tableBodyId = "#table-body",
  ) {
    this.container = document.querySelector(containerSelector);
    this.bodyElement = document.querySelector(tableBodyId);
    this.headElement = document.querySelector(tableHeadId);
    this.currentSortField = "id";
    this.currentSortOrder = "asc";
    this.onEdit = null;
    this.onDelete = null;
    this.onSortChange = null;
    this.columns = [];
  }

  renderTableContainer() {
    const containerHTML = `
      <main id="main-content" aria-label="Main table content">
        <div class="container-fluid">
          <!-- Filters row -->
          <div class="row mb-3 g-2">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search" aria-hidden="true"></i></span>
                <input
                  id="search-input"
                  type="text"
                  class="form-control"
                  placeholder="Search..."
                  aria-label="Search table data"
                />
              </div>
            </div>
            <div class="col-md-3 ms-auto text-md-end">
              <label for="page-size" class="visually-hidden">Items per page</label>
              <select id="page-size" class="form-select" aria-label="Select items per page">
                <option value="5">5 per page</option>
                <option value="10" selected>10 per page</option>
                <option value="20">20 per page</option>
              </select>
            </div>
          </div>

          <!-- Table card -->
          <div class="card">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                  <thead class="table-light" id="table-head">
                    <!-- DataTable.js will render headers -->
                  </thead>
                  <tbody id="table-body">
                    <!-- DataTable.js will render rows -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;

    if (this.container) {
      this.container.innerHTML = containerHTML;
      this.bodyElement = document.querySelector("#table-body");
      this.headElement = document.querySelector("#table-head");
    }
  }

  //I receive column data in this function to render headers based on it.
  setColumns(columns) {
    //data expected will be in this format:
    //--[{key:'name', label:'Name'}]
    this.columns = columns;
    this.renderHeader();
  }

  renderHeader() {
    const tr = document.createElement("tr");

    this.columns.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column.label;
      th.classList.add("sortable");
      th.setAttribute("scope", "col"); // Accessibility: table header scope

      const icon = document.createElement("span");
      icon.classList.add("sort-icon", "bi", "bi-sort-up");
      icon.setAttribute("aria-hidden", "true");
      th.appendChild(icon);

      th.addEventListener("click", () => {
        this.toggleSort(column.key);
      });
      tr.appendChild(th);
    });

    const actionsTh = document.createElement("th");
    actionsTh.classList.add("text-end");
    actionsTh.textContent = "Actions";
    actionsTh.setAttribute("scope", "col");
    tr.appendChild(actionsTh);

    this.headElement.innerHTML = "";
    this.headElement.appendChild(tr);
  }

  renderRows(items) {
    this.bodyElement.innerHTML = "";
    if (items.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = this.columns.length + 1;
      td.classList.add("text-center", "text-muted");
      td.textContent = "No data available";
      tr.appendChild(td);
      this.bodyElement.appendChild(tr);
      return;
    }

    items.forEach((item) => {
      const tr = document.createElement("tr");

      this.columns.forEach((col) => {
        const td = document.createElement("td");
        let value = item[col.key];

        //Special handling for courses column - create a dropdown
        if (col.key === "courses" && Array.isArray(value)) {
          const select = document.createElement("select");
          select.className = "form-select form-select-sm";
          select.setAttribute(
            "aria-label",
            "View assigned courses for " + (item.name || "this item"),
          );

          // Add all courses as options
          value.forEach((course) => {
            const option = document.createElement("option");
            option.textContent = course;
            option.value = course;
            select.appendChild(option);
          });

          // If no courses, show message
          if (value.length === 0) {
            const option = document.createElement("option");
            option.textContent = "No courses";
            option.disabled = true;
            select.appendChild(option);
          }

          td.appendChild(select);
        } else if (
          col.key === "assignedCourses" ||
          col.key === "startDate" ||
          col.key === "endDate"
        ) {
          value = item["assignedCourses"] || [];
          if (col.key === "assignedCourses") {
            td.textContent = `${value[0]?.courseName || "No courses assigned"}`;
          } else if (col.key === "startDate") {
            td.textContent = `${value[0]?.startDate || "N/A"}`;
          } else {
            td.textContent = `${value[0]?.endDate || "N/A"}`;
          }
        } else {
          //Handle other columns normally
          td.textContent = Array.isArray(value) ? value.join(", ") : value;
        }

        tr.appendChild(td);
      });

      const actionsTd = document.createElement("td");
      actionsTd.classList.add("text-end");

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-sm btn-outline-secondary me-1";
      editBtn.innerHTML = '<i class="bi bi-pencil" aria-hidden="true"></i>';
      editBtn.setAttribute(
        "aria-label",
        "Edit " + (item.name || "this record"),
      );
      editBtn.setAttribute("type", "button"); // Explicit type for accessibility
      editBtn.addEventListener("click", () => {
        if (this.onEdit) {
          this.onEdit(item);
        }
      });
      actionsTd.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-sm btn-outline-danger";
      delBtn.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i>';
      delBtn.setAttribute(
        "aria-label",
        "Delete " + (item.name || "this record"),
      );
      delBtn.setAttribute("type", "button");
      delBtn.addEventListener("click", () => {
        if (this.onDelete) {
          this.onDelete(item);
        }
      });
      actionsTd.appendChild(delBtn);

      tr.appendChild(actionsTd);
      this.bodyElement.appendChild(tr);
    });
  }

  toggleSort(field) {
    //checking if the field has been clicked before to toggle the order or select field
    if (this.currentSortField === field) {
      if (this.currentSortOrder === "asc") {
        this.currentSortOrder = "desc";
      } else {
        this.currentSortOrder = "asc";
      }
    } else {
      this.currentSortField = field;
      this.currentSortOrder = "asc";
    }
    if (this.onSortChange) {
      this.onSortChange(this.currentSortField, this.currentSortOrder);
    }
  }
}
export default DataTable;
