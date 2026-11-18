<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# Shopping App (React + Express + MySQL)

A beginner-friendly starter project with:
- React + Vite frontend
- Express REST API
- MySQL database
- Product listing page
- Separate Customers page (customer names, email, phone)
- Basic database connection using `mysql2/promise`

## Requirements
- Node.js 20+
- MySQL Server
- A MySQL client such as MySQL Workbench (optional)

## 1. Create the database
Open MySQL Workbench or your MySQL terminal and run the contents of `database/shopping.sql`.

This creates the `shopping_app` database and sample products/customers.

## 2. Configure the backend
Open a terminal in `server`:

```powershell
cd server
Copy-Item .env.example .env
```

Edit `.env` and enter your own MySQL credentials. Do not share your password.

Install packages and start the API:

```powershell
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

Check:
- `http://localhost:5000/api/health`
- `http://localhost:5000/api/products`
- `http://localhost:5000/api/customers`

## 3. Start the React frontend
Open a second terminal in `client`:

```powershell
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

Use the navigation links to switch between **Products** and **Customers**.

## Project layout

```text
shopping-app/
├── client/       React frontend
├── server/       Express API
└── database/     MySQL schema and sample data
```

## Notes
- This is a learning starter, not a production-ready commerce system.
- Authentication, payment processing, order placement, admin authorization, and production security are not implemented yet.
- Customer data shown here is sample data. Do not add real customer personal information to a public demo.
>>>>>>> cbcf18a (Add full-stack Shopping App project)
