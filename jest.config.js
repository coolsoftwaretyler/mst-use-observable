export default {
    displayName: "test",
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "__tests__/tsconfig.json" }]
    },
    testRegex: ".*\\.test\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js"],
    globals: {
        "ts-jest": {
            tsconfig: "__tests__/tsconfig.json"
        }
    },
    reporters: ["default", "jest-junit"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
}
