const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");

const logFile = "test_log.txt";
const logMessage = (message) => {
  const timeStamp = new Date().toISOString();
  const logEntry = `[${timeStamp}] - ${message}\n`;
  fs.appendFileSync(logFile, logEntry);
  console.log(message);
};

const createDriver = async () => {
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments("--start-maximized", "--no-sandbox", "--disable-dev-shm-usage");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();

  return driver;
};

const testLinkedInLogin = async () => {
  const linkedInURL = "https://www.linkedin.com/login";
  const validEmail = "your-email@gmail.com";
  const validPassword = "your-password";
  const invalidEmail = "invalidemail@gmail.com";
  const invalidPassword = "InvalidPass123";

  try {
    logMessage("🔹 Starting LinkedIn Login Tests...");
    const driver = await createDriver();
    await driver.get(linkedInURL);

    // Verify Login Page Loads
    logMessage("✅ TC_001: Verify LinkedIn login page loads correctly");
    let title = await driver.getTitle();
    logMessage("Page Title: " + title);

    // Invalid Email Test
    logMessage("✅ TC_002: Enter invalid email and check error message");
    await driver.findElement(By.id("username")).sendKeys(invalidEmail, Key.RETURN);
    await driver.findElement(By.id("password")).sendKeys(invalidPassword, Key.RETURN);

    await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'wrong password')]")), 5000);
    logMessage("Invalid Email Error Displayed: ✅ Pass");

    await driver.quit();
    logMessage("✅ LinkedIn Login Tests Completed Successfully.");
  } catch (error) {
    logMessage("❌ Test failed due to an error: " + error);
  }
};

testLinkedInLogin();

const testAmazonLogin = async () => {
  const amazonURL = "https://www.amazon.com/ap/signin";
  const validEmail = "your-email@gmail.com";
  const validPassword = "your-password";
  const invalidEmail = "invalidemail@gmail.com";
  const invalidPassword = "InvalidPass123";

  try {
    logMessage("🔹 Starting Amazon Login Tests...");
    const driver = await createDriver();
    await driver.get(amazonURL);

    // Verify Login Page Loads
    logMessage("✅ TC_001: Verify Amazon login page loads correctly");
    let title = await driver.getTitle();
    logMessage("Page Title: " + title);

    // Invalid Email Test
    logMessage("✅ TC_002: Enter invalid email and check error message");
    await driver.findElement(By.id("ap_email")).sendKeys(invalidEmail, Key.RETURN);
    await driver.findElement(By.id("continue")).click();

    await driver.wait(until.elementLocated(By.xpath("//span[contains(text(),'We cannot find an account')]")), 5000);
    logMessage("Invalid Email Error Displayed: ✅ Pass");

    await driver.quit();
    logMessage("✅ Amazon Login Tests Completed Successfully.");
  } catch (error) {
    logMessage("❌ Test failed due to an error: " + error);
  }
};

testAmazonLogin();
