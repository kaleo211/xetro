import puppetteer from "puppeteer";

let browser;
let page;

beforeAll(async () => {
  browser = await puppetteer.launch({
    headless: true,
    slowMo: 80,
  });
  page = await browser.newPage();
});

afterAll(() => {
  browser.close();
});

describe("refresh page", () => {
  it("stay on the same page", async () => {
    await page.goto("http://localhost:8080");
  }, 16000);
});
