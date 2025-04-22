package com.example;

import com.aventstack.extentreports.*;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.List;

public class WebPageElementCounter {

    public static void main(String[] args) {
        // 💎 Setup Extent Report
        ExtentSparkReporter htmlReporter = new ExtentSparkReporter("test-output/web-element-report.html");
        ExtentReports extent = new ExtentReports();
        extent.attachReporter(htmlReporter);
        ExtentTest test = extent.createTest("Web Page Element Count Report");

        WebDriver driver = null;

        try {
            // 🔧 Optional: set ChromeDriver path
            // System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
            driver = new ChromeDriver();
            test.info("Chrome launched successfully.");

            // 🎯 Replace this with your actual URL
            String url = "https://github.com/Siddhi-Uttekar";
            driver.get(url);
            test.info("Navigated to: " + url);
            Thread.sleep(2000);

            // 1️⃣ Count List Items
            List<WebElement> listItems = driver.findElements(By.cssSelector("ul li, ol li"));
            test.pass("List Items Found: " + listItems.size());

            // 2️⃣ Count Checkboxes
            List<WebElement> checkboxes = driver.findElements(By.cssSelector("input[type='checkbox']"));
            int checked = 0, unchecked = 0;
            for (WebElement checkbox : checkboxes) {
                if (checkbox.isSelected()) checked++;
                else unchecked++;
            }
            test.pass("Checkboxes - Checked: " + checked + ", Unchecked: " + unchecked);

            // 3️⃣ Count Dropdown Items
            List<WebElement> dropdowns = driver.findElements(By.tagName("select"));
            int totalOptions = 0;
            for (WebElement dropdown : dropdowns) {
                List<WebElement> options = dropdown.findElements(By.tagName("option"));
                totalOptions += options.size();
            }
            test.pass("Dropdowns found: " + dropdowns.size() + ", Total options inside: " + totalOptions);

            // Summary
            test.info("✔️ Summary: Lists = " + listItems.size() + ", Checkboxes = " + checkboxes.size()
                    + ", Dropdowns = " + dropdowns.size());

        } catch (Exception e) {
            test.fail("💥 Exception Occurred: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (driver != null) {
                driver.quit();
                test.info("Browser closed.");
            }
            extent.flush();
        }
    }
}
