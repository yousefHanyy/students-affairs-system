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
      <div class="container-fluid">
        <!-- Filters row -->
        <div class="row mb-3 g-2">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input
                id="search-input"
                type="text"
                class="form-control"
                placeholder="Search..."
              />
            </div>
          </div>
          <div class="col-md-3 ms-auto text-md-end">
            <select id="page-size" class="form-select">
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
    `;

    if (this.container) {
      this.container.innerHTML = containerHTML;
      // Re-query the elements after rendering
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

      const icon = document.createElement("span");
      icon.classList.add("sort-icon", "bi", "bi-sort-up");
      th.appendChild(icon);

      th.addEventListener("click", () => {
        this.toggleSort(column.key);
      });
      tr.appendChild(th);
    });

    const actionsTh = document.createElement("th");
    actionsTh.classList.add("text-end");
    actionsTh.textContent = "Actions";
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
        const value = item[col.key];

        // Special handling for courses column - create a dropdown
        if (col.key === "courses" && Array.isArray(value)) {
          const select = document.createElement("select");
          select.className = "form-select form-select-sm";

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
        } else if (col.key === "assignedCourses" || Array.isArray(value)) {
          td.textContent = value[0]?.courseName || "No courses assigned";
        } else {
          // Handle other columns normally
          td.textContent = Array.isArray(value) ? value.join(", ") : value;
        }

        tr.appendChild(td);
      });

      //actionsCell:
      const actionsTd = document.createElement("td");
      actionsTd.classList.add("text-end");

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-sm btn-outline-secondary me-1";
      editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
      editBtn.addEventListener("click", () => {
        //delegates the onDelete action to app.js since it will be the one with the functionality
        //checks if onEdit exists and then uses it
        if (this.onEdit) {
          this.onEdit(item);
        }
      });
      actionsTd.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-sm btn-outline-danger";
      delBtn.innerHTML = '<i class="bi bi-trash"></i>';

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
