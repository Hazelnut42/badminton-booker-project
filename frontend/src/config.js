// Configuration object to store the API URL based on the environment
const config = {
    // Check if the environment is production or development
    apiUrl: process.env.NODE_ENV === 'production'
        ? 'https://whispering-caverns-23507-36cfd8145fb6.herokuapp.com/api' // Use the production API URL if in production environment
        : 'http://localhost:5001/api' // Use the local development API URL if not in production
};

export default config;