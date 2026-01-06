const puppeteer = require('puppeteer-core');

const selector = process.argv[2];

if (!selector) {
  console.error('Please provide a CSS selector as an argument.');
  process.exit(1);
}

async function run() {
  try {
    const browserURL = 'http://127.0.0.1:9222';
    const browser = await puppeteer.connect({
      browserURL,
      defaultViewport: null
    });

    console.log('Connected to Jetski.');

    // Find the main IDE window (workbench)
    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('workbench.html'));

    if (!page) {
      console.error('Could not find the Jetski workbench window.');
      await browser.disconnect();
      return;
    }

    console.log(`Searching for elements matching: "${selector}"`);

    const frames = page.frames();
    let allElements = [];

    for (const frame of frames) {
      const frameElements = await frame.$$(selector);
      if (frameElements.length > 0) {
        for (const el of frameElements) {
          allElements.push({ element: el, frameUrl: frame.url() });
        }
      }
    }

    console.log(`Found ${allElements.length} matching elements.`);

    if (allElements.length > 0) {
      console.log('--- Details ---');
      for (let i = 0; i < allElements.length; i++) {
        const { element, frameUrl } = allElements[i];
        // Try to get some info about the element
        try {
          const info = await element.evaluate(el => {
            return {
              tagName: el.tagName.toLowerCase(),
              className: el.className,
              id: el.id,
              text: el.textContent ? el.textContent.substring(0, 50).trim() : '',
              isVisible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
            };
          });
          console.log(`[${i}] Frame: ${frameUrl} | <${info.tagName}> id="${info.id}" class="${info.className}" visible=${info.isVisible} text="${info.text}..."`);
        } catch (e) {
          console.log(`[${i}] Frame: ${frameUrl} | Error evaluating element: ${e.message}`);
        }
      }
    }

    await browser.disconnect();
  } catch (err) {
    if (err.message.includes('ECONNREFUSED')) {
      console.error('Could not connect to Jetski on port 9222. Is it running with --remote-debugging-port=9222?');
    } else {
      console.error('Error:', err);
    }
    process.exit(1);
  }
}

run();
