import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

interface Product {
    title: string | null | undefined;
    price: string | null | undefined;
    link: string | null | undefined;
}

async function tgp(SEARCH_TERM: string): Promise<Product[]> {
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
            const link = await page.evaluate(el => el.querySelector(".thumbnail-top a")?.getAttribute('href'), productsHandle);
        
            products.push({
                title: formatTitle,
                price: formatPrice,
                link: link
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
            const link = await page.evaluate(el => el.querySelector(".boost-sd__product-link")?.getAttribute('href'), productsHandle);
            
            products.push({
                title: formatTitle,
                price: formatPrice,
                link: "https://southstardrug.com.ph" + link
            });

        } catch (error) { 
            console.log("Error: " + error);
            console.log("Error: " + productsHandle);
        }

    }
    await browser.close();
    return products;
}

async function watsons(SEARCH_TERM: string): Promise<Product[]> {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
    const URL = `https://www.watsons.com.ph/search?text=${SEARCH_TERM}`
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });
    const page = await browser.newPage();
    page.setUserAgent(userAgent);

    // Navigate the page to a URL.
    await page.goto(URL);

    

    // Set screen size.
    await page.setViewport({ width: 1366, height: 768 });
    // Wait for at least one of the product containers to be available
    await page.waitForSelector('.cx-product-container > .product-container.gridMode.ng-star-inserted');

    const productsHandles = await page.$$('.cx-product-container > .product-container.gridMode.ng-star-inserted > .ng-star-inserted');

    const products: Product[] = [];
    for (const productsHandle of productsHandles) {

        try {
            const title = await page.evaluate(el => el.querySelector(".productName")?.textContent, productsHandle);
            const formatTitle = title?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const price = await page.evaluate(el => el.querySelector(".formatted-value.ng-star-inserted")?.textContent, productsHandle);
            const formatPrice = price?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const link = await page.evaluate(el => el.querySelector(".productBottom a")?.getAttribute('href'), productsHandle);
            
            products.push({
                title: formatTitle,
                price: formatPrice,
                link: "https://www.watsons.com.ph" + link
            });

        } catch (error) { 
            console.log("Error: " + error);
            console.log("Error: " + productsHandle);
        }

    }
    await browser.close();
    return products;
}

async function rose(SEARCH_TERM: string): Promise<Product[]> {
    const URL = `https://www.rosepharmacy.com/?s=${SEARCH_TERM}&post_type=product`;
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(URL);

    await page.setViewport({ width: 300, height: 300 });

    await page.waitForSelector('.wpb_wrapper.vc_column-inner');
    const productHandles = await page.$$('.porto-posts-grid.porto-posts-grid-75121fa532f6c490d02770d2b728412e > .products-container > .porto-tb-item');
    
    const products: Product[] = [];
    for (const productHandle of productHandles) {
        try {
            const title = await page.evaluate(el => el.querySelector(".post-title")?.textContent, productHandle);
            const formatTitle = title?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const price = await page.evaluate(el => el.querySelector(".woocommerce-Price-amount.amount")?.textContent, productHandle);
            const formatPrice = price?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const link = await page.evaluate(el => el.querySelector(".porto-tb-featured-image a")?.getAttribute('href'), productHandle);
            
            products.push({
                title: formatTitle,
                price: formatPrice,
                link: link
            });

        } catch (error) { 
            console.log("Error: " + error);
            console.log("Error: " + productHandle);
        }

    }
    await browser.close();
    return products;
}

async function getmeds(SEARCH_TERM: string): Promise<Product[]> {
    const URL = `https://getmeds.ph/search?s=${SEARCH_TERM}`;
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(URL);

    await page.setViewport({ width: 300, height: 300 });

    await page.waitForSelector('.product_list_outer');
    const productHandles = await page.$$('.product_list_outer > .row.product_list > .col-md-4.col-sm-6 > .product_item');

    const products: Product[] = [];
    for (const productHandle of productHandles) {
        try {
            const title = await page.evaluate(el => el.querySelector(".product_item_title")?.textContent, productHandle);
            const formatTitle = title?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const price = await page.evaluate(el => el.querySelector(".product-list-price")?.textContent, productHandle);
            const formatPrice = price?.replace(/(\r\n|\n|\r)/gm, "").trim();
            const link = await page.evaluate(el => el.querySelector(".product_item a")?.getAttribute('href'), productHandle);

            
            products.push({
                title: formatTitle,
                price: formatPrice,
                link: link
            });

        } catch (error) { 
            console.log("Error: " + error);
            console.log("Error: " + productHandle);
        }

    }
    await browser.close();
    return products;
}

export const allController = async (req: Request, res: Response) => {
    const SEARCH_TERM = req.query.SEARCH_TERM;
    const tgpProducts = await tgp(SEARCH_TERM as string);
    const southstarProducts = await southstar(SEARCH_TERM as string);
    const watsonsProducts = await watsons(SEARCH_TERM as string);
    const roseProducts = await rose(SEARCH_TERM as string);
    const getMedsProducts = await getmeds(SEARCH_TERM as string);

    
    const data = [];
    for (let i = 0; i < tgpProducts.length; i++) {
        data[i] = {
            title: tgpProducts[i].title,
            price: tgpProducts[i].price,
            link: tgpProducts[i].link
        }
    }

    for (let i = 0; i < southstarProducts.length; i++) {
        data[i + tgpProducts.length] = {
            title: southstarProducts[i].title,
            price: southstarProducts[i].price,
            link: southstarProducts[i].link
        }
    }

    for (let i = 0; i < watsonsProducts.length; i++) {
        data[i + tgpProducts.length + southstarProducts.length] = {
            title: watsonsProducts[i].title,
            price: watsonsProducts[i].price,
            link: watsonsProducts[i].link
        }
    }

    for (let i = 0; i < roseProducts.length; i++) {
        data[i + tgpProducts.length + southstarProducts.length + watsonsProducts.length] = {
            title: roseProducts[i].title,
            price: roseProducts[i].price,
            link: roseProducts[i].link
        }
    }

    for (let i = 0; i < getMedsProducts.length; i++) {
        data[i + tgpProducts.length + southstarProducts.length + watsonsProducts.length + roseProducts.length] = {
            title: getMedsProducts[i].title,
            price: getMedsProducts[i].price,
            link: getMedsProducts[i].link
        }
    }



    res.status(200).json({
        status: "success",
        message: "Scraping completed successfully",
        data: {
            TGP: tgpProducts,
            Southstar: southstarProducts,
            Watsons: watsonsProducts,
            Rose_Pharmacy: roseProducts,
            GetMeds: getMedsProducts,
        }
    });
}

