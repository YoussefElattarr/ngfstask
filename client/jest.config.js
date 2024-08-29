module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  globals: {
    "ts-test": {
      tsConfig: "tsconfig.test.json",
    },
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest"],
  },
  transformIgnorePatterns: ["node_modules/(?!(axios)/)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};
