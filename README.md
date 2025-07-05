## Setup and Installation

### Prerequisites

Ensure you have the following software installed:

* **Node.js** (LTS version)
* **CockroachDB** (for your database)
* **Postman** (for testing the API)

### Steps to Set Up

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Vandit1121/BiteSpeed-Backend
   ```

2. **Navigate into the project directory:**

   ```bash
   cd BiteSpeed-Backend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the root directory of the project and add the necessary environment variables:

   ```
   DATABASE_URL
   ```

   * **DATABASE\_URL**: Set this to your CockroachDB connection string. Replace `your_username`, `your_password`, and `localhost:26257` with your actual database credentials and connection information.

5. **Start the server:**

   Once everything is set up, start the server with:

   ```bash
   npm start
   ```

   The API will be running at `http://localhost:4001` by default.

---

## API Documentation

For a better understanding of the API and available endpoints, refer to the Postman documentation for the BiteSpeed Backend API:

[View Postman Documentation](https://documenter.getpostman.com/view/23158302/2sB34cnhNy)

You can import the Postman collection into your Postman app to easily test the API and explore the available endpoints.

