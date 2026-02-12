// Courses Class Model and Validations.
// Course Class Structure (id, name, code) and Validations (name and code are required, code must be unique).
// Note: Validation implementation is inside utils/validators.js, and the Course class is defined in this file.

import validate from "../utils/validators.js";

class Course {
  constructor(name, code) {
    this.name = name;
    this.code = code;
  }

  validate() {
    return validate.validateCourse(this);
  }
}

export default Course;
