const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    charts: true,
    reportPageTitle: "Automation Exercise - Relatório de Testes",
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  video: false,
  screenshotOnRunFailure: true,
  retries: { runMode: 2, openMode: 0 },
  e2e: {
    baseUrl: "https://automationexercise.com",
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
});
