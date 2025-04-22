const { Builder, logging, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

jest.setTimeout(30000);  // Set Jest timeout to 30 seconds for all tests

// Run the Selenium test for the given URL and expected element count
const runTest = async (url, expectedElementCount) => {
  // Set up Chrome options and logging preferences
  const options = new chrome.Options();
  options.setLoggingPrefs({ 'browser': 'ALL' });  // Capture all browser console logs

  // Create a new instance of the Chrome WebDriver with the options
  let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Open the provided URL
    await driver.get(url);

    // Wait for a short time to allow JavaScript to execute and print logs
    await driver.sleep(2000);  // Adjust timing if necessary

    // Wait for any elements to load dynamically (you can adjust this logic)
    await driver.wait(until.elementLocated(By.css('body')), 10000);

    // Execute the JavaScript code to count and print all elements
    const script = `
      const allElements = document.querySelectorAll('*');
      console.log('Total number of elements on this page:', allElements.length);
      for (let i = 0; i < allElements.length; i++) {
        console.log(\`Element \${i + 1}:\`, allElements[i]);
      }
    `;
    await driver.executeScript(script);

    // Retrieve the browser logs
    const logs = await driver.manage().logs().get('browser');
    const logMessage = logs[0]?.message.split('"').filter((e, index) => index === 1 || index === 2);

    // Log the elements for debugging
    console.log(...logMessage);

    // Validate the number of elements printed in the logs (basic test)
    const totalElementsLog = logs.find(log => log.message.includes('Total number of elements on this page'));
    const totalElements = totalElementsLog ? parseInt(totalElementsLog.message.split(':')[1].trim()) : 0;

    // Assert the expected element count matches the actual count
    expect(totalElements).toBe(expectedElementCount);
  } catch (error) {
    console.error('Test failed for URL:', url);
    throw error;  // Rethrow to make sure Jest can catch it and fail the test
  } finally {
    // Quit the driver after testing
    await driver.quit();
  }
};

describe('Selenium WebDriver Tests', () => {
  it('should work on a simple page with elements', async () => {
    const url = 'https://example.com';  // A sample page with multiple elements
    await runTest(url, 28);  // Expect around 28 elements (this number may vary depending on the page)
  });

  it('should handle an empty page correctly', async () => {
    const url = 'data:text/html,<html></html>';  // A page with no elements
    await runTest(url, 0);  // Expect 0 elements
  });

  it('should handle a complex page', async () => {
    const url = 'https://www.wikipedia.org';  // A more complex page
    await runTest(url, 50);  // Expect around 50 or more elements
  });

  it('should handle invalid URL gracefully', async () => {
    try {
      const url = 'http://invalid-url-that-does-not-exist.com';
      await runTest(url, 0);  // This test is to see if the script handles errors gracefully
    } catch (error) {
      expect(error).toBeTruthy();  // The error should be truthy, indicating that the test failed correctly
    }
  });

  it('should correctly count elements on a page with dynamic content', async () => {
    const url = 'https://www.amazon.com';  // Dynamic content-loaded page
    await runTest(url, 100);  // Expect a large number of elements on a page like Amazon
  });
});
