import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./", // Path to your Next.js app directory
});

const customJestConfig = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // Map the @ alias to the root directory
  },
  collectCoverage: true, // Optional: Add this to collect coverage
  coverageReporters: ["json", "lcov", "text", "clover"], // Optional: Customize coverage reporting
};

export default createJestConfig(customJestConfig);
