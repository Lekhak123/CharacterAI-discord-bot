const { PermissionsBitField } = require('discord.js');

async function cleanDiscordMessageContent(messageContent:any) {
    messageContent = messageContent.replace(/<@!?\d+>/g, '');
    messageContent = messageContent.replace(/<#\d+>/g, '');
    messageContent = messageContent.replace(/<@&\d+>/g, '');
    messageContent = messageContent.replace(/<a?:\w+:\d+>|[\x00-\x19]/g, '');
    messageContent = messageContent.replace(/[^ -~]+/g, '');
    return messageContent.trim();
}

module.exports = async(client : any, message : any, chatClient : any,characterName:string) => {
    if (message.author.bot || !message.content) {
        return;
    };
    if (!(message.channel.id === process.env.MSGCHANNEL)) {
        return;
    };

    try {
        let msgContent = await cleanDiscordMessageContent(message.content);
        if(!chatClient){
            return;
        };
        try {
            if(!message.member.permissionsIn(message.channel).has(PermissionsBitField.Flags.KickMembers)){
                message?.member?.setNickname(`Talking to: ${characterName}`);
            }
        } catch (error) {
            console.log(error);
        };
        await message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SendMessages: false });
        const response = await chatClient.sendAndAwaitResponse(`${msgContent}`, true);
        await message.channel.send(`${response.text}`);
        await message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SendMessages: true });

        return;
    } catch (error) {
        console.error(error);
    }
};
