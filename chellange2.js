const pup = require("puppeteer");
let id = "vavipa1917@yncyjs.com";
let pass = "Rachit@123";
//if we would have used a json file eg, pepchallange.json than we had to read is by fs but here we had used module.export
//let challenges = require("./pepchallange");
async function main() {
    //command to open browser
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        //browser opens in full screen
        //args: ["--start-maximized"]
    });
    //all of this would run after browser is open
    //inserting all the tabs opened in the browser in an array in pages
    let pages = await browser.pages();
    //selecting a tab from pages 0
    let tab = pages[0];
    await tab.goto("https://www.hackerrank.com/auth/login");
    await tab.type("#input-1", id);
    await tab.type("#input-2", pass);
    //click on log in button
    await tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
    //when page is fully loaded than after that next statement will run (it is waiting for that 500ms where maximum data interchange between server and client is two)
    await tab.waitForNavigation({waitUntil: "networkidle2"});
    //click on your profile name at the top right and view drop down list
    await tab.click(".dropdown-handle.nav_link.toggle-wrap");
    //to click on administration within a tag is data-analytics attribute
    await tab.click("a[data-analytics='NavBarProfileDropDownAdministration']");
    //wait for the page to become visible we could have also used networkidle but here maximum wait limit of networkidle 30000 exceeds
    await tab.waitForSelector(".nav-tabs.nav.admin-tabbed-nav li", {visible: true});
    //select all tags with the given class and store it on arrray linkedlists
    let linkLists = await tab.$$(".nav-tabs.nav.admin-tabbed-nav li");
    //than click on the manage challanges tab at 0 tab manage contest is stored
    await linkLists[1].click();
    await tab.waitForSelector(".table-body.mlB.text-center a", {visible: true});
    let link = await tab.$$(".table-body.mlB.text-center a");
    for(let i=0; i<link.length; i++){
        let urll = await tab.evaluate(function(ele){
            return ele.getAttribute("href");
        },link[i]);
        //whenever we click on something and a new page opens we use goto statement else if something opens on the same page than we use tab.click
        await createmodulators("https://www.hackerrank.com"+urll,await browser.newPage());
    }
}
async function createmodulators(url,tab) {
    await tab.goto(url);
    await tab.waitForSelector(".nav-tabs.nav.admin-tabbed-nav.row li", {visible: true});
    let lo = await tab.$$(".nav-tabs.nav.admin-tabbed-nav.row li");
    await lo[1].click();
    await tab.waitForSelector("#confirm-modal .modal-footer button", {visible: true});
    let k = await tab.$$("#confirm-modal .modal-footer button");
    await k[1].click();
    await tab.waitForSelector(".block.span12.profile-input.pull-left .input-btn-group #moderator", {visible: true});
    await tab.type(".block.span12.profile-input.pull-left .input-btn-group #moderator","rachit");
    await tab.waitForSelector(".block.span12.profile-input.pull-left .input-btn-group .btn.moderator-save", {visible: true});
    let w = await tab.$(".block.span12.profile-input.pull-left .input-btn-group .btn.moderator-save");
    await w.click();
    await tab.click(".save-challenge.btn.btn-green");
}
main(); 