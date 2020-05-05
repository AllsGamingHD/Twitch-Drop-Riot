const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const util = require("./util")

puppeteer.use(StealthPlugin())

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = (cb) => {

    let args = ["--lang=fr-FR,fr", "--window-position=0,0"]
    console.log("Lancement de google chrome...");
    puppeteer.launch({ headless: false, executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" , args }).then(async browser => {

        const username = util.makeid(10)
        const password = util.makeid(10)
        console.log("Pseudo : " + username);
        console.log("Mot de passe : " + password);

        const page = (await browser.pages())[0]

        console.log("HTTP Header (Accept-Language) set to 'FR'")
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'fr'
        });

        console.log("Languages forced set to 'FR' on javascript")
        // Set the language forcefully on javascript
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "language", {
                get: function() {
                    return ["fr-FR"];
                }
            });
            Object.defineProperty(navigator, "languages", {
                get: function() {
                    return ["fr-FR", "fr"];
                }
            });
        });

        console.log("Navigation vers la page : twitch.tv");
        await page.goto("https://www.twitch.tv/login")

        console.log("Chargement terminée");
        await page.waitForSelector(".tw-align-items-center:nth-child(2) > .tw-block > .tw-align-left > .tw-flex-grow-0 > .tw-font-size-5", { timeout: 30000 })
        console.log("Selection de la case 'Identifiant'");
        await page.click(".tw-align-items-center:nth-child(2) > .tw-block > .tw-align-left > .tw-flex-grow-0 > .tw-font-size-5")

        console.log("Ecriture du pseudo");
        await page.waitForSelector(".tw-c-background-base #signup-username", { timeout: 30000 })
        await page.type(".tw-c-background-base #signup-username", username)
        console.log("Ecriture du mot de passe #1");
        await page.type(".tw-mg-t-2 #password-input", password)
        console.log("Ecriture du mot de passe #2");
        await page.type(".tw-mg-t-2 #password-input-confirmation", password)

        await page.waitFor("#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.tw-mg-b-1 > form > div > div:nth-child(3) > div > div.tw-flex.tw-flex-row.tw-overflow-auto > div.tw-full-width > select", { timeout: 30000 })
        await page.select("#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.tw-mg-b-1 > form > div > div:nth-child(3) > div > div.tw-flex.tw-flex-row.tw-overflow-auto > div.tw-full-width > select", "4")

        await page.waitFor("#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.tw-mg-b-1 > form > div > div:nth-child(3) > div > div.tw-flex.tw-flex-row.tw-overflow-auto > div:nth-child(1) > div > input", { timeout: 30000 })
        await page.type("#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.tw-mg-b-1 > form > div > div:nth-child(3) > div > div.tw-flex.tw-flex-row.tw-overflow-auto > div:nth-child(1) > div > input", "10")

        await page.waitFor("#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.tw-mg-b-1 > form > div > div:nth-child(3) > div > div.tw-flex.tw-flex-row.tw-overflow-auto > div:nth-child(3) > div > input", { timeout: 30000 })
        await page.type("#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.tw-mg-b-1 > form > div > div:nth-child(3) > div > div.tw-flex.tw-flex-row.tw-overflow-auto > div:nth-child(3) > div > input", "1999")

        console.log("Ecriture de l'email");
        await page.type(".tw-c-background-base #email-input", username + "@tm.in-ulm.de")

        console.log("Valider le compte");
        await page.waitFor(3500)
        await page.click("#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.tw-mg-b-1 > form > div > div:nth-child(5) > button")

        console.log("Captcha ?");

        await page.waitForSelector("#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div.tw-pd-x-4.tw-pd-y-1 > div.tw-inline-flex > div:nth-child(1) > div > input", { timeout: 600000 })
        await page.click("#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div.tw-pd-x-4.tw-pd-y-1 > div.tw-inline-flex > div:nth-child(1) > div > input")

        console.log("Envoi du code par twitch, vérification de la réception");
        const code = await util.verifyMail(username)
        await page.keyboard.type(code)

        console.log("Compte validé !")

        console.log("Attente du message de bienvenue...")
        await page.waitFor("body > div.ReactModalPortal > div > div > div > div > div > div > div.tw-pd-t-3 > button > div", { timeout: 45000 })
        console.log("Valider le message...")
        await page.click("body > div.ReactModalPortal > div > div > div > div > div > div > div.tw-pd-t-3 > button > div")

        console.log("Attente de l'affichage des chaines...")
        await page.waitFor("body > div.ReactModalPortal > div > div > div > div > div > div > div.onboarding-modal-container__body.tw-c-background-alt", { timeout: 30000 })
        console.log("Selection chaine 1...")
        await page.waitFor("body > div.ReactModalPortal > div > div > div > div > div > div > div.onboarding-modal-container__body.tw-c-background-alt > div > div.simplebar-scroll-content > div > div > div > div.tw-pd-t-1 > div:nth-child(1) > div > div:nth-child(1) > div > div > div > div.tw-image-selector.tw-image-selector--mask > label > div", { timeout: 30000 })
        await page.click("body > div.ReactModalPortal > div > div > div > div > div > div > div.onboarding-modal-container__body.tw-c-background-alt > div > div.simplebar-scroll-content > div > div > div > div.tw-pd-t-1 > div:nth-child(1) > div > div:nth-child(1) > div > div > div > div.tw-image-selector.tw-image-selector--mask > label > div")
        console.log("Selection chaine 2...")
        await page.waitFor("body > div.ReactModalPortal > div > div > div > div > div > div > div.onboarding-modal-container__body.tw-c-background-alt > div > div.simplebar-scroll-content > div > div > div > div.tw-pd-t-1 > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div.tw-image-selector.tw-image-selector--mask > label > div", { timeout: 30000 })
        await page.click("body > div.ReactModalPortal > div > div > div > div > div > div > div.onboarding-modal-container__body.tw-c-background-alt > div > div.simplebar-scroll-content > div > div > div > div.tw-pd-t-1 > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div.tw-image-selector.tw-image-selector--mask > label > div")
        console.log("Selection chaine 3...")
        await page.waitFor("body > div.ReactModalPortal > div > div > div > div > div > div > div.onboarding-modal-container__body.tw-c-background-alt > div > div.simplebar-scroll-content > div > div > div > div.tw-pd-t-1 > div:nth-child(1) > div > div:nth-child(3) > div > div > div > div.tw-image-selector.tw-image-selector--mask > label > div", { timeout: 30000 })
        await page.click("body > div.ReactModalPortal > div > div > div > div > div > div > div.onboarding-modal-container__body.tw-c-background-alt > div > div.simplebar-scroll-content > div > div > div > div.tw-pd-t-1 > div:nth-child(1) > div > div:nth-child(3) > div > div > div > div.tw-image-selector.tw-image-selector--mask > label > div")

        console.log("Valider la selection des chaines")
        await page.waitFor("body > div.ReactModalPortal > div > div > div > div > div > div > div.tw-align-middle.tw-elevation-1.tw-full-width.tw-pd-x-1.tw-pd-y-1.tw-relative.tw-z-above > div > div.tw-col-3 > div > button", { timeout: 30000 })
        await page.click("body > div.ReactModalPortal > div > div > div > div > div > div > div.tw-align-middle.tw-elevation-1.tw-full-width.tw-pd-x-1.tw-pd-y-1.tw-relative.tw-z-above > div > div.tw-col-3 > div > button")

        console.log("Compte créer avec succès")
        cb(username + "|" + password + "|" + JSON.stringify(await page._client.send("Network.getAllCookies")))

        await page.waitFor(2500)
        await browser.close()
        return 1;
    })
}