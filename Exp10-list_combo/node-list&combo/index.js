const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
rl.question("Please enter the URL to test: ", async (url) => {
	if (!url) {
		console.error("No URL provided. Exiting...");
		rl.close();
		return;
	}
	const options = new chrome.Options();
	let driver;
	try {
		driver = await new Builder()
			.forBrowser("chrome")
			.setChromeOptions(options)
			.build();
		console.log(`\nNavigating to ${url}...`);
		await driver.get(url);
		await driver.sleep(2000); // Wait for page to load
		// Count unordered lists (ul) and their items
		const ulElements = await driver.findElements(By.css("ul"));
		console.log(`\nFound ${ulElements.length} unordered list(s) (ul):`);
		for (let i = 0; i < ulElements.length; i++) {
			const liItems = await ulElements[i].findElements(By.css("li"));
			const id = await ulElements[i].getAttribute("id");
			const className = await ulElements[i].getAttribute("class");
			console.log(`\nUnordered List #${i + 1}:`);
			console.log(`- ID: ${id || "none"}`);
			console.log(`- Class: ${className || "none"}`);
			console.log(`- Number of items: ${liItems.length}`);
		}
		// Count ordered lists (ol) and their items
		const olElements = await driver.findElements(By.css("ol"));
		console.log(`\nFound ${olElements.length} ordered list(s) (ol):`);
		for (let i = 0; i < olElements.length; i++) {
			const liItems = await olElements[i].findElements(By.css("li"));
			const id = await olElements[i].getAttribute("id");
			const className = await olElements[i].getAttribute("class");
			console.log(`\nOrdered List #${i + 1}:`);
			console.log(`- ID: ${id || "none"}`);
			console.log(`- Class: ${className || "none"}`);
			console.log(`- Number of items: ${liItems.length}`);
		}
		// Total count of all list items
		const allListItems = await driver.findElements(By.css("ul li, ol li"));
		console.log(`\nTOTAL LIST ITEMS COUNT: ${allListItems.length}`);
	} catch (error) {
		console.error("\nError occurred:", error.message);
	} finally {
		if (driver) {
			await driver.quit();
		}
		rl.close();
	}
});
