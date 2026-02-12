// Employee Class Model and Validations.
// Employee Class Structure (id, name, email, position) and Validations (name and position are required, and email format).
// Note: Validation implementation is inside utils/validators.js, and the Employee class is defined in this file.

import Validators from "../utils/validators.js";

class Employee {
  constructor(id = null, name, email, position) {
    // json-server handles ID generation for new records, but you still need ID support in the models for edit operations
    if (id) this.id = id;
    this.name = name;
    this.email = email;
    this.position = position;
  }

  validate() {
    return Validators.validateEmployee(this);
  }
}

export default Employee;
