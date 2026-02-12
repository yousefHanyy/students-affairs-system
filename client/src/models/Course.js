// Courses Class Model and Validations.
// Course Class Structure (id, name, code) and Validations (name and code are required, code must be unique).
// Note: Validation implementation is inside utils/validators.js, and the Course class is defined in this file.

import validate from "../utils/validators.js";

class Course {
  constructor(id = null, name, code) {
    // json-server handles ID generation for new records, but you still need ID support in the models for edit operations
    if (id) this.id = id;
    this.name = name;
    this.code = code;
  }

  validate() {
    return validate.validateCourse(this);
  }
}

export default Course;
