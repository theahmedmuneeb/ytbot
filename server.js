const http = require('http');
const puppeteer = require('puppeteer');

const PORT = 4100;
const URL = 'https://www.youtube.com/live/8cM3DlQfwc8';
const TABS_TO_OPEN = 100;

async function openMultipleTabs() {
  const browser = await puppeteer.launch();

  for (let i = 0; i < TABS_TO_OPEN; i++) {
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
  }
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot traffic simulation for YouTube Live started.');
});

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  await openMultipleTabs();
});
