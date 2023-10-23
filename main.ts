import 'dotenv/config';
import {ActivityType, Client, GatewayIntentBits} from "discord.js";
import CharacterAI = require("node_characterai");
const {Guilds, MessageContent, GuildMessages, GuildMembers,GuildVoiceStates} = GatewayIntentBits;
const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers,GuildVoiceStates]
});
const characterAI = new CharacterAI();

const fs = require('fs');
const eventFiles = fs.readdirSync('./events').filter((file:any) => file.endsWith('.ts'));

let chatClient: any;
let characterName:any;
const connectCai =async()=>{
    try {
        await characterAI.authenticateWithToken(process.env.ACCESS_TOKEN);
    } catch (error) {
        console.log(error);
    };
    try {
        chatClient = await characterAI.createOrContinueChat(process.env.CHARACTER_ID);
        let characterinfo = await characterAI.fetchCharacterInfo(process.env.CHARACTER_ID);
        characterName= characterinfo.name;
        await client.user.setPresence({
            activities: [{ name: `${characterinfo.name}`, type: ActivityType.Playing }],
        });
        for (const file of eventFiles) {
            const event = require(`./events/${file}`);
            const eventName = file.split('.')[0]; // Assuming your files are named "eventname.js"
            client.on(eventName, (message) => {
                event(client, message, chatClient,characterName);
            });
        };
    } catch (error) {
        console.log(error);
    };
};



connectCai();
client.login(process.env.TOKEN);