// Data Table Component for displaying tabular data with sorting, and searching features.
class DataTable {
  constructor(tableHeadId = "table-head", tableBodyId = "table-body") {
    this.bodyElement = document.querySelector(tableBodyId);
    this.headElement = document.querySelector(tableHeadId);
    this.currentSortField = "id";
    this.currentSortOrder = "asc";
    this.onEdit = null;
    this.onDelete = null;
    this.onSortChange = null;
    this.columns = [];
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

    items.forEach((item) => {
      const tr = document.createElement("tr");

      this.columns.forEach((col) => {
        const td = document.createElement("td");
        td.textContent = item[col.key];
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
