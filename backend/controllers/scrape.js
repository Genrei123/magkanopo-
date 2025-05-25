"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allController = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
function tgp(SEARCH_TERM) {
    return __awaiter(this, void 0, void 0, function* () {
        const TGP_URL = "https://tgp.com.ph/search?controller=search&s=" + SEARCH_TERM;
        const browser = yield puppeteer_1.default.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });
        const page = yield browser.newPage();
        yield page.goto(TGP_URL);
        // Set screen size.
        yield page.setViewport({ width: 300, height: 300 });
        // const productsHandles = await page.$$('#products > #js-product-list'); working to
        // const productsHandles = await page.$$('#js-product-list > *');
        const productsHandles = yield page.$$('.products.row > *');
        const products = [];
        for (const productsHandle of productsHandles) {
            try {
                const title = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".h3.product-title a")) === null || _a === void 0 ? void 0 : _a.textContent; }, productsHandle);
                const formatTitle = title === null || title === void 0 ? void 0 : title.replace(/(\r\n|\n|\r)/gm, "").trim();
                const price = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".price")) === null || _a === void 0 ? void 0 : _a.textContent; }, productsHandle);
                const formatPrice = price === null || price === void 0 ? void 0 : price.replace(/(\r\n|\n|\r)/gm, "").trim();
                products.push({
                    title: formatTitle,
                    price: formatPrice
                });
            }
            catch (error) {
                console.log("Error: " + error);
                console.log("Error: " + productsHandle);
            }
        }
        yield browser.close();
        return products;
    });
}
function southstar(SEARCH_TERM) {
    return __awaiter(this, void 0, void 0, function* () {
        const URL = `https://southstardrug.com.ph/search?q=${SEARCH_TERM}&options%5Bprefix%5D=last`;
        // Launch the browser and open a new blank page
        const browser = yield puppeteer_1.default.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });
        const page = yield browser.newPage();
        // Navigate the page to a URL.
        yield page.goto(URL);
        // Set screen size.
        yield page.setViewport({ width: 300, height: 300 });
        const productsHandles = yield page.$$('.boost-sd__product-list > .boost-sd__product-item');
        const products = [];
        for (const productsHandle of productsHandles) {
            try {
                const title = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".boost-sd__product-title")) === null || _a === void 0 ? void 0 : _a.textContent; }, productsHandle);
                const formatTitle = title === null || title === void 0 ? void 0 : title.replace(/(\r\n|\n|\r)/gm, "").trim();
                const price = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".boost-sd__format-currency")) === null || _a === void 0 ? void 0 : _a.textContent; }, productsHandle);
                const formatPrice = price === null || price === void 0 ? void 0 : price.replace(/(\r\n|\n|\r)/gm, "").trim();
                products.push({
                    title: formatTitle,
                    price: formatPrice
                });
            }
            catch (error) {
                console.log("Error: " + error);
                console.log("Error: " + productsHandle);
            }
        }
        yield browser.close();
        return products;
    });
}
function watsons(SEARCH_TERM) {
    return __awaiter(this, void 0, void 0, function* () {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
        const URL = `https://www.watsons.com.ph/search?text=${SEARCH_TERM}`;
        // Launch the browser and open a new blank page
        const browser = yield puppeteer_1.default.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });
        const page = yield browser.newPage();
        page.setUserAgent(userAgent);
        // Navigate the page to a URL.
        yield page.goto(URL);
        // Set screen size.
        yield page.setViewport({ width: 1366, height: 768 });
        // Wait for at least one of the product containers to be available
        yield page.waitForSelector('.cx-product-container > .product-container.gridMode.ng-star-inserted');
        const productsHandles = yield page.$$('.cx-product-container > .product-container.gridMode.ng-star-inserted > .ng-star-inserted');
        const products = [];
        for (const productsHandle of productsHandles) {
            try {
                const title = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".productName")) === null || _a === void 0 ? void 0 : _a.textContent; }, productsHandle);
                const formatTitle = title === null || title === void 0 ? void 0 : title.replace(/(\r\n|\n|\r)/gm, "").trim();
                const price = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".formatted-value.ng-star-inserted")) === null || _a === void 0 ? void 0 : _a.textContent; }, productsHandle);
                const formatPrice = price === null || price === void 0 ? void 0 : price.replace(/(\r\n|\n|\r)/gm, "").trim();
                products.push({
                    title: formatTitle,
                    price: formatPrice
                });
            }
            catch (error) {
                console.log("Error: " + error);
                console.log("Error: " + productsHandle);
            }
        }
        yield browser.close();
        return products;
    });
}
function rose(SEARCH_TERM) {
    return __awaiter(this, void 0, void 0, function* () {
        const URL = `https://www.rosepharmacy.com/?s=${SEARCH_TERM}&post_type=product`;
        const browser = yield puppeteer_1.default.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });
        const page = yield browser.newPage();
        yield page.goto(URL);
        yield page.setViewport({ width: 300, height: 300 });
        yield page.waitForSelector('.wpb_wrapper.vc_column-inner');
        const productHandles = yield page.$$('.porto-posts-grid.porto-posts-grid-75121fa532f6c490d02770d2b728412e > .products-container > .porto-tb-item');
        const products = [];
        for (const productHandle of productHandles) {
            try {
                const title = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".post-title")) === null || _a === void 0 ? void 0 : _a.textContent; }, productHandle);
                const formatTitle = title === null || title === void 0 ? void 0 : title.replace(/(\r\n|\n|\r)/gm, "").trim();
                const price = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".woocommerce-Price-amount.amount")) === null || _a === void 0 ? void 0 : _a.textContent; }, productHandle);
                const formatPrice = price === null || price === void 0 ? void 0 : price.replace(/(\r\n|\n|\r)/gm, "").trim();
                products.push({
                    title: formatTitle,
                    price: formatPrice
                });
            }
            catch (error) {
                console.log("Error: " + error);
                console.log("Error: " + productHandle);
            }
        }
        yield browser.close();
        return products;
    });
}
function getmeds(SEARCH_TERM) {
    return __awaiter(this, void 0, void 0, function* () {
        const URL = `https://getmeds.ph/search?s=${SEARCH_TERM}`;
        const browser = yield puppeteer_1.default.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });
        const page = yield browser.newPage();
        yield page.goto(URL);
        yield page.setViewport({ width: 300, height: 300 });
        yield page.waitForSelector('.product_list_outer');
        const productHandles = yield page.$$('.product_list_outer > .row.product_list > .col-md-4.col-sm-6 > .product_item');
        const products = [];
        for (const productHandle of productHandles) {
            try {
                const title = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".product_item_title")) === null || _a === void 0 ? void 0 : _a.textContent; }, productHandle);
                const formatTitle = title === null || title === void 0 ? void 0 : title.replace(/(\r\n|\n|\r)/gm, "").trim();
                const price = yield page.evaluate(el => { var _a; return (_a = el.querySelector(".product-list-price")) === null || _a === void 0 ? void 0 : _a.textContent; }, productHandle);
                const formatPrice = price === null || price === void 0 ? void 0 : price.replace(/(\r\n|\n|\r)/gm, "").trim();
                products.push({
                    title: formatTitle,
                    price: formatPrice
                });
            }
            catch (error) {
                console.log("Error: " + error);
                console.log("Error: " + productHandle);
            }
        }
        yield browser.close();
        return products;
    });
}
const allController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SEARCH_TERM = req.query.SEARCH_TERM;
    const tgpProducts = yield tgp(SEARCH_TERM);
    const southstarProducts = yield southstar(SEARCH_TERM);
    const watsonsProducts = yield watsons(SEARCH_TERM);
    const roseProducts = yield rose(SEARCH_TERM);
    const getMedsProducts = yield getmeds(SEARCH_TERM);
    const data = [];
    for (let i = 0; i < tgpProducts.length; i++) {
        data[i] = {
            title: tgpProducts[i].title,
            price: tgpProducts[i].price,
        };
    }
    for (let i = 0; i < southstarProducts.length; i++) {
        data[i + tgpProducts.length] = {
            title: southstarProducts[i].title,
            price: southstarProducts[i].price,
        };
    }
    for (let i = 0; i < watsonsProducts.length; i++) {
        data[i + tgpProducts.length + southstarProducts.length] = {
            title: watsonsProducts[i].title,
            price: watsonsProducts[i].price,
        };
    }
    for (let i = 0; i < roseProducts.length; i++) {
        data[i + tgpProducts.length + southstarProducts.length + watsonsProducts.length] = {
            title: roseProducts[i].title,
            price: roseProducts[i].price,
        };
    }
    for (let i = 0; i < getMedsProducts.length; i++) {
        data[i + tgpProducts.length + southstarProducts.length + watsonsProducts.length + roseProducts.length] = {
            title: getMedsProducts[i].title,
            price: getMedsProducts[i].price,
        };
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
});
exports.allController = allController;
