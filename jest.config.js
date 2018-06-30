module.exports = {
  "verbose": true,
  "transform": {
    "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(tsx?|jsx?)$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "json",
    "jsx"
  ],
  "collectCoverage": true,
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!src/**/*.d.ts",
    "!src/declarations/**",
    "!src/server/dev-*",
    "!src/server/index*"
  ],
  "moduleNameMapper": {
    "^\\@src(.*)$": "<rootDir>/src$1",
    "^\\@client(.*)$": "<rootDir>/src/client$1",
    "^\\@root(.*)$": "<rootDir>$1",
    "^\\@server(.*)$": "<rootDir>/src/server$1",
    "\\.(css|less|scss)$": "<rootDir>/config/CSSStub.js"
  },
  "setupFiles": [
    "<rootDir>/src/client/__mocks__/requestAnimationFrame.ts"
  ]
};
