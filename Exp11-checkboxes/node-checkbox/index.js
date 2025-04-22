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
		await driver.sleep(2000); // Let the page breathe

		// Find all checkboxes
		const checkboxes = await driver.findElements(
			By.css('input[type="checkbox"]')
		);
		console.log(`\nTotal number of checkboxes found: ${checkboxes.length}`);

		let checkedCount = 0;
		let uncheckedCount = 0;

		// Loop and count
		for (let i = 0; i < checkboxes.length; i++) {
			const isSelected = await checkboxes[i].isSelected();
			if (isSelected) {
				checkedCount++;
			} else {
				uncheckedCount++;
			}
		}

		// Print results
		console.log(`Checked: ${checkedCount}`);
		console.log(`Unchecked: ${uncheckedCount}`);
	} catch (error) {
		console.error("\n⚠️ Error occurred:", error.message);
	} finally {
		if (driver) {
			await driver.quit();
		}
		rl.close();
	}
});
