const http = require('http');
const puppeteer = require('puppeteer');
const url = require('url');
const os = require('os');

let videoURL = null; // Default URL is null
let tabsToOpen = 50; // Default number of tabs
let browserInstance = null;
let openTabsCount = 0;
const PORT = 4100;

async function openMultipleTabs(URL, TABS_TO_OPEN) {
  if (browserInstance) {
    await browserInstance.close();
  }
  
  browserInstance = await puppeteer.launch();

  for (let i = 0; i < TABS_TO_OPEN; i++) {
    const page = await browserInstance.newPage();
    if (URL) {
      await page.goto(URL, { waitUntil: 'domcontentloaded' });
    }
    openTabsCount++;
  }
}

const server = http.createServer(async (req, res) => {
  const reqUrl = req.url;
  if (reqUrl.startsWith('/update')) {
    const queryObject = url.parse(reqUrl, true).query;
    const newURL = queryObject.u;
    const newTabs = parseInt(queryObject.t, 10);

    if (newURL !== videoURL) {
      videoURL = newURL;
    }
    if (!isNaN(newTabs) && newTabs !== tabsToOpen) {
      tabsToOpen = newTabs;
    }

    await openMultipleTabs(videoURL, tabsToOpen);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('URL and tabs updated successfully.');
    return;
  }

  if (reqUrl === '/tabs') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Number of tabs open: ${openTabsCount}`);
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot traffic simulation for YouTube Live started.');

});

server.listen(PORT, () => {
  const networkInterfaces = os.networkInterfaces();
  const ip = networkInterfaces.eth0 ? networkInterfaces.eth0[0].address : 'localhost';
  console.log(`Server running at http://${ip}:${PORT}/`);
});
