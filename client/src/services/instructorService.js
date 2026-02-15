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
    let courseService = new CourseService();
    const courses = await courseService.getAllCourses();
    const instructorsArray = Array.isArray(instructors)
      ? instructors
      : [instructors];

    const enriched = instructorsArray.map((instructor) => {
      if (
        instructor.assignedCourses &&
        Array.isArray(instructor.assignedCourses)
      ) {
        // Save original IDs before any transformation
        const originalCourseId = instructor.assignedCourses[0].courseId;
        const courseName =
          courses.find((c) => c.id === originalCourseId)?.name ||
          "Unknown Course";
        const originalAssignedCourses = instructor.assignedCourses;

        // Return NEW object with transformed courses
        return {
          ...instructor,
          assignedCourses: [
            {
              ...originalAssignedCourses[0],
              courseName: courseName,
            },
          ],
        };
      }
      return instructor;
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

  //UC-07 Sort records
  async getSortedInstructors(sortBy = "name", order = "asc") {
    let instructor = this.get(
      `${this.endpoint}?role=instructor&_sort=${sortBy}&_order=${order}`,
    );
    return this.instructorWithCoursesNames(instructor);
  }

  async getInstructorById(id) {
    let instructor = this.get(`${this.endpoint}/${id}`);
    return this.instructorWithCoursesNames(instructor);
  }
}
