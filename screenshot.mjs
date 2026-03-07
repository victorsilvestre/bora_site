import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';
const dir = path.join(process.cwd(), 'temporary screenshots');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

let maxNum = 0;
const files = fs.readdirSync(dir);
for (const file of files) {
    const match = file.match(/^screenshot-(\d+)/);
    if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
    }
}
const nextNum = maxNum + 1;

(async () => {
    try {
        const browser = await puppeteer.launch({
            userDataDir: 'C:/Users/Victor Silvestre/.cache/puppeteer/'
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });
        
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        const filename = path.join(dir, `screenshot-${nextNum}${label}.png`);
        await page.screenshot({ path: filename, fullPage: true });
        
        console.log(`Screenshot saved to ${filename}`);
        await browser.close();
    } catch (e) {
        console.error('Error taking screenshot:', e);
        process.exit(1);
    }
})();
