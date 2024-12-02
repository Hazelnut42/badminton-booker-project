## Project Structure

```
badmintonbooker/
├── backend/           # Backend code
│   ├── config/       # Configuration files
│   │   └── db.js    # MongoDB connection configuration
│   ├── models/      # Data models
│   │   ├── User.js  # User model definition
│   │   ├── courts.js  # Courts model definition
│   │   └── booking.js    # Booking model definition
│   ├── routes/      # API routes
│   │   ├── courtsRoutes.js  # Courts-related routes
│   │   ├── bookRoutes.js  # Booking-related routes
│   │   └── authRoutes.js  # Authentication-related routes
│   └── server.js    # Main server file
│
├── frontend/          # Frontend code
│   ├── node_modules/ # Dependencies
│   ├── public/      # Static assets
│   ├── src/         # Source code
│   │   ├── components/ # React components
│   │   ├── pages/   # Page components
│   │   ├── styles/  # CSS styles
│   │   ├── App.js
│   │   └── index.js
│   └── package.json # Project dependencies configuration
│
├── .env.example      # Environment variables example file
├── .gitignore       # Git ignore file
└── README.md        # Project documentation
```

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation Steps

1. **Clone the Repository**

```bash
git clone https://github.com/Hazelnut42/badminton-booker-project.git
cd badminton-booker-project
```

2. **Backend Setup**

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Create a new .env file and update the MongoDB connection string based on the .env.example format
# (Using Hazel's key. Contact privately for details!)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=XXXXXXXXXXXXXX
REACT_APP_GOOGLE_MAPS_API_KEY=XXXXXXXXXXXXXXXXXXXX
```

3. **Frontend Setup**

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

⚠️ Important Note: You must create a `.env` file and update it with your database connection information.

Example `.env` file structure:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>
JWT_SECRET=XXXXXXXXXXXXXX
REACT_APP_GOOGLE_MAPS_API_KEY=XXXXXXXXXXXXXXXXXXXX
```

### Running the Application

1. **Start the Backend Server**

```bash
# From the backend directory
node server.js
```

2. **Start the Frontend Development Server**

```bash
# From the frontend directory
npm start
```

The application will run at the following addresses:

- frontend: http://localhost:3000
- backend: http://localhost:5001

## Contributing

1. Create a new branch for your feature

```bash
git checkout -b feature/your-feature-name
```

2. Commit your changes

```bash
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name
```

3. Open a Pull Request on GitHub

## Current Features

- User authentication (Sign up/Login)
- Browse courts
- Book courts
- View booking history
- Cancel reservations
- View and update user profile
- More features in development...

## Development Notes

- A shared MongoDB database is used for development.
- Test all functionalities before committing code.

## Troubleshooting

1. If you encounter issues with dependencies, try deleting the node_modules folder and reinstalling them.
2. Ensure that the .env file (not .env.example) exists and that the database connection string is formatted correctly.
3. Verify that your IP address is allowed in MongoDB Atlas.

## Testing
- The testing suite ensures the robustness and reliability of the BadmintonBooker application. It includes unit tests for both frontend and backend components, covering CRUD operations, form validation, and external API integrations.

- Tests ensure:
- All required fields must be filled before form submission.
- Passwords meet complexity requirements (min length, etc.).
- Invalid inputs display appropriate error messages.
