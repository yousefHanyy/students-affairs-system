// Course CRUD Operations Service.
// Create, Read, Update, Delete Courses.
// Get, Add new course, Edit course, Delete course, Paginate courses, Search courses, Sort courses.

import Course from "../models/Course.js";
import BaseApi from "../api/baseApi.js";
export default class CourseService extends BaseApi {
  constructor() {
    super();
    this.endpoint = "/courses";
  }

  //UC-01 View list of records
  async getAllCourses() {
    return this.get(this.endpoint);
  }

  //UC-02 Add new record
  async addCourse(name, code) {
    const course = new Course(null, name, code);
    const validation = course.validate();

    if (!validation.isValid) {
      return validation.errors;
    }

    return this.post(this.endpoint, course);
  }

  // UC-03 Edit record
  async editCourse({ id, name, code }) {
    const courseData = new Course(id, name, code);
    const validation = courseData.validate();
    if (!validation.isValid) {
      return validation.errors;
    }
    return this.put(`${this.endpoint}/${id}`, courseData);
  }

  //UC-04 Delete record
  deleteCourse(id) {
    return this.delete(`${this.endpoint}/${id}`);
  }

  //UC-05 Paginate records & UC-06 Search records
  async getCoursePageWithSearch(page = 1, perPage = 10, query = "") {
    const params = new URLSearchParams();
    params.set("_page", String(page));
    params.set("_limit", String(perPage));

    let { data, headers } = await this.getWithHeaders(
      `${this.endpoint}?${params.toString()}&name_like=${query}`,
    );
    const total = Number(headers.get("X-Total-Count") ?? "0");
    const totalPages = Math.ceil(total / perPage);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return { data, total, totalPages, currentPage: page, hasNext, hasPrev };
  }

  //UC-07 Sort records
  getSortedCourses(sortBy = "name", order = "asc") {
    return this.get(`/courses?_sort=${sortBy}&_order=${order}`);
  }

  getCourseById(id) {
    return this.get(`${this.endpoint}/${id}`);
  }
}
