// Instructor Class Model and Validations (Extends Employee).
// Instructor Class Structure extends Employee and adds (department, assignedCourses)
// Validations (name and department are required, and email format).
// Note: Validation implementation is inside utils/validators.js, and the Instructor class is defined in this file.

import Employee from "./Employee.js";
import Validators from "../utils/validators.js";
class Instructor extends Employee {
  constructor(id = null, name, email, age, department, assignedCourses = []) {
    // Call parent constructor with role set to "Instructor"
    super(id, name, email, age, "Instructor");

    this.department = department;
    this.assignedCourses = assignedCourses; // Array of {courseId, startDate, endDate}
  }

  validate() {
    return Validators.validateInstructor(this);
  }
}

export default Instructor;
