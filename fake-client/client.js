const puppeteer = require('puppeteer');
const yargs = require("yargs");

const argv = yargs
  .option("max", {
    description: 'Max number of browser to open at the same time',
    alias: 'm',
    default: 5,
  })
  .option("address", {
    description: 'Address of the chat server',
    alias: 'a',
    default: "127.0.0.1:8080",
  })
  .option("interval", {
    description: "Time, in milliseconds, before a new teacher is spawned.",
    alias: 'i',
    default: 5000,
  })
  .demandOption([])
  .help()
  .alias('help', 'h')
  .argv

var concurrencyLock = argv.max ;

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function startBrowser() {
  console.log(`started new client for ${argv.address}`)
  //const browser = await puppeteer.launch({args: ['--proxy-server=direct://']});
  const browser = await puppeteer.launch();

  try {
    await new Promise(async (resolve, error) => {
      try {
        const page = await browser.newPage();
        
        console.log(`http://${argv.address}/`)
        await page.goto(`http://${argv.address}`);

        // Main Page
        await page.waitForSelector("#redirectToLogin");
        await page.click("#redirectToLogin");

        // Login
        await page.waitForSelector("#username");
        await page.type("#username", "Teacher1");
        await page.waitForSelector("#password");
        await page.type("#password", "6HU2aXLCPqUNeS9tQkK84Q9eyWNvHAXD");

        await page.waitForSelector("#submitLogin");
        await page.click("#submitLogin");
        await page.waitForSelector(".MuiCircularProgress-svg");

        // Chatroom
        await page.waitForSelector(".rcw-launcher");
        await page.click(".rcw-launcher");

        delay(120000).then(() => {
          resolve()
        });

        // Chatbot

        // Welcome
        await page.waitForSelector(".rcw-new-message");
        await page.type(".rcw-new-message", "Hi! Welcome to the teacher hotline, where we can help you with your homework! What is your name?");
        await page.click(".rcw-send-icon")

        let latestMessage = "";

        // Ask name
        await delay(100);
        await page.waitForFunction(`document.getElementById("latestMessage").value != "${latestMessage}"`)
        await page.waitForSelector("#latestMessage")
        let studentName = await page.evaluate(() => {return document.getElementById("latestMessage").value});
        latestMessage = studentName;

        await page.type(".rcw-new-message", `Cool, ${studentName}, glad to see you!`);
        await page.click(".rcw-send-icon")

        // Asks subject
        let subject = null;

        while(!subject) {
          await delay(100);
          await page.type(".rcw-new-message", `What subject do you need help with? Press 1 for English, 2 for Math, 3 for Other`);
          await page.click(".rcw-send-icon")
  
          await page.waitForFunction(`document.getElementById("latestMessage").value != "${latestMessage}"`)
          await page.waitForSelector("#latestMessage")
          let subjectChoice = await page.evaluate(() => {return document.getElementById("latestMessage").value});
          latestMessage = subjectChoice

          await delay(100);
          switch(subjectChoice) {
            case '1':
              await page.type(".rcw-new-message", `English is awesome. What is your question?`);
              await page.click(".rcw-send-icon")
              subject = 1
              break;
            case '2':
              await page.type(".rcw-new-message", `Math? Count on me! What is your question?`);
              await page.click(".rcw-send-icon")
              subject = 2
              break;
            case '3':
              await page.type(".rcw-new-message", `Let's see how I can help. What is your question?`);
              await page.click(".rcw-send-icon")
              subject = 3
              break;
            default:
              await page.type(".rcw-new-message", `I am not sure I understand. Please try asking again.`);
              await page.click(".rcw-send-icon")
          }
        }

        while(true) {
          // Wait for a new message that's different than the previous
          await delay(100);
          await page.waitForFunction(`document.getElementById("latestMessage").value != "${latestMessage}"`)
          latestMessage = await page.evaluate(() => {return document.getElementById("latestMessage").value});

          let possibleAnswers = ["I am not sure I understand. Please try asking again."];
          switch(subject) {
            case 1:
              possibleAnswers = [
                "I am not sure I understand. Did you want to learn some fun facts about Moby <censored> ?",
                "I am not sure I understand. Did you want to learn about nouns?",
                "I am not sure I understand. Did you want to learn about verb?",
              ]
              break;
            case 2:
              possibleAnswers = [
                "I am not sure I understand. Did you want to learn about trigonometry?",
                "I am not sure I understand. Did you want to learn about geometry?",
                "I am not sure I understand. Did you want to learn about algebra?",
                "I am not sure I understand. Did you want to learn about pi?"
              ]
              break;
            case 3:
              possibleAnswers = [
                "I am not sure I understand. Did you want to learn about quantum entanglement?",
                "I am not sure I understand. Did you want to learn about the life of Genghis Khan?",
                "I am not sure I understand. Did you want to learn about the lifespan of a platypus?",
                "I am not sure I understand. Did you want to learn about our lord and savior, Raptor Jesus?"
              ]
              break;
          }

          let msg = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];

          await page.type(".rcw-new-message", msg);
          await page.click(".rcw-send-icon")
        }
      }
      catch(err) {
        error(err)
      }
    })
  }
  catch(err) {
    console.log(`teacher ${argv.address} crashed! ${err}`)
  }
  finally {
    await browser.close();
  }

  console.log(`teacher ${argv.address} done!`)
}

setInterval(async () => {
  if(concurrencyLock > 0) {
    concurrencyLock -= 1;
    await startBrowser();
    concurrencyLock += 1;
  }
}, argv.interval)
