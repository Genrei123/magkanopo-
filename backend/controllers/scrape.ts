import { Request, Response } from 'express';
import puppeteer, {Browser} from 'puppeteer';

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
    
    try {
        const products = await scrapeTGP(SEARCH_TERM as string);
        
        res.status(200).json({
            status: "success",
            message: "Scraping completed successfully",
            data: {
                products: products
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Scraping failed",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export const SouthstarController = async (req: Request, res: Response) => {
    const SEARCH_TERM = req.query.SEARCH_TERM;
    
    try {
        const products = await scrapeSouthstar(SEARCH_TERM as string);
        
        res.status(200).json({
            status: "success",
            message: "Scraping completed successfully",
            data: {
                products: products
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Scraping failed",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

async function scrapeTGP(SEARCH_TERM: string, browser?: Browser): Promise<Product[]> {
    console.log("Scraping TGP for: " + SEARCH_TERM);
    const TGP_URL = "https://tgp.com.ph/search?controller=search&s=" + SEARCH_TERM;

    const shouldCloseBrowser = !browser;
    const localBrowser = browser || await puppeteer.launch({
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-accelerated-2d-canvas',
        ],
        headless: true,
    });
    
    const page = await localBrowser.newPage();

    try {
        await page.goto(TGP_URL);
        await page.setViewport({ width: 1080, height: 1024 });
        
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
                console.log("Error processing TGP product:", error);
            }
        }
        
        return products;
    } finally {
        await page.close();
        if (shouldCloseBrowser) {
            await localBrowser.close();
        }
    }
}

async function scrapeSouthstar(SEARCH_TERM: string, browser?: Browser): Promise<Product[]> {
    console.log("Scraping Southstar for: " + SEARCH_TERM);
    const URL = `https://southstardrug.com.ph/search?q=${SEARCH_TERM}&options%5Bprefix%5D=last`;

    const shouldCloseBrowser = !browser;
    const localBrowser = browser || await puppeteer.launch({
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-accelerated-2d-canvas',
        ],
        headless: true,
    });
    
    const page = await localBrowser.newPage();

    try {
        await page.goto(URL);
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
                console.log("Error processing Southstar product:", error);
            }
        }
        
        return products;
    } finally {
        await page.close();
        if (shouldCloseBrowser) {
            await localBrowser.close();
        }
    }
}

export const allController = async (req: Request, res: Response): Promise<void> => {
    const SEARCH_TERM = req.query.SEARCH_TERM as string;
    
    if (!SEARCH_TERM) {
        res.status(400).json({
            status: "error",
            message: "SEARCH_TERM is required"
        });
    }
    
    try {
        // Initialize a single browser instance for both scraping operations
        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-accelerated-2d-canvas',
            ],
            headless: true,
        });
        
        try {
            // Run both scraping operations using the same browser instance
            const [tgpProducts, southstarProducts] = await Promise.all([
                scrapeTGP(SEARCH_TERM, browser),
                scrapeSouthstar(SEARCH_TERM, browser)
            ]);
            
            res.status(200).json({
                status: "success",
                message: "Scraping completed successfully",
                data: {
                    TGP: tgpProducts,
                    Southstar: southstarProducts,
                }
            });
        } finally {
            // Always close the browser when done
            await browser.close();
        }
    } catch (error) {
        console.error("Error in allController:", error);
        res.status(500).json({
            status: "error",
            message: "Scraping failed",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}