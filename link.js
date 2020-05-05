const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const util = require("./util")

puppeteer.use(StealthPlugin())

module.exports = async (twitchCookies, riotUsername, riotPassword, cb) => {
    let args = ["--lang=fr-FR,fr", "--window-position=-1000,0"]
    puppeteer.launch({ headless: false, executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", args /*, args: ["--proxy-server=socks5://127.0.0.1:1010"] */}).then(async browser => {
        const page = (await browser.pages())[0]

        console.log("Cookie twitch chargée.")
        await page.setCookie(...twitchCookies.cookies)
        //console.log("Cookie riotgames chargée.")
        //await page.setCookie(...riotCookies.cookies)

        console.log("Chargement de la page de connection twitch...")
        await page.goto("https://www.twitch.tv/settings/connections")

        await page.waitFor(4000)

        console.log("Clique sur le bouton de connexion.")
        await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div.tw-flex.tw-flex-nowrap.tw-full-height.tw-overflow-hidden.tw-relative > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div:nth-child(2) > div:nth-child(5) > div > div.connection-component__right.tw-flex.tw-flex-column.tw-flex-grow-1.tw-full-width.tw-pd-x-1 > div.connection-component__header.tw-align-items-center.tw-flex.tw-flex-row > button")
        await page.click("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div.tw-flex.tw-flex-nowrap.tw-full-height.tw-overflow-hidden.tw-relative > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div:nth-child(2) > div:nth-child(5) > div > div.connection-component__right.tw-flex.tw-flex-column.tw-flex-grow-1.tw-full-width.tw-pd-x-1 > div.connection-component__header.tw-align-items-center.tw-flex.tw-flex-row > button")

        try {
            console.log("Compte déjà lier ? ")
            await page.waitFor("body > div.ReactModalPortal > div > div > div > div > div", {timeout: 1000})
            console.log("Oui, passage au compte suivant. ")
            await page.waitFor(1000);
            await browser.close();
            return;
        }
        catch {
            console.log("Non.")
        }

        console.log("Ouverture de la page de connexion riot.")
        const popup = await new Promise(x => browser.once("targetcreated", target => x(target.page())))
        await page.waitFor(5000)

        console.log("Ecriture du pseudo.")
        await popup.waitFor("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div:nth-child(1) > div > input", { timeout: 30000 })
        await popup.type("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div:nth-child(1) > div > input", riotUsername)

        console.log("Ecriture du mot de passe.")
        await popup.waitFor("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div.field.password-field.field--animate > div > input")
        await popup.type("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div.field.password-field.field--animate > div > input", riotPassword)

        console.log("Valider connexion.")
        await popup.waitFor("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > button")
        await popup.click("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > button")

        try {
            console.log("Compte valide ? ")
            await popup.waitFor("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > span", {timeout: 3000})
            console.log("Non, passage au compte suivant.");
            await page.waitFor(1000);
            await browser.close();
            return;
        }
        catch {
            console.log("Oui, continuer")
        }


        try {
            await popup.waitFor("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-direction__column.grid-size-17.grid-panel-web.grid-panel.grid-panel-web-has-links.grid-panel-web-has-header > button", {timeout: 10000})
            await popup.click("body > div > div > div > div.grid.grid-direction__row.grid-page-web__content > div.grid.grid-direction__column.grid-page-web__wrapper > div > div.grid.grid-direction__column.grid-size-17.grid-panel-web.grid-panel.grid-panel-web-has-links.grid-panel-web-has-header > button")
        }
        catch {

        }

        console.log("Connexion reussi !")
        await page.waitFor(5000);
        await browser.close();
    })
}

