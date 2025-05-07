import puppeteer from "puppeteer";

export async function GET() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("http://quotes.toscrape.com/", { waitUntil: "domcontentloaded" });

    const quotes = [];

    let nextPage = true;
    while (nextPage) {
      const pageQuotes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".quote")).map((quote) => {
          const text = quote.querySelector(".text").innerText;
          const author = quote.querySelector(".author").innerText;
          const tags = Array.from(quote.querySelectorAll(".tags .tag")).map((tag) => tag.innerText);

          return { text, author, tags };
        });
      });

      quotes.push(...pageQuotes);

      nextPage = await page.evaluate(() => {
        const nextButton = document.querySelector(".pager > .next > a");
        if (nextButton) {
          nextButton.click();
          return true;
        }
        return false;
      });

      if (nextPage) {
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
      }
    }

    await browser.close();
    return new Response(JSON.stringify({ quotes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to scrape data", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
