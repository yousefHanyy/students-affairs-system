// Student CRUD Operations Service.
// Create, Read, Update, Delete Students.
// Get, Add new student, Edit student, Delete student, Paginate students, Search students, Sort students.

import Student from "../models/Student.js";
import CourseService from "./courseService.js";
import BaseApi from "../api/baseApi.js";
export default class StudentService extends BaseApi {
  constructor() {
    super();
    this.endpoint = "/students";
    this.courseService = new CourseService();
  }

  // method to replace course IDs with course names
  async studentsWithCoursesNames(students) {
    const courses = await this.courseService.getAllCourses(); // array of courses
    const studentsArray = Array.isArray(students) ? students : [students];

    const enriched = studentsArray.map((student) => {
      if (!Array.isArray(student.courses)) return student;

      // keep same length, but show message for missing ones
      const namesOrMissing = student.courses.map((courseId) => {
        const found = courses.find((c) => Number(c.id) === Number(courseId));
        return found ? found.name : "Deleted course";
      });

      return { ...student, courses: namesOrMissing };
    });

    return Array.isArray(students) ? enriched : enriched[0];
  }

  //UC-01 View list of records
  async getAllStudents() {
    const students = await this.get(this.endpoint);
    return this.studentsWithCoursesNames(students);
  }
  //UC-02 Add new record
  async addStudent(name, email, phone, age, department, courses = []) {
    const student = new Student(
      null,
      name,
      email,
      phone,
      age,
      department,
      courses,
    );
    const validation = student.validate();

    if (!validation.isValid) {
      return validation.errors;
    }

    return this.post(this.endpoint, student);
  }

  // UC-03 Edit record
  async editStudent({ id, name, email, phone, age, department, courses }) {
    const studentData = new Student(
      id,
      name,
      email,
      phone,
      age,
      department,
      courses,
    );
    const validation = studentData.validate();
    if (!validation.isValid) {
      return validation.errors;
    }
    return this.put(`${this.endpoint}/${id}`, studentData);
  }

  //UC-04 Delete record
  deleteStudent(id) {
    return this.delete(`${this.endpoint}/${id}`);
  }

  //UC-05 Paginate records & UC-06 Search records
  async getStudentPageWithSearch(page = 1, perPage = 10, query = "") {
    const params = new URLSearchParams();
    params.set("_page", String(page));
    params.set("_limit", String(perPage));

    let { data, headers } = await this.getWithHeaders(
      `${this.endpoint}?${params.toString()}&name_like=${query}`,
    );

    data = await this.studentsWithCoursesNames(data);

    const total = Number(headers.get("X-Total-Count") ?? "0");
    const totalPages = Math.ceil(total / perPage);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      total,
      totalPages,
      currentPage: page,
      hasNext,
      hasPrev,
    };
  }

  //UC-07 Paginated server-side sort
  async getSortedStudentsPage(
    page = 1,
    perPage = 10,
    sortBy = "name",
    order = "asc",
    query = "",
  ) {
    const params = new URLSearchParams();
    params.set("_page", String(page));
    params.set("_limit", String(perPage));
    params.set("_sort", sortBy);
    params.set("_order", order);

    let { data, headers } = await this.getWithHeaders(
      `${this.endpoint}?${params.toString()}&name_like=${query}`,
    );

    data = await this.studentsWithCoursesNames(data);

    const total = Number(headers.get("X-Total-Count") ?? "0");
    const totalPages = Math.ceil(total / perPage);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return { data, total, totalPages, currentPage: page, hasNext, hasPrev };
  }

  async getStudentById(id) {
    const student = await this.get(`${this.endpoint}/${id}`);
    return this.studentsWithCoursesNames(student);
  }
}
