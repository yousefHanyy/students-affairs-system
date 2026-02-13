// Student CRUD Operations Service.
// Create, Read, Update, Delete Students.
// Get, Add new student, Edit student, Delete student, Paginate students, Search students, Sort students.

import Student from "../models/Student.js";
import BaseApi from "../api/baseApi.js";
export default class StudentService extends BaseApi {
  constructor() {
    super();
    this.endpoint = "/students";
  }
  getAllStudents() {
    return this.get(this.endpoint);
  }
  getStudentById(id) {
    return this.get(`${this.endpoint}/${id}`);
  }
  async addStudent(name, email, phone, department) {
    const student = new Student(null, name, email, phone, department);
    const validation = student.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    return this.post(this.endpoint, student);
  }
  searchStudentsByName(query) {
    return this.get(`/students?name_like=${query}`);
  }
  getSortedStudents(sortBy = "name", order = "asc") {
    return this.get(`/students?_sort=${sortBy}&_order=${order}`);
  }
  getStudentsPaginated(page = 1, perPage = 10) {
    return this.get(`/students?_page=${page}&_limit=${perPage}`);
  }
}
