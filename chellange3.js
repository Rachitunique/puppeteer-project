const pup = require("puppeteer");
let id = "vavipa1917@yncyjs.com";
let pass = "Rachit@123";
async function main(){
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
    });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto("https://www.hackerrank.com/auth/login");
    await tab.type("#input-1", id);
    await tab.type("#input-2", pass);
    await tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
    await tab.waitForSelector("#base-card-1-link", {visible: true});
    await tab.click("#base-card-1-link");
    await tab.waitForSelector("a[data-attr1='warmup']", {visible: true});
    await tab.click("a[data-attr1='warmup']");
    await tab.waitForSelector(".js-track-click.challenge-list-item", {visible: true});
    let allUrlsPromise = await tab.$$(".js-track-click.challenge-list-item");
    for(let i=0; i<2; i++){
        let urll = await tab.evaluate(function(ele){
            return ele.getAttribute("href");
        },allUrlsPromise[i]);
        await solveQuestion("https://www.hackerrank.com"+urll,await browser.newPage());
    }
}
async function solveQuestion(url,tab) {
    let problemUrl = url;
    let editorialurl = url.replace("?","/editorial?");
    await tab.goto(editorialurl);
    await tab.waitForSelector(".hackdown-content h3", {visible: true});
    let languagesPromise = await tab.$$(".hackdown-content h3");
    let languagesPromises = [];
    for(let i=0; i<languagesPromise.length; i++){
        let urlll = await tab.evaluate(function(ele){
            return ele.textContent;
        },languagesPromise[i]);
        languagesPromises.push(urlll);
    }
    let o = "";
    for(let i=0; i<languagesPromises.length; i++){
        if (languagesPromises[i] == "C++"){
            let finalAnswerPromise = await tab.$$(".highlight");
            let answerPromise = await tab.evaluate(function(ele){
                return ele.textContent;
            },finalAnswerPromise[i]);
            o = answerPromise;
        }
    }
    await tab.goto(problemUrl);
    await tab.waitForSelector(".custom-input-checkbox", {visible: true});
    await tab.click(".custom-input-checkbox");
    await tab.type(".custominput",o);
    await tab.keyboard.down("Control");
    await tab.keyboard.press("A");
    await tab.keyboard.press("X");
    await tab.click(".monaco-scrollable-element.editor-scrollable.vs");
    await tab.keyboard.press("A");
    await tab.keyboard.press("V");
    await  tab.keyboard.up("Control");
    await tab.click(".pull-right.btn.btn-primary.hr-monaco-submit");
    await tab.waitForSelector(".congrats-wrapper", {visible: true});
}
main();