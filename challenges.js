const pup = require("puppeteer");
let id = "pokowa1759@shzsedu.com";
let pass = "Random@1997";
//if we would have used a json file eg, pepchallange.json than we had to read is by fs but here we had used module.export
let challenges = require("./pepchallange");
async function main() {
    //command to open browser
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        //browser opens in full screen
        args: ["--start-maximized"]
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
    //wait for the create challange button to load
    await tab.waitForSelector(".btn.btn-green.backbone.pull-right", {visible: true});
    //select the create challange button
    let createChallengeButton = await tab.$(".btn.btn-green.backbone.pull-right");
    //now we will cretae the createchallangeurl by selecting the href attribute of the createchallangebutton class
    let createChallengeUrl = await tab.evaluate(function(ele){
        return ele.getAttribute("href");
    },createChallengeButton);
    //now for each challange we will create the challange
    //in place of 2 in reality it was challanges.length
    for(let i = 0; i < 2; i++) {
        //every time new tab goes as an argument because of await browser.newpage one for each challange if we remove await everything would be done parally and at one time 11 tabs will open
        //everytime new tab is send because saving was taking time therefore each one is alloted different tag
        await createChallenge("https://www.hackerrank.com" + createChallengeUrl,challenges[i],await browser.newPage() );
    }
    

}
async function createChallenge(url,challenge,tab) {
    await tab.goto(url);
    //after going to url wait for the name id to load
    await tab.waitForSelector("#name",{visible: true});
    //now challange name will be typed on tab bar challanhe name with id name
    await tab.type("#name",challenge["Challenge Name"]);
    //now type on preview the description of challange
    await tab.type("#preview",challenge["Description"]);
    await tab.waitForSelector("#problem_statement-container .CodeMirror textarea",{visible: true});
    await tab.type("#problem_statement-container .CodeMirror textarea", challenge["Problem Statement"]);
    await tab.type("#input_format-container .CodeMirror textarea", challenge["Input Format"]);
    await tab.type("#constraints-container .CodeMirror textarea", challenge["Constraints"]);
    await tab.type("#output_format-container .CodeMirror textarea", challenge["Output Format"]);
    //we need to press enter after typing the tag name as after that only tab actually becomes valid
    await tab.type("#tags_tag",challenge["Tags"]);
    await tab.keyboard.press("Enter");
    //click on save changes
    await tab.click(".save-challenge.btn.btn-green");
}
main(); 