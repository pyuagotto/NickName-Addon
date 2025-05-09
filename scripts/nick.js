//@ts-check
import { world, system, CustomCommandParamType, CustomCommandOrigin, Player, CustomCommandStatus, CommandPermissionLevel } from "@minecraft/server";

/**
 * @param {CustomCommandOrigin} origin 
 * @param {String} name 
 * @returns { { status: CustomCommandStatus, message?: string } }
 */
const nick = function(origin, name) {
    if(origin.sourceEntity instanceof Player){
        const player = origin.sourceEntity;

        if(player.hasTag("nick")){
            system.run(()=>{
                player.nameTag = name;
            });
            
            return { status: CustomCommandStatus.Success, message: `§bあなたの名前は ${name} に変更されました`}
        }

        else{
            return { status: CustomCommandStatus.Failure, message: `権限がありません！`}
        }
    }else{
        return { status: CustomCommandStatus.Failure, message: `このコマンドはプレイヤー以外に対して実行できません`}
    }
};

/**
 * 
 * @param {CustomCommandOrigin} origin 
 * @returns { { status: CustomCommandStatus, message?: string }}
 */
const resetnick = function(origin) {
    if(origin.sourceEntity instanceof Player){
        const player = origin.sourceEntity;

        if(player.hasTag("nick")){
            system.run(()=>{
                player.nameTag = player.name;
            });
            
            return { status: CustomCommandStatus.Success, message: `§b名前がリセットされました`}
        }

        else{
            return { status: CustomCommandStatus.Failure, message: `権限がありません！`}
        }
        
    }else{
        return { status: CustomCommandStatus.Failure, message: `このコマンドはプレイヤー以外に対して実行できません`}
    }
};

system.beforeEvents.startup.subscribe((ev) => {
    /**
     * @param {string} name 
     * @param {string} description 
     * @param {import('@minecraft/server').CustomCommandParameter[]} mandatoryParameters 
     * @param {(origin: CustomCommandOrigin, ...args: any[]) => { status: CustomCommandStatus }} callback 
     */
    const registerCommand = function(name, description, mandatoryParameters, callback) {
        ev.customCommandRegistry.registerCommand(
            {
                name,
                description,
                mandatoryParameters,
                permissionLevel: CommandPermissionLevel.Any,
            },
            callback
        );
    };

    registerCommand(
        "pyuagotto:nick",
        "ネームタグを変更します",
        [
            {
                name: "name",
                type: CustomCommandParamType.String,
            }
        ],
        nick
    );

    registerCommand(
        "pyuagotto:resetnick",
        "ネームタグをリセットします",
        [],
        resetnick
    );
});

world.beforeEvents.chatSend.subscribe((ev)=>{
    const { sender, message } = ev;

    if(sender.name != sender.nameTag){
        ev.cancel = true;

        world.sendMessage(`<${sender.nameTag}> ${message}`);
    }
});