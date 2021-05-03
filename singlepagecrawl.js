import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const fs = require('fs');
const puppeteer = require('puppeteer');

(async()=>{
  console.log("-------------main function------------")

           let url="https://put-your-url-here";
           let browser= await puppeteer.launch({headless:true});
           var page=await browser.newPage();
   // page.on('console', consoleObj => console.log(consoleObj.text()));
           await page.goto(url,{waitUntil:'networkidle2',timeout:0});
           const Items=[];
        console.log("---------crawling start--------------")
        //wait for dom to render
            const appTable = await page.waitForSelector(".infinite-scroll-component__outerdiv");
            const list = await page.$$(".infinite-scroll-component__outerdiv >div >div")
            //data type of array
              for (const content of list) {
            const getName = await content.$("div.AgentCard__name");
            const getlocation = await content.$("div.AgentCard__location");
            const getcontact = await content.$('div.AgentCard__contacts>:nth-child(2)');
            const getemail = await content.$('div.AgentCard__contacts>:nth-child(1)');
            const name = await page.evaluate(getName => getName.innerText, getName);
            const location = await page.evaluate(getlocation =>getlocation? getlocation.innerText:"", getlocation);
            const tel = await page.evaluate(getcontact => getcontact?getcontact.innerText:"", getcontact);
            const email = await page.evaluate(getemail =>getemail? getemail.getAttribute('href'):"", getemail);
             Items.push({name,location,email,tel})
                  }
            console.log("---------crawling end--------------")
            fs.writeFileSync('./page1.json', JSON.stringify(Items)+ '\n');
            await browser.close();
})();