package com.example;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.List;
import java.util.Objects;

public class ChromeLaunchTest {

    WebDriver driver;

    @BeforeClass
    public void setUp() {
        // System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
        driver = new ChromeDriver();
    }

    @Test(priority = 1)
    public void testGoogleLaunch() {
        driver.get("https://www.google.com");
        String title = driver.getTitle();
        System.out.println("Page title is: " + title);
        assert Objects.requireNonNull(title).contains("Google") : "Title does not contain 'Google'";
    }

    @Test(priority = 2)
    public void testGoogleSearchBoxPresence() {
        driver.get("https://www.google.com");
        WebElement searchBox = driver.findElement(By.name("q"));
        assert searchBox.isDisplayed() : "Search box is not displayed";
    }

    @Test(priority = 3)
    public void testGoogleSearchSuggestions() throws InterruptedException {
        driver.get("https://www.google.com");
        WebElement searchBox = driver.findElement(By.name("q"));
        searchBox.sendKeys("Selenium");

        // Sleep briefly to allow suggestions to appear (better to use WebDriverWait in real tests)
        Thread.sleep(2000);

        List<WebElement> suggestions = driver.findElements(By.cssSelector("ul[role='listbox'] li"));
        assert suggestions.size() > 0 : "No search suggestions found";
        System.out.println("Number of suggestions: " + suggestions.size());
    }

    @Test(priority = 4)
    public void testGoogleSearchFunctionality() throws InterruptedException {
        driver.get("https://www.google.com");
        WebElement searchBox = driver.findElement(By.name("q"));
        searchBox.sendKeys("OpenAI");
        searchBox.submit();

        // Sleep briefly to allow results to load (better to use WebDriverWait)
        Thread.sleep(3000);

        String resultsTitle = driver.getTitle();
        assert resultsTitle.contains("OpenAI") : "Search results title does not contain 'OpenAI'";
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}