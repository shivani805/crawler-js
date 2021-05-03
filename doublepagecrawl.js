import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const puppeteer = require('puppeteer');
//this is for crawl data from first page then click the given selector from this page and start
//crawling from another page 



(async()=>{
  console.log("-------------main function------------")

           let url="https://put-your-url-here";
           let browser= await puppeteer.launch({headless:true});
           var page=await browser.newPage();
           await page.goto(url,{waitUntil:'networkidle2',timeout:0});
           const items= await scrapeInfiniteScrollItems(page,extractItems,100) 
            console.log(items.length)
            fs.writeFileSync('./page2.json', JSON.stringify(items)+ '\n');
            await browser.close();
  console.log("-------------end------------")

})();


    async function extractItems(page){
          console.log("---------extract data begin--------------")
          const Items=[];
          var count;
          //wait for render dom
          await page.waitForSelector(".infinite-scroll-component__outerdiv");
          const list = await page.$$(".infinite-scroll-component__outerdiv >div >div")
          console.log("----------------get all data in array for click event-----------------")
              for (const [i,content] of list.entries()) {
              const index=i+1;
         console.log("-------wait for dom ,neccessary for page redirect to previous page after click-----------")
              await page.waitForSelector("div.infinite-scroll-component") 
         console.log("--------------------wait for click event---------------------")
              await page.click('div.infinite-scroll-component>div:nth-child('+index+')');
         console.log("--------------------clicked and navigated to second page---------------------")

         console.log("--------------------wait for dom render after navigation---------------------")
            const appTable = await page.waitForSelector(".AgentHeader__content");
            const getname = await page.$("div.AgentHeader__name");
            const getlicense = await page.$("div.AgentHeader__personal > div.AgentHeader__licenses>div");
            const getlocation = await page.$("div.AgentHeader__location");
            const getteam = await page.$("div.AgentHeader__team >div");
            const getteamname = await page.$("div.AgentContent__teamName");
            const getteambody = await page.$("div.AgentContent__teamBody");
            const marketcenter = await page.$("div.AgentContent_market_center");
            const getemail = await page.$("div.AgentContent__factBody > a");
            const getcontact = await page.$("div.AgentContent>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)");
            const teamName=await page.evaluate(getteamname => getteamname? getteamname.innerText:"", getteamname);
            const license=await page.evaluate(getlicense => getlicense? getlicense.innerText:"", getlicense);
            const team=await page.evaluate(getteam => getteam?getteam.innerText:"", getteam);
            const name=await page.evaluate(getname => getname?getname.innerText:"", getname);
            const teamDetails=await page.evaluate(getteambody => getteambody?getteambody.innerText:"", getteambody);
            const marketCenter=await page.evaluate(marketcenter => marketcenter?marketcenter.innerText:"", marketcenter);
            const email=await page.evaluate(getemail => getemail?getemail.innerText:"", getemail);
            const location=await page.evaluate(getlocation => getlocation?getlocation.innerText:"", getlocation);
            const contact=await page.evaluate(getcontact => getcontact?getcontact.innerText:"", getcontact);

            await Items.push({teamName,license,team,email,marketCenter,teamDetails,name,location,contact})
        console.log("--------------------go back start---------------------")
            await page.goBack();
        console.log("--------------------go back end---------------------")
                  }
        return Items;
        console.log("---------extract data end--------------")
            }


async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  try {
         items= await extractItems(page)
  }
catch(e){}
  return items;
}