const { Builder, logging } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const readline = require("readline");
const path = require("path");

// Set up readline to take user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Prompt user for the URL
rl.question("Please enter the URL to test: ", async function (url) {
	// Set up Chrome options and logging preferences
	const options = new chrome.Options();
	options.setLoggingPrefs({ browser: "ALL" }); // Capture all browser console logs

	// Create a new instance of the Chrome WebDriver with the options
	let driver = new Builder()
		.forBrowser("chrome")
		.setChromeOptions(options)
		.build();

	try {
		// Open the provided URL
		await driver.get(url);

		// Wait for a short time to allow JavaScript to execute and print logs
		await driver.sleep(2000); // Adjust timing if necessary

		// Execute the JavaScript code to count and print all elements
		// Updated script to return element info
		const script = `
            const allElements = Array.from(document.querySelectorAll('*'));
            return allElements.map((el, index) => {
                return {
                    index: index + 1,
                    tag: el.tagName,
                    id: el.id,
                    class: el.className,
                    outerHTML: el.outerHTML.substring(0, 100) // Just a snippet, not the full thing
                };
            });
        `;
		const elements = await driver.executeScript(script);

		// Print result to Node.js console
		console.log("Total elements:", elements.length);
		// elements.forEach((el) => {
		// 	console.log(
		// 		`Element ${el.index}: <${el.tag}> id="${el.id}" class="${el.class}"`
		// 	);
		// });

		// const script = `
		//     // Get all elements on the page
		//     const allElements = document.querySelectorAll('*');

		//     // Print the total number of elements
		//     console.log('Total number of elements on this page:', allElements.length);

		//     // Loop through all elements and print each one
		//     for (let i = 0; i < allElements.length; i++) {
		//         console.log(\`Element \${i + 1}:\`, allElements[i]);
		//     }
		// `;
		// await driver.executeScript(script);

		// // Retrieve the browser logs
		// const logs = await driver.manage().logs().get("browser");

		// // Output the logs to verify the element count and printed elements
		// console.log("Console Logs:");
		// const element = logs[0].message
		// 	.split('"')
		// 	.filter((e, index) => index === 1 || index === 2);
		// console.log(...element);
	} finally {
		// Quit the driver after testing
		await driver.quit();
		rl.close(); // Close the readline interface
	}
});
