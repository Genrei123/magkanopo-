import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

interface Product {
    title: string | null | undefined;
    price: string | null | undefined;
}

interface SearchResult {
    status: string;
    message: string;
    data: {
        site: {
            title: string;
            price: string;
        }
    };
}

export const TGPController = async (req: Request, res: Response) => {
    console.log("TGP" + "\n");
    const SEARCH_TERM = req.query.SEARCH_TERM;
    const TGP_URL = "https://tgp.com.ph/search?controller=search&s=" + SEARCH_TERM;

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });
    const page = await browser.newPage();

    await page.goto(TGP_URL);

    await page.screenshot({ path: "TGP.png" });

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    // const productsHandles = await page.$$('#products > #js-product-list'); working to
    // const productsHandles = await page.$$('#js-product-list > *');
    const productsHandles = await page.$$('.products.row > *');

    const products: Product[] = [];
    for (const productsHandle of productsHandles) {

        try {
            const title = await page.evaluate(el => el.querySelector(".h3.product-title a")?.textContent, productsHandle);
            const formatTitle = title?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const price = await page.evaluate(el => el.querySelector(".price")?.textContent, productsHandle);
            const formatPrice = price?.replace(/(\r\n|\n|\r)/gm, "").trim();
        
            products.push({
                title: formatTitle,
                price: formatPrice
            });

        } catch (error) {
            console.log("Error: " + error);
            console.log("Error: " + productsHandle);
         }
    }

    await browser.close();
    res.status(200).json({
        status: "success",
        message: "Scraping completed successfully",
        data: {
            products: products
        }
    });

}

export const SouthstarController = async (req: Request, res: Response) => {
    const SEARCH_TERM = req.query.SEARCH_TERM;
    const URL = `https://southstardrug.com.ph/search?q=${SEARCH_TERM}&options%5Bprefix%5D=last`
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto(URL);
    await page.screenshot({ path: "example.png" });

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });
    const productsHandles = await page.$$('.boost-sd__product-list > .boost-sd__product-item');

    const products: Product[] = [];
    for (const productsHandle of productsHandles) {

        try {
            const title = await page.evaluate(el => el.querySelector(".boost-sd__product-title")?.textContent, productsHandle);
            const formatTitle = title?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const price = await page.evaluate(el => el.querySelector(".boost-sd__format-currency")?.textContent, productsHandle);
            const formatPrice = price?.replace(/(\r\n|\n|\r)/gm, "").trim();
            
            products.push({
                title: formatTitle,
                price: formatPrice
            });

        } catch (error) { 
            console.log("Error: " + error);
            console.log("Error: " + productsHandle);
        }

    }
    await browser.close();

    res.status(200).json({
        status: "success",
        message: "Scraping completed successfully",
        data: {
            products: products
        }
    });
}


const BROWSER = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
});
const PAGE = BROWSER.then(browser => browser.newPage());



async function tgp(SEARCH_TERM: string): Promise<Product[]> {
    console.log("TGP" + "\n");
    const TGP_URL = "https://tgp.com.ph/search?controller=search&s=" + SEARCH_TERM;

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });
    const page = await browser.newPage();

    await page.goto(TGP_URL);

    // Set screen size.
    await page.setViewport({ width: 300, height: 300 });

    // const productsHandles = await page.$$('#products > #js-product-list'); working to
    // const productsHandles = await page.$$('#js-product-list > *');
    const productsHandles = await page.$$('.products.row > *');

    const products: Product[] = [];
    for (const productsHandle of productsHandles) {

        try {
            const title = await page.evaluate(el => el.querySelector(".h3.product-title a")?.textContent, productsHandle);
            const formatTitle = title?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const price = await page.evaluate(el => el.querySelector(".price")?.textContent, productsHandle);
            const formatPrice = price?.replace(/(\r\n|\n|\r)/gm, "").trim();
        
            products.push({
                title: formatTitle,
                price: formatPrice
            });

        } catch (error) {
            console.log("Error: " + error);
            console.log("Error: " + productsHandle);
         }
    }

    await browser.close();

    return products;
}

async function southstar(SEARCH_TERM: string): Promise<Product[]> {
    const URL = `https://southstardrug.com.ph/search?q=${SEARCH_TERM}&options%5Bprefix%5D=last`
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto(URL);

    // Set screen size.
    await page.setViewport({ width: 300, height: 300 });
    const productsHandles = await page.$$('.boost-sd__product-list > .boost-sd__product-item');

    const products: Product[] = [];
    for (const productsHandle of productsHandles) {

        try {
            const title = await page.evaluate(el => el.querySelector(".boost-sd__product-title")?.textContent, productsHandle);
            const formatTitle = title?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const price = await page.evaluate(el => el.querySelector(".boost-sd__format-currency")?.textContent, productsHandle);
            const formatPrice = price?.replace(/(\r\n|\n|\r)/gm, "").trim();
            
            products.push({
                title: formatTitle,
                price: formatPrice
            });

        } catch (error) { 
            console.log("Error: " + error);
            console.log("Error: " + productsHandle);
        }

    }
    await browser.close();
    return products;
}




export const allController = async (req: Request, res: Response) => {
    const SEARCH_TERM = req.query.SEARCH_TERM;
    const tgpProducts = await tgp(SEARCH_TERM as string);
    const southstarProducts = await southstar(SEARCH_TERM as string);

    
    const data = [];
    for (let i = 0; i < tgpProducts.length; i++) {
        data[i] = {
            title: tgpProducts[i].title,
            price: tgpProducts[i].price,
        }
    }

    for (let i = 0; i < southstarProducts.length; i++) {
        data[i + tgpProducts.length] = {
            title: southstarProducts[i].title,
            price: southstarProducts[i].price,
        }
    }

    res.status(200).json({
        status: "success",
        message: "Scraping completed successfully",
        data: {
            TGP: tgpProducts,
            Southstar: southstarProducts,
        }
    });
}

