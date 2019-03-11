describe('Google demo test for Mocha', function () {
  describe('with Nightwatch', function () {
    before(function (browser, done) {
      done();
    });

    after(function (browser, done) {
      browser.end(function () {
        done();
      });
    });

    afterEach(function (browser, done) {
      done();
    });

    beforeEach(function (browser, done) {
      done();
    });

    it('uses BDD to run the Google simple test', function (browser) {
      browser
        .url('localhost:8080')
        .expect.element('body').to.be.present.before(1000);
    });
  });
});
