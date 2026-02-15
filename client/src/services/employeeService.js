// Employee CRUD Operations Service.
// Create, Read, Update, Delete Employees.
// Get, Add new employee, Edit employee, Delete employee, Paginate employees, Search employees, Sort employees.

import Employee from "../models/Employee.js";
import BaseApi from "../api/baseApi.js";
export default class EmployeeService extends BaseApi {
  constructor() {
    super();
    this.endpoint = "/employees";
  }

  //UC-01 View list of records
  getAllEmployees() {
    return this.get(`${this.endpoint}?role=employee`);
  }

  //UC-02 Add new record
  async addEmployee(name, email, age, role = "employee", position = null) {
    const employee = new Employee(null, name, email, age, role, position);
    const validation = employee.validate();

    if (!validation.isValid) {
      return validation.errors.join(", ");
    }

    return this.post(this.endpoint, employee);
  }

  // UC-03 Edit record
  async editEmployee({ id, name, email, age, role, position }) {
    const employeeData = new Employee(id, name, email, age, role, position);
    const validation = employeeData.validate();
    if (!validation.isValid) {
      return validation.errors.join(", ");
    }
    return this.put(`${this.endpoint}/${id}`, employeeData);
  }

  //UC-04 Delete record
  deleteEmployee(id) {
    return this.delete(`${this.endpoint}/${id}`);
  }

  //UC-05 Paginate records & UC-06 Search records
  async getEmployeePageWithSearch(page = 1, perPage = 10, query = "") {
    const params = new URLSearchParams();
    params.set("_page", String(page));
    params.set("_limit", String(perPage));
    params.set("role", "employee");

    let { data, headers } = await this.getWithHeaders(
      `${this.endpoint}?${params.toString()}&role=employee&name_like=${query}`,
    );
    const total = Number(headers.get("X-Total-Count") ?? "0");
    const totalPages = Math.ceil(total / perPage);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return { data, total, totalPages, currentPage: page, hasNext, hasPrev };
  }

  //UC-07 Sort records
  getSortedEmployees(sortBy = "name", order = "asc") {
    return this.get(
      `${this.endpoint}?role=employee&_sort=${sortBy}&_order=${order}`,
    );
  }

  getEmployeeById(id) {
    return this.get(`${this.endpoint}/${id}`);
  }
}
