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

#### Option 1: Install from npm (Recommended)

```bash
npm install students-affairs-system
cd node_modules/students-affairs-system
npm run install-all
```

#### Option 2: Clone from GitHub

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/MoSalem149/students-affairs-system.git
    cd students-affairs-system
    ```

2.  **Install dependencies**:

    ```bash
    npm run install-all
    # or manually
    cd client && npm install
    cd ../server && npm install
    ```

### Running the Application

1.  **Start the mock backend**:

    ```bash
    npm run dev:server
    # or
    cd server
    npm start
    ```

    This will start the `json-server` on `http://localhost:3000`.

2.  **Start the frontend** (in a new terminal):

    ```bash
    npm run dev:client
    # or
    cd client
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or another port shown in the terminal).

3.  **Build for production**:

    ```bash
    npm run build:client
    ```

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
│   ├── node_modules/
│   ├── public/
│   │   └── favicon.ico
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
│       |── app.js
│       |── .env
│       |── index.html
│       |── package-lock.json
│       |── package.json
│       ├── vercel.json
│       └── vite.config.js
├── server/
│   ├── api/
│   │   └── server.js
│   ├── node_modules/
│   ├── db.json
│   ├── package-lock.json
│   ├── package.json
│   └── vercel.json
├── .gitignore
├── .npmignore
├── package.json
└── README.md
```

## npm Package

This project is available as an npm package: [students-affairs-system](https://www.npmjs.com/package/students-affairs-system)

To install:

```bash
npm install students-affairs-system
```

## Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit a pull request with your improvements.

## Links

- **Live Demo**: [https://students-affairs-system.vercel.app/](https://students-affairs-system.vercel.app/)
- **GitHub Repository**: [https://github.com/MoSalem149/students-affairs-system](https://github.com/MoSalem149/students-affairs-system)
- **npm Package**: [https://www.npmjs.com/package/students-affairs-system](https://www.npmjs.com/package/students-affairs-system)
