const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");

const logFile = "linkedin_test_log.txt";
const logMessage = (message) => {
  const timeStamp = new Date().toISOString();
  const logEntry = `[${timeStamp}] - ${message}\n`;
  fs.appendFileSync(logFile, logEntry);
  console.log(message);
};

const createDriver = async () => {
  const chromeOptions = new chrome.Options();
  chromeOptions
    .addArguments("--start-maximized")
    .addArguments("--disable-infobars")
    .addArguments("--disable-gpu")
    .addArguments("--no-sandbox")
    .addArguments("--disable-blink-features=AutomationControlled")
    .addArguments("--disable-dev-shm-usage")
    .addArguments("--remote-debugging-port=9222")
    .addArguments("--disable-popup-blocking")
    .addArguments("--disable-extensions")
    .addArguments("--ignore-certificate-errors")
    .addArguments("--disable-features=IsolateOrigins,site-per-process");

  // Spoof User-Agent
  chromeOptions.addArguments(
    `--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
  );

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();

  // Remove `navigator.webdriver` flag
  await driver.executeScript(
    "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
  );

  return driver;
};

// LinkedIn login test cases
const testLinkedInLogin = async () => {
  const linkedInURL = "https://www.linkedin.com/login";
  const validEmail = "your-email@example.com"; // Replace with actual email
  const validPassword = "your-password"; // Replace with actual password
  const invalidEmail = "invalidemail@example.com";
  const invalidPassword = "InvalidPassword123";

  try {
    logMessage("🔹 Starting LinkedIn Login Tests...");

    // ✅ **TC_001: Verify LinkedIn Login Page Loads**
    logMessage("✅ TC_001: Verify LinkedIn login page loads correctly");
    const driver1 = await createDriver();
    await driver1.get(linkedInURL);
    let title = await driver1.getTitle();
    logMessage("Page Title: " + title);
    logMessage(
      "Login Page Loaded: " + (title.includes("LinkedIn") ? "✅ Pass" : "❌ Fail")
    );
    await driver1.quit();

    // ✅ **TC_002: Invalid Email Check**
    logMessage("✅ TC_002: Enter invalid email and check error message");
    const driver2 = await createDriver();
    await driver2.get(linkedInURL);
    await driver2.findElement(By.id("username")).sendKeys(invalidEmail, Key.RETURN);
    await driver2.findElement(By.id("password")).sendKeys("randompassword", Key.RETURN);
    try {
      await driver2.wait(
        until.elementLocated(
          By.xpath("//div[contains(text(),'Hmm, we don’t recognize that email.')]")
        ),
        5000
      );
      logMessage("Invalid Email Error Displayed: ✅ Pass");
    } catch {
      logMessage("Invalid Email Error NOT Displayed: ❌ Fail");
    }
    await driver2.quit();

    // ✅ **TC_003: Valid Email, Invalid Password Check**
    logMessage("✅ TC_003: Enter valid email but invalid password");
    const driver3 = await createDriver();
    await driver3.get(linkedInURL);
    await driver3.findElement(By.id("username")).sendKeys(validEmail, Key.RETURN);
    await driver3.findElement(By.id("password")).sendKeys(invalidPassword, Key.RETURN);
    try {
      await driver3.wait(
        until.elementLocated(
          By.xpath("//div[contains(text(),'That’s not the right password.')]")
        ),
        5000
      );
      logMessage("Invalid Password Error Displayed: ✅ Pass");
    } catch {
      logMessage("Invalid Password Error NOT Displayed: ❌ Fail");
    }
    await driver3.quit();

    // ✅ **TC_004: Check 'Forgot Password' Link**
    logMessage("✅ TC_004: Check 'Forgot password?' link");
    const driver4 = await createDriver();
    await driver4.get(linkedInURL);
    await driver4.findElement(By.xpath("//a[contains(text(),'Forgot password?')]")).click();
    try {
      await driver4.wait(
        until.elementLocated(By.xpath("//h1[contains(text(),'Find your account')]")),
        5000
      );
      logMessage("'Forgot Password?' Page Loaded: ✅ Pass");
    } catch {
      logMessage("'Forgot Password?' Page NOT Loaded: ❌ Fail");
    }
    await driver4.quit();

    // ✅ **TC_005: Login with Valid Email & Password**
    logMessage("✅ TC_005: Login with valid email and password");
    const driver5 = await createDriver();
    await driver5.get(linkedInURL);
    await driver5.findElement(By.id("username")).sendKeys(validEmail, Key.RETURN);
    await driver5.findElement(By.id("password")).sendKeys(validPassword, Key.RETURN);
    await driver5.findElement(By.xpath("//button[contains(text(),'Sign in')]")).click();
    try {
      await driver5.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'feed-identity-module')]")),
        10000
      );
      logMessage("Login Successful: ✅ Pass");
    } catch {
      logMessage("Login Failed: ❌ Fail");
    }
    await driver5.quit();

    logMessage("✅ LinkedIn Login Tests Completed Successfully.");
  } catch (error) {
    logMessage("❌ Test failed due to an error: " + error);
  }
};

// Run the test
testLinkedInLogin();
