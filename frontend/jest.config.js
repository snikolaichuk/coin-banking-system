module.exports = {
    transform: {
        '\\.js$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": require.resolve(
          "./src/scripts/tests/file-mock.js",
        ),
        "\\.(css|scss)$": require.resolve("./src/scripts/tests/style-mock.js"),
      },
}
