module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      {
        libraryName: "iview",
        libraryDirectory: "src/components"
      },
      "iview"
    ],
    [
      "import",
      {
        libraryName: "@suc/ui",
        libraryDirectory: "components"
      },
      "@suc/ui"
    ],
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
};
