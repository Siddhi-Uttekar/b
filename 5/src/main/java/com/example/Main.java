package com.example;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class Main {
    public static void main(String[] args) {
        // Optional: set chromedriver path manually if needed
        // System.setProperty("webdriver.chrome.driver", "/opt/homebrew/bin/chromedriver");
        WebDriver driver = new ChromeDriver();
        try {
            driver.get("https://www.google.com");
            System.out.println("Chrome launched ");
            Thread.sleep(Long.MAX_VALUE); // Keeps the browser open
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}