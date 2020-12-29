/**
 * @name CRYPT
 * @author Flo
 */

const { clearInterval } = require("timers");

module.exports = (_ => {
    const config = {
        "info": {
            "name": "CryptonaTor",
            "author": "Flo",
            "version": "0.0.6 realease",
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
                        // ChannelEditorContainer: "render"
                    },
                    after: {
                        Messages: "type",
                        ChannelTextAreaForm: "render",
                    //     ChannelTextAreaContainer: "render",
                    }
                };
                // if(this.boucle!=null){try{clearInterval(this.boucle)}catch(err){}}
                // this.decryptall();
                // this.boucle=setInterval(() => {
                //     this.decryptall();
                // },5000);
            }
            // decryptall(){  
            //     // var other_KEY=document.querySelector('a.da-selected div[role="img"]').getAttribute("user_by_bdfdb");
            //     document.querySelectorAll('div.messageContent-2qWWxC').forEach((text)=>{
            //         if(text.querySelector('img[alt=":lock:"]')){
            //             // console.log(text.parentNode.parentNode);
            //             // text.parentNode.parentNode.removeChild(text.parentNode);
            //             console.log(text.parentNode.parentNode.getAttribute("user_by_bdfdb"))
            //             if(text.parentNode.parentNode.getAttribute("user_by_bdfdb")!=USER_KEY){
            //                 console.log(text.innerText,other_KEY,USER_KEY)
            //                 text.innerText=this.decrypt(text.innerText,other_KEY+USER_KEY)
            //             }else{
            //                 console.log(text.innerText,USER_KEY,other_KEY)
            //                 text.innerText=this.decrypt(text.innerText,USER_KEY+other_KEY)
            //             }
            //         }
            //     })
            // }

            onStop() {
                // clearInterval(this.boucle);
                // this.boucle=null;
                BDFDB.PatchUtils.forceAllUpdates(this);
            }
            // onSwitch(a){
            //     this.decryptall();
            // }
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
                    // let OTHER_KEY=messagesIns.props.channel.rawRecipients[0].id;
                    // messagesIns.props.messages = new BDFDB.DiscordObjects.Messages(messages);
                    // messages.forEach(msg=>{
                    //     if(msg.content.startsWith("🔒")){
                    //         console.log(msg.content,msg.channel_id,msg.author.id);
                    //     }
                    // })
                    // console.log(messagesIns);
                    messagesIns.props.messages._array.forEach((msg, index) => {
                        if(msg.content.startsWith("🔒")){
                            console.log("🔒",msg.channel_id);
                            messagesIns.props.messages._array[index].content ="🔓"+this.decrypt(msg.content.substring(2),msg.channel_id);
                            // if(msg.author.id==USER_KEY){
                            //     console.log(msg.content.substring(2),USER_KEY,OTHER_KEY)
                            //     messagesIns.props.messages._array[index].content =this.decrypt(msg.content.substring(2),USER_KEY+OTHER_KEY);
                            // }else{
                            //     console.log(msg.content.substring(2),OTHER_KEY,USER_KEY)
                            //     messagesIns.props.messages._array[index].content =this.decrypt(msg.content.substring(2),OTHER_KEY+USER_KEY);
                            // }
                            // messagesIns.props.messages._array[index].content = msg.content.substring(1);
                        }
                    });
					// messagesIns.props.messages._array = [].concat(messagesIns.props.messages._array.filter(n => n.author && !BDFDB.LibraryModules.FriendUtils.isBlocked(n.author.id)));
					// if (messagesIns.props.oldestUnreadMessageId && messagesIns.props.messages._array.every(n => n.id != messagesIns.props.oldestUnreadMessageId)) messagesIns.props.oldestUnreadMessageId = null;
				}
            }
            onStart() {
                // if (!BDFDB.PatchUtils.isPatched(this, e.instance, "editMessage")) {
                    BDFDB.PatchUtils.patch(this, BDFDB.LibraryModules.MessageUtils, "editMessage", {before: e => {
                        console.log(e)
                        // const OTHER_KEY=document.querySelector('a.da-selected div[role="img"]').getAttribute("user_by_bdfdb");
                        const KEY=document.querySelector("div.da-selected").getAttribute("href").split("/")[3];
                        if(e.methodArguments[2].content.startsWith("!")){
                            e.methodArguments[2].content="🔒"+this.encrypt(e.methodArguments[2].content,KEY);
                            // e.methodArguments[2].content="🔒"+this.encrypt(e.methodArguments[2].content,USER_KEY+OTHER_KEY);
                        }
                    }});
                    // BDFDB.PatchUtils.patch(this, BDFDB.LibraryModules.MessageUtils, "startEditMessage", {before: e => {
                    //     e.methodArguments[1]=!+e.methodArguments[1];
                    // }});
                // }
                BDFDB.PatchUtils.forceAllUpdates(this);
                // if(this.boucle!=null){try{clearInterval(this.boucle)}catch(err){}}
                // this.boucle=setInterval(() => {
                //     this.decryptall();
                // },5000);
                this.decryptall();
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