// Instructor CRUD Operations Service.
// Create, Read, Update, Delete Instructors.
// Get, Add new instructor, Edit instructor, Delete instructor, Paginate instructors, Search instructors, Sort instructors.

import Instructor from "../models/Instructor.js";
import BaseApi from "../api/baseApi.js";
export default class InstructorService extends BaseApi {
  constructor() {
    super();
    this.endpoint = "/employees";
  }

  //UC-01 View list of records
  getAllInstructors() {
    return this.get(`${this.endpoint}?role=instructor`);
  }

  //UC-02 Add new record
  async addInstructor(name, email, age, department, assignedCourses = []) {
    const instructor = new Instructor(
      null,
      name,
      email,
      age,
      department,
      assignedCourses,
    );
    const validation = instructor.validate();

    if (!validation.isValid) {
      return validation.errors.join(", ");
    }

    return this.post(this.endpoint, instructor);
  }

  // UC-03 Edit record
  async editInstructor({ id, name, email, age, department, assignedCourses }) {
    const instructorData = new Instructor(
      id,
      name,
      email,
      age,
      department,
      assignedCourses,
    );
    const validation = instructorData.validate();
    if (!validation.isValid) {
      return validation.errors.join(", ");
    }
    return this.put(`${this.endpoint}/${id}`, instructorData);
  }

  //UC-04 Delete record
  deleteInstructor(id) {
    return this.delete(`${this.endpoint}/${id}`);
  }

  //UC-05 Paginate records
  async getInstructorPage(page = 1, perPage = 10) {
    const params = new URLSearchParams();
    params.set("_page", String(page));
    params.set("_limit", String(perPage));
    params.set("role", "instructor");

    const { data, headers } = await this.getWithHeaders(
      `${this.endpoint}?${params.toString()}`,
    );
    const total = Number(headers.get("X-Total-Count") ?? "0");
    const totalPages = Math.ceil(total / perPage);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return { data, total, totalPages, currentPage: page, hasNext, hasPrev };
  }

  //UC-06 Search records
  searchInstructorsByName(query) {
    return this.get(`${this.endpoint}?role=instructor&name_like=${query}`);
  }

  //UC-07 Sort records
  getSortedInstructors(sortBy = "name", order = "asc") {
    return this.get(
      `${this.endpoint}?role=instructor&_sort=${sortBy}&_order=${order}`,
    );
  }

  getInstructorById(id) {
    return this.get(`${this.endpoint}/${id}`);
  }
}
