// jest.setup.js
import "@testing-library/jest-dom"; // For jest-dom matchers like .toBeInTheDocument()
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
