/**
 * @name CRYPT
 * @author Flo
 * @updateUrl https://raw.githubusercontent.com/flolep2607/discordcrypt/main/CRYPT.plugin.js?token=AF3NZNCQY4MZ42VMZ7LVKRC76TBOQ
 */

const { clearInterval } = require("timers");

module.exports = (_ => {
    const config = {
        "info": {
            "name": "CryptonaTor",
            "author": "Flo",
            "version": "1.0.8",
            "description": "Encrypt message"
        }
    };

    return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
        getName() {
            return config.info.name;
        }
        getAuthor() {
            return config.info.author;
        }
        getVersion() {
            return config.info.version;
        }
        getDescription() {
            return config.info.description;
        }

        load() {
            if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {
                pluginQueue: []
            });
            if (!window.BDFDB_Global.downloadModal) {
                window.BDFDB_Global.downloadModal = true;
                BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onCancel: _ => {
                        delete window.BDFDB_Global.downloadModal;
                    },
                    onConfirm: _ => {
                        delete window.BDFDB_Global.downloadModal;
                        require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
                            if (!e && b && b.indexOf(`* @name BDFDB`) > -1) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => {});
                            else BdApi.alert("Error", "Could not download BDFDB library plugin, try again some time later.");
                        });
                    }
                });
            }
            if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
        }
        start() {
            this.load();
        }
        stop() {}
        getSettingsPanel() {
            let template = document.createElement("template");
            template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The library plugin needed for ${config.info.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
            template.content.firstElementChild.querySelector("a").addEventListener("click", _ => {
                require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
                    if (!e && b && b.indexOf(`* @name BDFDB`) > -1) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => {});
                    else BdApi.alert("Error", "Could not download BDFDB library plugin, try again some time later.");
                });
            });
            return template.content.firstElementChild;
        }
    } : (([Plugin, BDFDB]) => {
        const messageDelay = 1000; //changing at own risk, might result in bans or mutes
        const USER_KEY=document.querySelector('section.da-panels div.da-container img').getAttribute("src").split("/")[4];

        return class CryptonaTor extends Plugin {
            onLoad() {
                this.patchedModules = {
                    before: {
                        ChannelTextAreaForm: "render",
                    },
                    after: {
                        Messages: "type",
                        ChannelTextAreaForm: "render",
                    }
                };
            }

            onStop() {
                BDFDB.PatchUtils.forceAllUpdates(this);
            }
            encrypt(msg,key){
                var temp = CryptoJS.AES.encrypt(msg, key);
                return temp.toString();
            }
            decrypt(msg,key){
                var code = CryptoJS.AES.decrypt(msg, key);
                try{
                    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
                    console.log(decryptedMessage)
                    return decryptedMessage;
                }catch(err){
                    return "🔓ENCRYPTED MESSAGE WITHOUT THE GOOD KEY🔓"
                }
            
            }
            isBlank(str) {
                return (!str || /^\s*$/.test(str));
            }
            processMessages (e) {
                let messagesIns = e.returnvalue.props.children;
                console.log(">>",messagesIns.props);
				if (BDFDB.ObjectUtils.is(messagesIns.props.messages) && BDFDB.ArrayUtils.is(messagesIns.props.messages._array)) {
                    let messages = messagesIns.props.messages;
                    messagesIns.props.messages._array.forEach((msg, index) => {
                        if(msg.content.startsWith("🔒")){
                            console.log("🔒",msg.channel_id);
                            messagesIns.props.messages._array[index].content ="🔓"+this.decrypt(msg.content.substring(2),msg.channel_id);
                        }
                    });
				}
            }
            onStart() {
                // if (!BDFDB.PatchUtils.isPatched(this, e.instance, "editMessage")) {
                    BDFDB.PatchUtils.patch(this, BDFDB.LibraryModules.MessageUtils, "editMessage", {before: e => {
                        console.log(e)
                        // const OTHER_KEY=document.querySelector('a.da-selected div[role="img"]').getAttribute("user_by_bdfdb");
                        const KEY=document.querySelector("div.da-selected").getAttribute("href").split("/")[3];
                        if(e.methodArguments[2].content.startsWith("!")){
                            e.methodArguments[2].content="🔒"+this.encrypt(e.methodArguments[2].content.substring(1),KEY);
                            // e.methodArguments[2].content="🔒"+this.encrypt(e.methodArguments[2].content,USER_KEY+OTHER_KEY);
                        }
                    }});
                    BDFDB.PatchUtils.patch(this, BDFDB.LibraryModules.MessageUtils, "startEditMessage", {before: e => {
                        if(e.methodArguments[1].startsWith("🔓")){
                            e.methodArguments[1]=!+e.methodArguments[1].substring(2);
                        }
                    }});
                // }
                BDFDB.PatchUtils.forceAllUpdates(this);
                // if(this.boucle!=null){try{clearInterval(this.boucle)}catch(err){}}
                // this.boucle=setInterval(() => {
                //     this.decryptall();
                // },5000);
                // this.decryptall();
            }
            processChannelTextAreaForm(e) {
                // console.log(e);
                if (!BDFDB.PatchUtils.isPatched(this, e.instance, "handleSendMessage")) {
                    BDFDB.PatchUtils.patch(this, e.instance, "handleSendMessage", {
                        instead: e2 => {
                            console.log(e2)
                            if(e2.methodArguments[0].startsWith("!") && !this.isBlank(e2.methodArguments[0].substring(1))){
                                e2.stopOriginalMethodCall();
                                // const OTHER_KEY=document.querySelector('a.da-selected div[role="img"]').getAttribute("user_by_bdfdb");
                                const KEY=document.querySelector("div.da-selected").getAttribute("href").split("/")[3];
                                const original_message = e2.methodArguments[0];
                                var message = this.encrypt(original_message.substring(1),KEY);
                                console.log(KEY,original_message,message);
                                // var message = this.encrypt(original_message.substring(1),USER_KEY+OTHER_KEY);
                                // console.log(USER_KEY,OTHER_KEY,original_message,message);
                                e2.originalMethod("🔒"+message);
                                return Promise.resolve({
                                    shouldClear: true,
                                    shouldRefocus: true
                                });
                            }else{
                                return e2.callOriginalMethodAfterwards();
                            }
                        }
                    }, {
                        force: true,
                        noCache: true
                    });
                }
            }
        };
    })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();
