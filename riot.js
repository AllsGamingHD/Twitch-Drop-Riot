const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const util = require("./util")

puppeteer.use(StealthPlugin())

module.exports = (cb) => {
    puppeteer.launch({
        headless: false,
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" , args: ["--window-position=0,0"]
    }).then(async browser => {

        const username = util.makeid(15)
        const email = "uremail@gmail.com"
        const password = util.makeid(25)

        console.log("Pseudo : " + username);
        console.log("Mot de passe : " + password);
        console.log("Email : " + email);

        const page = (await browser.pages())[0]
        //await page.setBypassCSP(true)

        console.log("Navigation vers la page : riotgames.com");
        await page.goto("https://auth.riotgames.com/authorize?state=c2lnbnVw&nonce=MTksMTg5LDk5LDQ0&prompt=signup&ui_locales=fr-fr&client_id=play-valorant-web-prod&response_type=token%20id_token&scope=account%20openid&redirect_uri=https%3A%2F%2Fbeta.playvalorant.com%2Fopt_in")

        console.log("Ecriture du mail");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > input", { timeout: 30000 })
        await page.type("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > input", email)

        console.log("Page suivante");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button", { timeout: 30000 })
        await page.click("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button")

        console.log("Ecriture de la date de naissance");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div:nth-child(3) > input", { timeout: 30000 })
        await page.click("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div:nth-child(3) > input")
        await page.keyboard.type("12121999")

        console.log("Page suivante");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button", { timeout: 30000 })
        await page.click("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button")

        console.log("Ecriture du pseudo");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > input", { timeout: 30000 })
        await page.type("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > input", username)

        console.log("Page suivante");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button", { timeout: 30000 })
        await page.click("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button")

        console.log("Ecriture du mot de passe #1");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div:nth-child(1) > div > input", { timeout: 30000 })
        await page.type("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div:nth-child(1) > div > input", password)

        console.log("Ecriture du mot de passe #2");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div:nth-child(4) > div > input", { timeout: 30000 })
        await page.type("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div:nth-child(4) > div > input", password)

        console.log("Page suivante");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button", { timeout: 30000 })
        await page.click("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button")

        console.log("Valider les conditions");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div:nth-child(1) > label > input[type=checkbox]", { timeout: 30000 })
        await page.click("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div:nth-child(1) > label > input[type=checkbox]")

        console.log("Créer le compte");
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button", { timeout: 30000 })
        await page.click("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button")


        console.log("Tentative de résolution du captcha...");
        const solution = await util.solveReCaptcha(page)
        console.log(solution)

        await page.evaluate((solution) => {
            document.getElementById("g-recaptcha-response-1").innerHTML = solution
        }, solution)

        await page.mouse.move(100, 100)
        await page.mouse.down()
        await page.mouse.up()

        await page.waitFor(5000)
        await page.waitFor("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button", { timeout: 60000 })
        await page.click("body > div:nth-child(2) > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div.signup-wrapper > form > div > button")

        await page.waitFor("#gatsby-focus-wrapper > section.section.home.hero.dark.HomeHero-module--homeHero--1drYm.in-view.false > div.HomeHero-module--wrapper--2XiHp.HomeHero-module--right--u599P > aside > div > div.SignUp-module--wrapper--3MyY0 > div:nth-child(3) > button", { timeout: 30000 })
        console.log("Comptre créer avec succès !");

        cb(username + "|" + password)

        await page.waitFor(5000)
        await browser.close()
    })

}