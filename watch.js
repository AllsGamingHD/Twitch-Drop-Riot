const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const util = require("./util")
const timer = require("easytimer")

puppeteer.use(StealthPlugin())

module.exports = (username, password, cookies, nbinstance, startupinstance, cb) => {
    var win_pos = "--window-position=-8,0";
    if (nbinstance === startupinstance) {
        win_pos = "--window-position=-8,0";
    } else if (nbinstance === (startupinstance + 1)) {
        win_pos = "--window-position=-8,540";
    } else if (nbinstance === (startupinstance + 2)) {
        win_pos = "--window-position=640,0";
    } else if (nbinstance === (startupinstance + 3)) {
        win_pos = "--window-position=640,540";
    } else if (nbinstance === (startupinstance + 4)) {
        win_pos = "--window-position=1280,0";
    } else if (nbinstance === (startupinstance + 5)) {
        win_pos = "--window-position=1280,540";
    }

    async function searchStreamer(page) {
        var streamer = ['ONSCREEN', 'Gotaga', 'Summit1g', 'yassuo', 'lutti', 'Myth', 'AzoX360', 'MoMaN', 'Mickalow'];

        for (let i = 0; i < streamer.length; i++) {
            console.log("Chargement du live de " + streamer[i] + "...")
            await page.goto("https://www.twitch.tv/" + streamer[i], {timeout: 180000})

            console.log("Verification, live en cours ?")
            try {
                await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div:nth-child(1) > div > div.tw-flex.tw-flex-nowrap.tw-full-height.tw-full-width.tw-justify-content-center > div > div.tw-align-items-center.tw-flex.tw-full-height.tw-full-width.tw-justify-content-between > div.channel-header__left.tw-align-items-center.tw-flex.tw-flex-nowrap.tw-full-height > div > div > div.live-indicator.tw-mg-l-05.tw-sm-mg-l-1.tw-visible", {timeout: 10000})
                console.log("Oui.")

            } catch {
                console.log("Non, streamer suivant...")
                continue;
            }


            console.log("Verification, du jeu...")
            const game = await page.evaluate(() => {
                return document.querySelector("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.tw-full-height > div.channel-root__player-container.tw-pd-b-2 > div > div.channel-info-bar.tw-flex.tw-flex-wrap.tw-full-width.tw-justify-content-between.tw-pd-1 > div > div > div.channel-info-bar__info-container.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-between.tw-pd-l-05.tw-pd-r-1 > div > div.tw-flex.tw-mg-t-05 > div.tw-flex.tw-flex-column > div.tw-flex.tw-flex-shrink-0 > div:nth-child(1) > div > p > a").textContent;
            });
            if (game === "VALORANT") {
                console.log("Le jeu est " + game + ".")
            } else {
                console.log("Le jeu est " + game + ".")
                console.log("Le jeu n'est pas le bon, streamer suivant...")
                continue;
            }


            // SI REACTIVATION DROPS POUR PAS TOUS LE MONDE
            await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.tw-full-height > div.channel-root__player-container.tw-pd-b-2 > div > div.channel-info-bar.tw-flex.tw-flex-wrap.tw-full-width.tw-justify-content-between.tw-pd-1 > div > p", {timeout: 60000})
            try {
                const dropactivate = await page.evaluate(() => {
                    return document.querySelector("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.tw-full-height > div.channel-root__player-container.tw-pd-b-2 > div > div.channel-info-bar.tw-flex.tw-flex-wrap.tw-full-width.tw-justify-content-between.tw-pd-1 > div > p").textContent;
                });
                console.log("Les drops sont activée !");
                console.log("Débit réduit pour baisser la qualiter.");
                // Connect to Chrome DevTools
                const client = await page.target().createCDPSession()

                // Set throttling property
                await client.send('Network.emulateNetworkConditions', {
                    'offline': false,
                    'downloadThroughput': 150 * 1024 / 8,
                    'uploadThroughput': 100 * 1024 / 8,
                    'latency': 20
                })

                //await checkSoundVolume(page);

                console.log("Rechargement de la page dans 60 secondes pour mettre à jour le status")
                await sleep(1 * 60 * 1000);
                await page.reload();
                console.log("Page rechargée !\nVérification du volume dans 1 minute")
                await sleep(1 * 60 * 1000);
                await checkSoundVolume(page);
                await checkOnline(page);
                console.log("Reload du live toutes les 2h !");
                break;
            } catch {
                console.log("Les drops sont desactivée :(");
                console.log("Streamer suivant...");
            }
        }
    }

    //ONLINE document.querySelector("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(1) > button > div > figure > div > div > div.tw-absolute.tw-border-radius-rounded.tw-left-0.tw-presence__indicator.tw-presence__indicator--online.tw-top-0")
    //OFFLINE document.querySelector("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(1) > button > div > figure > div > div > div.tw-absolute.tw-border-radius-rounded.tw-left-0.tw-presence__indicator.tw-presence__indicator--offline.tw-top-0")

    async function checkOnline(page)
    {
        console.log("Utilisateur en ligne ?")
        await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(1) > button", { timeout: 30000})
        const isOnline = await page.evaluate(() => {
            var reponse = document.querySelector("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div > button > div > figure > div > div > div").className
            console.log(reponse);
            if (reponse === "tw-absolute tw-border-radius-rounded tw-left-0 tw-presence__indicator tw-presence__indicator--online tw-top-0")
            {
                return "En ligne"
            }
            else if (reponse === "tw-absolute tw-border-radius-rounded tw-left-0 tw-presence__indicator tw-presence__indicator--offline tw-top-0")
            {
                return "Deconnecté"
            }
            else
            {
                return "Absent"
            }
        });

        if (isOnline === "En ligne")
        {
            console.log("Oui");
        }
        else if (isOnline === "Absent")
        {
            console.log("Non, status absent")
        }
        else
        {
            console.log("Non, Déconnecté\nRemise du status en ligne puis rechargement de la page !")
            await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(1) > button")
            await page.click("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(1) > button");
            await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div.simplebar-scroll-content > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div > div > input")
            await page.click("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div.simplebar-scroll-content > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div > div > input")
            await page.reload();
            await checkOnline(page);
            return;
        }
        await checkViewing(page);

    }

    async function checkViewing(page)
    {
        console.log("Check satuts viewing streamer...")
        await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(1) > button > div > figure", { timeout: 60000 })
        await page.click("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(1) > button > div > figure")
        const viewingWhat = await page.evaluate(() => {
            var reponse = document.querySelector("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div.simplebar-scroll-content > div > div > div:nth-child(1) > div:nth-child(1) > div.tw-flex.tw-pd-b-1 > div.tw-flex.tw-flex-column.tw-flex-grow-1.tw-justify-content-center.tw-pd-l-1 > div.presence-text.tw-c-text-alt-2 > span").textContent
            return reponse.trim().toLowerCase();
        });
        var twitchchannel = await page.url();
        twitchchannel = twitchchannel.substring(twitchchannel.lastIndexOf('/') + 1, twitchchannel.length).trim().toLowerCase();

        if (viewingWhat === "regarde " + twitchchannel + " streamer VALORANT".toLowerCase())
        {
            console.log("Viewing status, OK !")
        }
        else
        {
            console.log("Viewing status, A VERIFIER !")
        }
        await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(1) > button > div > figure", { timeout: 60000 })
        await page.click("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > nav > div > div.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-end > div.tw-flex.tw-full-height.tw-mg-r-1.tw-pd-y-1 > div > div > div > div:nth-child(1) > button > div > figure")
    }


    async function checkSoundVolume(page) {

        console.log("Sound check...")

        await page.mouse.move(325, 215);
        await page.mouse.click(325, 215);
        await page.waitFor(1000);
        await page.mouse.move(94, 323);
        await page.mouse.move(200, 323);
        await page.mouse.click(200, 323);

        console.log("Son à 100%")
    }

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    puppeteer.launch({ headless: false, executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" , args: ["--window-size=640,540", win_pos/*"--proxy-server=socks5://127.0.0.1:1010"]*/]}).then(async browser => {
        const page = (await browser.pages())[0]
        await page.setCookie(...cookies.cookies)

        await setHeaders(page, browser);

        setInterval(async () => {
            const numberOfOpenPages = (await browser.pages()).length
            for (const page of await browser.pages())
            {

                var url = page.url();

                if (url !== "about:blank") {
                    if (!url.includes('twitch.tv')) {
                        await page.close();
                        console.log("Fermeture onglets (PUB...)");
                    }
                }
            }
        }, 1000);

        await searchStreamer(page);

        let count = 0;

        setInterval(async () => {

            browser.on('targetcreated', function(){
                console.log('New Tab Created');
            })

            console.log("Check...");
            if (count === 24)
            {
                console.log("Rechargement des pages (2h)...")
                await page.reload();
                count = 0;
                await checkSoundVolume(page);
                await checkOnline(page);
            }

            console.log("Verification, live en cours ?")
            try {
                await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div:nth-child(1) > div > div.tw-flex.tw-flex-nowrap.tw-full-height.tw-full-width.tw-justify-content-center > div > div.tw-align-items-center.tw-flex.tw-full-height.tw-full-width.tw-justify-content-between > div.channel-header__left.tw-align-items-center.tw-flex.tw-flex-nowrap.tw-full-height > div > div > div.live-indicator.tw-mg-l-05.tw-sm-mg-l-1.tw-visible", {timeout: 60000 })
                console.log("Oui.")
            } catch {
                console.log("Non, streamer suivant...")
                console.log("Remise du débit en attendant de trouver un streamer.");
                // Connect to Chrome DevTools
                const client = await page.target().createCDPSession()

                // Set throttling property
                await client.send('Network.emulateNetworkConditions', {
                    'offline': false,
                    'downloadThroughput': 1000 * 1024 / 8,
                    'uploadThroughput': 130 * 1024 / 8,
                    'latency': 20
                })
                await searchStreamer(page);
                return;
            }


            console.log("Verification, du jeu...")
            const game = await page.evaluate(() => {
                return document.querySelector("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.tw-full-height > div.channel-root__player-container.tw-pd-b-2 > div > div.channel-info-bar.tw-flex.tw-flex-wrap.tw-full-width.tw-justify-content-between.tw-pd-1 > div > div > div.channel-info-bar__info-container.tw-flex.tw-flex-grow-1.tw-flex-shrink-1.tw-full-width.tw-justify-content-between.tw-pd-l-05.tw-pd-r-1 > div > div.tw-flex.tw-mg-t-05 > div.tw-flex.tw-flex-column > div.tw-flex.tw-flex-shrink-0 > div:nth-child(1) > div > p > a").textContent;
            });
            if (game === "VALORANT") {
                console.log("Le jeu est " + game + ".")
            } else {
                console.log("Le jeu est " + game + ".")
                console.log("Le jeu n'est pas le bon, streamer suivant...")
                console.log("Remise du débit en attendant de trouver un streamer.");
                // Connect to Chrome DevTools
                const client = await page.target().createCDPSession()

                // Set throttling property
                await client.send('Network.emulateNetworkConditions', {
                    'offline': false,
                    'downloadThroughput': 1000 * 1024 / 8,
                    'uploadThroughput': 130 * 1024 / 8,
                    'latency': 20
                })
                await searchStreamer(page);
            }

            await page.waitFor("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.tw-full-height > div.channel-root__player-container.tw-pd-b-2 > div > div.channel-info-bar.tw-flex.tw-flex-wrap.tw-full-width.tw-justify-content-between.tw-pd-1 > div > p", {timeout: 60000 })
            try {
                const dropactivate = await page.evaluate(() => {
                    return document.querySelector("#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.tw-full-height > div.channel-root__player-container.tw-pd-b-2 > div > div.channel-info-bar.tw-flex.tw-flex-wrap.tw-full-width.tw-justify-content-between.tw-pd-1 > div > p").textContent;
                });
                console.log("Les drops sont activée !");
                await checkSoundVolume(page);
                await checkOnline(page);
            } catch {
                console.log("Les drops sont desactivée :(");
                console.log("Recherche d'un nouveau streamer");
                console.log("Remise du débit en attendant de trouver un streamer.");
                // Connect to Chrome DevTools
                const client = await page.target().createCDPSession()

                // Set throttling property
                await client.send('Network.emulateNetworkConditions', {
                    'offline': false,
                    'downloadThroughput': 1000 * 1024 / 8,
                    'uploadThroughput': 130 * 1024 / 8,
                    'latency': 20
                })
                await searchStreamer(page);
            }


        }, 5 * 60 * 1000)

        async function setHeaders(page) {
            console.log("Tentative de configuration des Headers en français...")
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'fr'
            });

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
            console.log("Headers configurée en français avec succès !")
        }
    })
}