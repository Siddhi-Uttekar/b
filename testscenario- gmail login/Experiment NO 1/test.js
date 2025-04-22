const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");

const logFile = "gmail_test_log.txt";
const logMessage = (message) => {
  const timeStamp = new Date().toISOString();
  const logEntry = `[${timeStamp}] - ${message}\n`;
  fs.appendFileSync(logFile, logEntry);
  console.log(message); // Print to console
};

const createDriver = async () => {
  const chromeOptions = new chrome.Options();
  chromeOptions
    .addArguments("--start-maximized") // Start browser maximized
    .addArguments("--disable-infobars") // Remove infobars
    .addArguments("--disable-gpu") // Disable GPU acceleration
    .addArguments("--no-sandbox") // For some environments
    .addArguments("--disable-blink-features=AutomationControlled") // Prevent detection
    .addArguments("--disable-dev-shm-usage") // Prevent memory issues
    .addArguments("--remote-debugging-port=9222") // Debugging
    .addArguments("--disable-popup-blocking") // Allow pop-ups
    .addArguments("--disable-extensions") // No extensions
    .addArguments("--ignore-certificate-errors") // Ignore SSL warnings
    .addArguments("--disable-features=IsolateOrigins,site-per-process"); // Avoid isolation

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

// Gmail login test cases
const testGmailLogin = async () => {
  const gmailURL = "https://mail.google.com/";
  const validEmail = "your-email@gmail.com"; // Replace with actual email
  const validPassword = "your-password"; // Replace with actual password
  const invalidEmail = "invalidemail@gmail.com";
  const invalidPassword = "InvalidPassword123";

  try {
    logMessage("🔹 Starting Gmail Login Tests...");

    // ✅ **TC_001: Verify Gmail Login Page Loads**
    logMessage("✅ TC_001: Verify Gmail login page loads correctly");
    const driver1 = await createDriver();
    await driver1.get(gmailURL);
    let title = await driver1.getTitle();
    logMessage("Page Title: " + title);
    logMessage(
      "Login Page Loaded: " + (title.includes("Gmail") ? "✅ Pass" : "❌ Fail")
    );
    await driver1.quit();

    // ✅ **TC_002: Invalid Email Check**
    logMessage("✅ TC_002: Enter invalid email and check error message");
    const driver2 = await createDriver();
    await driver2.get(gmailURL);
    await driver2
      .findElement(By.id("identifierId"))
      .sendKeys(invalidEmail, Key.RETURN);
    try {
      await driver2.wait(
        until.elementLocated(
          By.xpath(
            "//div[contains(text(),'Couldn’t find your Google Account')]"
          )
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
    await driver3.get(gmailURL);
    await driver3
      .findElement(By.id("identifierId"))
      .sendKeys(validEmail, Key.RETURN);
    await driver3.wait(until.elementLocated(By.name("Passwd")), 5000);
    await driver3
      .findElement(By.name("Passwd"))
      .sendKeys(invalidPassword, Key.RETURN);
    try {
      await driver3.wait(
        until.elementLocated(
          By.xpath("//span[contains(text(),'Wrong password')]")
        ),
        5000
      );
      logMessage("Invalid Password Error Displayed: ✅ Pass");
    } catch {
      logMessage("Invalid Password Error NOT Displayed: ❌ Fail");
    }
    await driver3.quit();

    // ✅ **TC_004: Check 'Forgot Email' Link**
    logMessage("✅ TC_004: Check 'Forgot email?' link");
    const driver4 = await createDriver();
    await driver4.get(gmailURL);
    await driver4
      .findElement(By.xpath("//button[contains(text(),'Forgot email?')]"))
      .click();
    try {
      await driver4.wait(
        until.elementLocated(
          By.xpath("//h1[contains(text(),'Find your email')]")
        ),
        5000
      );
      logMessage("'Forgot Email?' Page Loaded: ✅ Pass");
    } catch {
      logMessage("'Forgot Email?' Page NOT Loaded: ❌ Fail");
    }
    await driver4.quit();

    // ✅ **TC_005: Check 'Forgot Password' Link**
    logMessage("✅ TC_005: Check 'Forgot password?' link");
    const driver5 = await createDriver();
    await driver5.get(gmailURL);
    await driver5
      .findElement(By.id("identifierId"))
      .sendKeys(validEmail, Key.RETURN);
    await driver5.wait(until.elementLocated(By.name("Passwd")), 5000);
    await driver5
      .findElement(By.xpath("//button[contains(text(),'Forgot password?')]"))
      .click();
    try {
      await driver5.wait(
        until.elementLocated(
          By.xpath("//h1[contains(text(),'Account recovery')]")
        ),
        5000
      );
      logMessage("'Forgot Password?' Page Loaded: ✅ Pass");
    } catch {
      logMessage("'Forgot Password?' Page NOT Loaded: ❌ Fail");
    }
    await driver5.quit();

    // ✅ **TC_006: Login with Valid Email & Password**
    logMessage("✅ TC_006: Login with valid email and password");
    const driver6 = await createDriver();
    await driver6.get(gmailURL);
    await driver6
      .findElement(By.id("identifierId"))
      .sendKeys(validEmail, Key.RETURN);
    await driver6.wait(until.elementLocated(By.name("Passwd")), 5000);
    await driver6
      .findElement(By.name("Passwd"))
      .sendKeys(validPassword, Key.RETURN);
    try {
      await driver6.wait(
        until.elementLocated(By.css("div[aria-label='Inbox']")),
        10000
      );
      logMessage("Login Successful: ✅ Pass");
    } catch {
      logMessage("Login Failed: ❌ Fail");
    }
    await driver6.quit();

    logMessage("✅ Gmail Login Tests Completed Successfully.");
  } catch (error) {
    logMessage("❌ Test failed due to an error: " + error);
  }
};

// Run the test
testGmailLogin();
