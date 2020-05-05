const fs = require("fs")
const newTwitchAccount = require("./twitch")
const newRiotAccount = require("./riot")
const linkAccounts = require("./link")
const watchTwitchStream = require("./watch")
const checkAcc = require("./checkRAccount")

async function twitch()
{
    const stream = fs.createWriteStream("twitch.txt", {flags:'a'});

    for(let i = 0; i < 1; i++)
    {
        await newTwitchAccount(x => {
            stream.write(x + "\r\n")
        })
        await sleep(220000);
    }
}
async function riot(){
    const stream = fs.createWriteStream("riot.txt", {flags:'a'});
    for(let i = 0; i < 10; i++)
    {
        await newRiotAccount( x => {
            stream.write(x + "\r\n")
        })
        await sleep(200000);
    }
}

async function link(){
    const twitchData = fs.readFileSync("./twitch.txt", "utf-8")
    const twitchList = twitchData.split("\r\n")
    const riotData = fs.readFileSync("./riot.txt", "utf-8")
    const riotList = riotData.split("\r\n")
    console.log(riotList);
    for(let i = 0; i < 65; i++)
    {
        const twitchParts = twitchList[i].split("|")
        const riotParts = riotList[i].split("|")
        linkAccounts(JSON.parse(twitchParts[2]), riotParts[0], riotParts[1], () => {
            console.log("Linked :D")
        });
        await sleep(15000);
    }
    console.log("Terminer");
}

async function watch(){
    const usersData = fs.readFileSync("./use_twitch.txt", "utf-8")
    const usersList = usersData.split("\r\n")
    var comptedepart = 1;
    comptedepart--;
    var comptefin = comptedepart + 6;
    for (var i = comptedepart; i < comptefin; i++)
    {
        const parts = usersList[i].split("|")
        const username = parts[0]
        const password = parts[1]
        const cookies = JSON.parse(parts[2])

        watchTwitchStream(username, password, cookies, i, comptedepart)
        await sleep(5000);
    }
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function checkRiotAccount()
{
    const streampasbon = fs.createWriteStream("riotnonvalide.txt", {flags:'a'});
    const streambon = fs.createWriteStream("riotvalide.txt", {flags:'a'});
    const riotData = fs.readFileSync("./riot.txt", "utf-8")
    const riotList = riotData.split("\r\n")

    for(let i = 0; i < 72; i++)
    {
        const riotParts = riotList[i].split("|")
        await checkAcc(riotParts[0], riotParts[1], x => { streambon.write(x + "\r\n") }, y => { streampasbon.write( y + "\r\n") })
        await sleep(15000);
    }
}

link();