// Student Class Model and Validations.
// Student Class Structure (id, name, email, phone, department) and Validations (name and department are required, and email format).
// Note: Validation implementation is inside utils/validators.js, and the Student class is defined in this file.

import validate from "../utils/validators.js";

class Student {
  constructor(name, email, phone, department) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.department = department;
  }

  Validate() {
    return validate.validateStudent(this);
  }
}

export default Student;
