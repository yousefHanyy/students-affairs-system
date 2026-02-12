// Student Class Model and Validations.
// Student Class Structure (id, name, email, phone, department) and Validations (name and department are required, and email format).
// Note: Validation implementation is inside utils/validators.js, and the Student class is defined in this file.

import Validators from "../utils/validators.js";

class Student {
  constructor(id = null, name, email, phone, department) {
    // json-server handles ID generation for new records, but you still need ID support in the models for edit operations
    if (id) this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.department = department;
  }

  validate() {
    return Validators.validateStudent(this);
  }
}

export default Student;
