var config = {
  src_folders: [
    'tests/features',
  ],
  webdriver: {
    start_process: true,
    server_path: "chromedriver",
    port: 9515,
  },
  test_runner: {
    type: 'mocha',
    options: {
      ui: 'bdd',
    }
  },
  test_settings: {
    default: {
      globals: {
        waitForConditionTimeout: 5000,
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['no-sandbox', 'headless', 'disable-gpu'],
        },
        javascriptEnabled: true,
        acceptSslCerts: true,
        nativeEvents: true,
      }
    }
  }
};

module.exports = config;
