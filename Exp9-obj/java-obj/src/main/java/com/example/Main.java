package com.example;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import java.util.List;

public class Main {
    public static void main(String[] args) {

// Set the path to the ChromeDriver executable

// Initialize WebDriver
        WebDriver driver = new ChromeDriver();
// Open the webpage
        driver.get("https://google.com"); // Replace with the actual URL
// Get all elements present on the page
        List<WebElement> allElements = driver.findElements(By.xpath("//*"));
// Print the total number of objects
        System.out.println("Total number of elements on the page: " + allElements.size());
// Close the browser
        driver.quit();
    }
}