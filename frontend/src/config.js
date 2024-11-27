const config = {
    apiUrl: process.env.NODE_ENV === 'production'
        ? 'https://whispering-caverns-23507-36cfd8145fb6.herokuapp.com/api'
        : 'http://localhost:5001/api'
};

export default config;