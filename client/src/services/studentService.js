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
    const courses = await this.courseService.getAllCourses();
    const studentsArray = Array.isArray(students) ? students : [students];

    const enriched = studentsArray.map((student) => {
      if (student.courses && Array.isArray(student.courses)) {
        const originalCourseIds = [...student.courses];

        // Convert course.id to Number for comparison
        const matched = courses.filter((c) =>
          originalCourseIds.includes(Number(c.id)),
        );

        return {
          ...student,
          courses: matched.map((c) => c.name),
        };
      }
      return student;
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
      return validation.errors.join(", ");
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
      return validation.errors.join(", ");
    }
    return this.put(`${this.endpoint}/${id}`, studentData);
  }

  //UC-04 Delete record
  deleteStudent(id) {
    return this.delete(`${this.endpoint}/${id}`);
  }

  //UC-05 Paginate records
  async getStudentPage(page = 1, perPage = 10) {
    const params = new URLSearchParams();
    params.set("_page", String(page));
    params.set("_limit", String(perPage));

    let { data, headers } = await this.getWithHeaders(
      `${this.endpoint}?${params.toString()}`,
    );

    // Enrich data with course names
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

  //UC-06 Search records
  searchStudentsByName(query) {
    return this.get(`/students?name_like=${query}`);
  }

  //UC-07 Sort records
  getSortedStudents(sortBy = "name", order = "asc") {
    return this.get(`/students?_sort=${sortBy}&_order=${order}`);
  }

  async getStudentById(id) {
    const student = await this.get(`${this.endpoint}/${id}`);
    return this.studentsWithCoursesNames(student);
  }
}
