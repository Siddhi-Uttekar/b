package com.example;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import com.aventstack.extentreports.*;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

import java.util.List;
import java.util.Scanner;

public class CheckboxCounter {
    public static void main(String[] args) {
        // Setup Extent Reports
        ExtentSparkReporter htmlReporter = new ExtentSparkReporter("test-output/checkbox-report.html");
        ExtentReports extent = new ExtentReports();
        extent.attachReporter(htmlReporter);
        ExtentTest test = extent.createTest("Checkbox Count Test");

        Scanner scanner = new Scanner(System.in);

        System.out.print("Please enter the URL to test: ");
        String url = scanner.nextLine();

        if (url.isEmpty()) {
            test.fail("No URL provided. Exiting...");
            extent.flush();
            scanner.close();
            return;
        }

        WebDriver driver = new ChromeDriver();

        try {
            test.info("Navigating to: " + url);
            driver.get(url);
            Thread.sleep(2000);

            List<WebElement> checkboxes = driver.findElements(By.cssSelector("input[type='checkbox']"));
            int total = checkboxes.size();
            test.info("Total checkboxes found: " + total);

            int checkedCount = 0, uncheckedCount = 0;
            for (WebElement checkbox : checkboxes) {
                if (checkbox.isSelected()) checkedCount++;
                else uncheckedCount++;
            }

            test.pass("Checked: " + checkedCount);
            test.pass("Unchecked: " + uncheckedCount);

        } catch (Exception e) {
            test.fail("Error: " + e.getMessage());
        } finally {
            driver.quit();
            scanner.close();
            extent.flush();  // write everything to the file
        }
    }
}

//https://the-internet.herokuapp.com/checkboxes