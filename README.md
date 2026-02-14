## Project Description

This project is a web application developed as part of an ITI (Information Technology Institute) program. It is designed to handle student, course, instructor, and employee data within a Students Affairs department. The system provides essential functionalities such as Create, Read, Update, and Delete (CRUD) operations, along with advanced features like pagination, search, and sorting capabilities. The project is structured with a clear separation between frontend and backend components, utilizing modern web technologies for both.

### Team Members

- Yousef Hany Mahmoud
- Mohamed Wael Salem
- Mohamed Nasr Elkhoreby

## Features

- **Data Management**: Comprehensive CRUD operations for Students, Courses, Instructors, and Employees.
- **Interactive Grid View**: Display data in a clear, tabular format with an intuitive user interface.
- **Pagination**: Efficiently browse through large datasets by viewing records page by page.
- **Search Functionality**: Quickly locate specific records using keywords.
- **Sorting**: Organize data by various criteria to enhance data analysis and accessibility.
- **Client-Side Technologies**: Developed with JavaScript (ES6) and modular architecture for maintainability and scalability.
- **Mock Backend**: Utilizes `json-server` for a simple, file-based REST API, making it easy to set up and run locally for development and testing.
- **Asynchronous Data Handling**: Employs the Fetch API for seamless data retrieval and submission.

## Technical Stack

- **Frontend**: HTML, CSS, JavaScript (ES6, Class-based OOP, Modules)
- **Backend (Mock)**: `json-server` with `db.json` for data storage
- **Data Communication**: Fetch API

## Getting Started

### Prerequisites

To run this project locally, you will need:

- Node.js (which includes npm or yarn)

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/MoSalem149/students-affairs-system.git
    cd students-affairs-system
    ```

2.  **Install json-server** (if you don't have it globally):

    ```bash
    npm install -g json-server
    # or
    yarn global add json-server
    ```

3.  **Start the mock backend**:

    Navigate to the `backend` directory and start the `json-server`.

    ```bash
    cd backend
    json-server --watch db.json --port 3000
    ```

    This will start the `json-server` on `http://localhost:3000`.

4.  **Open the `index.html` file** in your web browser.

    Navigate to the `frontend/public` directory and open `index.html` directly, or serve it using a simple local web server (e.g., `python -m http.server`).

## Usage

Once the application is running, you can:

- View lists of Students, Courses, Instructors, and Employees.
- Add new records using the provided forms.
- Edit existing records by clicking the 'Edit' button on any row.
- Delete records after confirmation.
- Use the search bar to filter records.
- Click on column headers to sort data.

## Project Structure

```
students-affairs-system/
├── client/
│   ├── css/
│   │   └── style.css
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api/
│       │   └── baseApi.js
│       ├── components/
│       │   ├── DataTable.js
│       │   ├── Form.js
│       │   ├── Navbar.js
│       │   └── Pagination.js
│       ├── models/
│       │   ├── Course.js
│       │   ├── Employee.js
│       │   ├── Instructor.js
│       │   └── Student.js
│       ├── services/
│       │   ├── courseService.js
│       │   ├── employeeService.js
│       │   ├── instructorService.js
│       │   └── studentService.js
│       ├── utils/
│       │   └── validators.js
│       └── app.js
├── server/
│   ├── node_modules/
│   ├── db.json
│   ├── package-lock.json
│   └── package.json
├── .gitignore
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit a pull request with your improvements.
