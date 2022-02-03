module.exports = {
  transform: {
    "^.+\\.(ts|js)?$": "ts-jest",
  },
  preset:"ts-jest/presets/js-with-ts",
  // setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: "node",
  testRegex: "./.*\\.(test|spec)?\\.(ts|ts|js)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
