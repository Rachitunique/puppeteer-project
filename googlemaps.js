const pup = require("puppeteer");
//synchronous wait
function wait(ms){
    return new  Promise((resolve,reject) => {
        setTimeout(()=>{
            resolve(ms)
        },ms)
    })
}
async function main() {
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
    });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto("https://maps.google.com");
    //wait(5000);
    await tab.waitForSelector(".widget-homescreen.widget-homescreen-visible.widget-homescreen-no-animation.widget-homescreen-preview-display", {visible: true});
    await tab.waitForSelector(".widget-homescreen-preview-container", {visible: true});
    await tab.waitForSelector(".section-layout.section-cardbox", {visible: true});
    await tab.waitForSelector(".section-homescreen-expand", {visible: true});
    await tab.waitForSelector(".section-homescreen-expand-entrypoint.noprint", {visible: true});
    await tab.waitForSelector(".section-homescreen-expand-entrypoint-icon", {visible: true});
    let r = await tab.$(".widget-homescreen.widget-homescreen-visible.widget-homescreen-no-animation.widget-homescreen-preview-display .widget-homescreen-preview-container .section-layout.section-cardbox .section-homescreen-expand .section-homescreen-expand-entrypoint.noprint .section-homescreen-expand-entrypoint-icon");  
    await r.click();
    
    //typing my home location
    await tab.waitForSelector(".vasquette-margin-enabled.noprint.id-omnibox", {visible: true});
    await tab.waitForSelector("#omnibox-singlebox", {visible: true});
    await tab.waitForSelector("#sb_ifc50", {visible: true});
    await tab.waitForSelector("#gs_lc50", {visible: true});
    await tab.waitForSelector("#searchboxinput",{visible: true});
    await tab.type(".vasquette-margin-enabled.noprint.id-omnibox #omnibox-singlebox #sb_ifc50 #gs_lc50 #searchboxinput","greater noida");
    await tab.keyboard.press("Enter");
    wait(3000);
    
    //selecting selectors for writing the destination location
    await tab.waitForSelector(".section-layout.section-layout-justify-space-between.section-layout-flex-vertical.section-layout-flex-horizontal",{visible: true});
    await tab.waitForSelector(".iRxY3GoUYUY__actionicon.iRxY3GoUYUY__actionicon-text.iRxY3GoUYUY__evenly-distributed-width.iRxY3GoUYUY__promoted.iRxY3GoUYUY__high-contrast", {visible: true});
    await tab.waitForSelector(".iRxY3GoUYUY__taparea", {visible: true});
    let s = await tab.$(".section-layout.section-layout-justify-space-between.section-layout-flex-vertical.section-layout-flex-horizontal .iRxY3GoUYUY__actionicon.iRxY3GoUYUY__actionicon-text.iRxY3GoUYUY__evenly-distributed-width.iRxY3GoUYUY__promoted.iRxY3GoUYUY__high-contrast .iRxY3GoUYUY__taparea")
    await s.click();
    wait(3000);

    //typing my detination location that is Delhi
    await tab.waitForSelector(".widget-directions-omnibox.white-foreground", {visible: true});
    await tab.waitForSelector(".widget-directions-waypoints", {visible: true});
    await tab.waitForSelector(".widget-directions-searchboxes", {visible: true});
    await tab.waitForSelector(".widget-directions-searchbox-container", {visible: true});
    await tab.waitForSelector("#directions-searchbox-0", {visible: true});
    await tab.waitForSelector(".gstl_51.sbib_a", {visible: true});
    await tab.waitForSelector("#sb_ifc51", {visible: true});
    await tab.type(".widget-directions-omnibox.white-foreground .widget-directions-waypoints .widget-directions-searchboxes .widget-directions-searchbox-container #directions-searchbox-0 .gstl_51.sbib_a #sb_ifc51","Delhi");
    await tab.keyboard.press("Enter");
    wait(2000);
    //await tab.waitForSelector(".section-layout.section-layout-root .section-layout", {visible: true});
    //let u = await tab.$(".section-layout.section-layout-root .section-layout #section-directions-trip-0 .section-directions-trip-description .section-directions-trip-numbers .section-directions-trip-duration");
    //let v = await tab.$(".section-layout #section-directions-trip-1");

    //selecting all the classes for getting time
    await tab.waitForSelector(".section-directions-trip-numbers .section-directions-trip-duration", {visible: true});
    let u = await tab.$$(".section-directions-trip-numbers .section-directions-trip-duration");

    // code for removig "typically" which comes along with time in the form of "1 hr 20 min tipically" 
    let b = [];
    for(let i=0; i<2; i++){
        let urll = await tab.evaluate(function(ele){
            return ele.textContent;
        },u[i]);
        console.log(urll);
        let h = urll;
        let z = "";
        for(let g=0; g<h.length; g++){
            if(h[g] == 't' || h[g] == 'y' || h[g] == 'p' || h[g] == 'c' || h[g] == 'a' || h[g] == 'l' || h[g] == 'y'){
                continue;
            }
            else{
                z+=h[g];
            }
        }
        let m = z;

        //calling the convert function after removing typically
        let a = await converttohours(m,await browser.newPage());
        b.push(a);
    }

    //finding the minimum time which will furthur generate the best route for us
    let min = 100;
    let p = 0;
    for(let z=0; z<b.length; z++){
        if(b[z] < min){
            min = b[z];
            p = z;
        }
    }
    console.log("Minimum time that can be taken by a vehicle in hrs is: ",min);
    console.log(" ");
    console.log("The best route that can be followed is: ");
    console.log(" ");
    await tab.waitForSelector(`#section-directions-trip-details-msg-${p}`, {visible: true});
    let f = await tab.$(`#section-directions-trip-details-msg-${p}`);
    await f.click();
    wait("2000");

    //finding the route of the passage that has the minimum time
    await tab.waitForSelector(".directions-mode-body.numbered-step-start .directions-mode-group.closed");
    let q = await tab.$$(".directions-mode-body.numbered-step-start .directions-mode-group.closed");
    for(let i=0; i<q.length; i++){
        let u = await tab.evaluate(function(ele){
            return ele.textContent;
        },q[i]);
        console.log(u);
    }
    //directions-mode-group closed
}

//this function converts time in the form of 1 hr 5 min to hrs
async function converttohours(url,tab) {
    await tab.goto("https://www.google.com/");
    await tab.waitForSelector(".gLFyf.gsfi", {visible: true});
    let o = await tab.$(".gLFyf.gsfi");
    await o.click();
    await tab.type(".gLFyf.gsfi","convert "+url+" to minutes");
    await tab.keyboard.press("Enter");
    //wait(2000);
    await tab.waitForSelector(".vXQmIe.gsrt");
    let y = await tab.$(".vXQmIe.gsrt");
    let u = await tab.evaluate(function(ele){
        return ele.value;
    },y);
    return u;
    
}
main(); 