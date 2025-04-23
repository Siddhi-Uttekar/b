package org.example;

import com.aventstack.extentreports.*;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class ChromeTest {
    public static void main(String[] args) {
        // Setup ExtentReport
        ExtentSparkReporter htmlReporter = new ExtentSparkReporter("test-output/extent-report.html");
        ExtentReports extent = new ExtentReports();
        extent.attachReporter(htmlReporter);
        ExtentTest test = extent.createTest("Chrome Browser Launch Test");

        WebDriver driver = new ChromeDriver();

        try {
            // Test - Navigating to Google
            driver.get("https://www.google.com");
            test.info("Navigated to https://www.google.com");
            System.out.println("Chrome launched and navigated to Google.");

            test.pass("Browser launched successfully and page loaded.");
            Thread.sleep(5000);  // 5 seconds delay to observe
        } catch (Exception e) {
            // Log the exception to ExtentReports
            test.fail("Error: " + e.getMessage());
            System.out.println("Error: " + e.getMessage());
        } finally {
            // Close the driver and flush the Extent report
            driver.quit();
            extent.flush();
            System.out.println("Extent report generated at: test-output/extent-report.html");
        }
    }
}
