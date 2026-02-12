// Student CRUD Operations Service.
// Create, Read, Update, Delete Students.
// Get, Add new student, Edit student, Delete student, Paginate students, Search students, Sort students.

import BaseApi from "../api/baseApi.js";
export default class StudentService extends BaseApi {
  constructor() {
    super();
  }
  getAllStudents() {
    return this.get("/students");
  }
}
