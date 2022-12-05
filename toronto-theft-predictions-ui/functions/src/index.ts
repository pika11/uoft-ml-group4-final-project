import { onRequest } from "firebase-functions/v2/https";
import puppeteer from "puppeteer";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const hood = onRequest(async (request, response) => {
  const { lat, lng } = request.query;
  const scrape = await scrapeWebsite(lat, lng);
  // Set cors headers
  response.set("Access-Control-Allow-Origin", "*");
  response.status(200);
  response.send(scrape);
});

async function scrapeWebsite(lat, lng) {
  const url = `https://www.toronto.ca/city-government/data-research-maps/neighbourhoods-communities/neighbourhood-profiles/find-your-neighbourhood/#location=&lat=${lat}&lng=${lng}`;

  // Check if we're in production
  const isProduction = process.env.NODE_ENV === "production";

  // First, we launch a new browser instance and create a new page
  let browser;
  if (isProduction) {
    browser = await puppeteer.connect({
      browserWSEndpoint: "wss://chrome.browserless.io?",
    });
  } else {
    browser = await puppeteer.launch();
  }
  const page = await browser.newPage();

  // Next, we navigate to the provided URL and wait for the page to fully load
  await page.goto(url);
  await page.waitForNavigation();

  // Wait for the element to be rendered
  await page.waitForSelector("#listViewBox");

  // Get the HTML content of the element
  const html = await page.$eval("#listViewBox", (e) => e.innerHTML);

  // Split the HTML in <dt>Neighbourhood Number:</dt> <dd>
  const split = html.split("<dt>Neighbourhood Number:</dt> <dd>");

  // Grab the second odd elements of the split array
  const hood = split[1].split("</dd>")[0];

  // Finally, we close the browser and return the data we scraped
  await browser.close();

  // Return html of listViewBoxFirstChild
  return hood;
}
