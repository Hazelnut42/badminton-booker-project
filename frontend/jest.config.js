module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    resources: 'usable', 
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], 
  transformIgnorePatterns: ['/node_modules/(?!(axios|moment)/)'], 
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', 
  },
};