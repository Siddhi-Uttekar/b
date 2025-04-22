package com.example;

import com.aventstack.extentreports.*;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.*;
import java.util.List;
public class WebPageObjectCounterTest {
    private WebDriver driver;
    private ExtentReports extent;
    private ExtentTest test;
    @BeforeClass
    public void setUp() {
//        //System.setProperty("webdriver.chrome.driver", "/Users/vinaybasargekar/Downloads/chromedriver-mac-arm64/chromedriver");
        driver = new ChromeDriver();
        driver.get("https://google.com");
// Initialize Extent Reports
        ExtentSparkReporter spark = new ExtentSparkReporter("test-output/ExtentReport.html");
        extent = new ExtentReports();
        extent.attachReporter(spark);
    }
    @Test
    public void testTotalElementsOnPage() {
        test = extent.createTest("Verify Total Elements on Page");
// Find all elements on the page
        List<WebElement> allElements = driver.findElements(By.xpath("//*"));
        int totalElements = allElements.size();
        test.info("Total elements found: " + totalElements);
        Assert.assertTrue(totalElements > 0, "No elements found!");
        test.pass("Test Passed!");
    }
    @AfterClass
    public void tearDown() {
        driver.quit();
        extent.flush(); // Write results to report
    }
}