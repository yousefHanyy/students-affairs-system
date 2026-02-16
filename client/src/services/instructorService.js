// Instructor CRUD Operations Service.
// Create, Read, Update, Delete Instructors.
// Get, Add new instructor, Edit instructor, Delete instructor, Paginate instructors, Search instructors, Sort instructors.

import Instructor from "../models/Instructor.js";
import CourseService from "./courseService.js";
import BaseApi from "../api/baseApi.js";
export default class InstructorService extends BaseApi {
  constructor() {
    super();
    this.endpoint = "/employees";
  }

  async instructorWithCoursesNames(instructors) {
    const courseService = new CourseService();
    const courses = await courseService.getAllCourses();
    const instructorsArray = Array.isArray(instructors)
      ? instructors
      : [instructors];

    const enriched = instructorsArray.map((instructor) => {
      if (!Array.isArray(instructor.assignedCourses)) return instructor;

      const mapped = instructor.assignedCourses.map((ac) => {
        const found = courses.find((c) => Number(c.id) === Number(ac.courseId));
        return {
          ...ac,
          courseName: found ? found.name : "Deleted course",
        };
      });

      return { ...instructor, assignedCourses: mapped };
    });

    return Array.isArray(instructors) ? enriched : enriched[0];
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
      return validation.errors;
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
      return validation.errors;
    }
    return this.put(`${this.endpoint}/${id}`, instructorData);
  }

  //UC-04 Delete record
  deleteInstructor(id) {
    return this.delete(`${this.endpoint}/${id}`);
  }

  //UC-05 Paginate records & UC-06 Search records
  async getInstructorPageWithSearch(page = 1, perPage = 10, query = "") {
    const params = new URLSearchParams();
    params.set("_page", String(page));
    params.set("_limit", String(perPage));
    params.set("role", "instructor");

    let { data, headers } = await this.getWithHeaders(
      `${this.endpoint}?${params.toString()}&name_like=${query}`,
    );
    const total = Number(headers.get("X-Total-Count") ?? "0");
    const totalPages = Math.ceil(total / perPage);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    data = await this.instructorWithCoursesNames(data);
    return { data, total, totalPages, currentPage: page, hasNext, hasPrev };
  }

  //UC-07 Paginated server-side sort
  async getSortedInstructorsPage(
    page = 1,
    perPage = 10,
    sortBy = "name",
    order = "asc",
    query = "",
  ) {
    const params = new URLSearchParams();
    params.set("_page", String(page));
    params.set("_limit", String(perPage));
    params.set("role", "instructor");
    params.set("_sort", sortBy);
    params.set("_order", order);

    let { data, headers } = await this.getWithHeaders(
      `${this.endpoint}?${params.toString()}&name_like=${query}`,
    );

    data = await this.instructorWithCoursesNames(data);

    const total = Number(headers.get("X-Total-Count") ?? "0");
    const totalPages = Math.ceil(total / perPage);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    return { data, total, totalPages, currentPage: page, hasNext, hasPrev };
  }

  async getInstructorById(id) {
    let instructor = this.get(`${this.endpoint}/${id}`);
    return this.instructorWithCoursesNames(instructor);
  }
}
