// Student CRUD Operations Service.
// Create, Read, Update, Delete Students.
// Get, Add new student, Edit student, Delete student, Paginate students, Search students, Sort students.

//NOTE: We could implement get with headers in BaseApi which is cleaner
import BaseApi from "../api/baseApi.js";
export default class StudentService extends BaseApi {
  constructor() {
    super();
    this.endpoint = "/students";
  }
  getAllStudents() {
    return this.get(this.endpoint);
  }
  async getStudentPage(page = 1, perPage = 10) {
    const params = new URLSearchParams();
    params.set("_page", String(page));
    params.set("_limit", String(perPage));

    const { data, headers } = await this.getWithHeaders(
      `${this.endpoint}?${params.toString()}`,
    );
    const total = Number(headers.get("X-Total-Count") ?? "0");
    const totalPages = Math.ceil(total / perPage);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return { data, total, totalPages, hasNext, hasPrev };
  }
}
