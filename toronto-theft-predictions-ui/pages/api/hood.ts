// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lng } = req.query;
  const scrape = await scrapeWebsite(lat, lng);
  res.status(200);
  res.send(scrape);
}

async function scrapeWebsite(lat, lng) {
  const url = `https://www.toronto.ca/city-government/data-research-maps/neighbourhoods-communities/neighbourhood-profiles/find-your-neighbourhood/#location=&lat=${lat}&lng=${lng}`;

  // First, we launch a new browser instance and create a new page
  const browser = await puppeteer.launch();
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
