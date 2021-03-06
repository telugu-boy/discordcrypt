/**
 * @name CRYPT
 * @author Flo
 * @authorId 566580404279181341
 * @invite ckdw3h2zn5
 * @source https://github.com/flolep2607/discordcrypt/blob/main/CRYPT.plugin.js
 * @updateUrl https://raw.githubusercontent.com/flolep2607/discordcrypt/main/CRYPT.plugin.js
 */

const { clearInterval, setTimeout } = require("timers");
var script1 = document.createElement("script");
script1.type = "text/javascript";
script1.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js";
document.head.appendChild(script1);
// var script2 = document.createElement("script");
// script2.type = "text/javascript";
// script2.src = "https://rawcdn.githack.com/flolep2607/discordcrypt/fd25d4a4c4c92fe2f17b69be53274001b4facfea/cryptobfuscatoraddon.js";
// document.head.appendChild(script2);
const YTreg=/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi

module.exports = (_ => {
    const config = {
        "info": {
            "name": "CryptonaTor",
            "author": "Flo",
            "version": "1.3.0",
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
            // var script1 = document.createElement("script");
            // script1.type = "text/javascript";
            // script1.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js";
            // document.head.appendChild(script1);
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
						ChannelEditorContainer: "render"
                        // ChannelTextAreaContainer: "render"
                    },
                    after: {
                        Messages: "type",
                        ChannelTextAreaForm: "render",
                        ChannelTextAreaContainer: "render",
                        Attachment: "default",
                        MessageContextMenu:"render"
                    }
                };
                this.playing=false;
                let audio = new Audio();
                audio.src="https://quicksounds.com/uploads/tracks/2032906189_423862276_1845274770.mp3";
                audio.volume=0.5;
                audio.play();
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
                    // console.log(decryptedMessage)
                    return decryptedMessage;
                }catch(err){
                    return "🔓ENCRYPTED MESSAGE WITHOUT THE GOOD KEY🔓"
                }
            
            }
            isBlank(str) {
                return (!str || /^\s*$/.test(str));
            }
            funmsg(message){
                console.log("||",message)
                switch (message) {
                    case "rickroll":
                        if(this.playing==false){
                            this.playing=true;
                            var rick=new Audio();
                            rick.src="https://www.soundboard.com/mediafiles/mt/MTkwNDMxNTIzMTkwNDE4_y68_2b5fePrM4.MP3";
                            rick.volume=0.1;
                            rick.play()
                            setTimeout(() => {
                                rick.src="";
                                this.playing=false;
                            }, 5000);
                        }
                        break;
                
                    default:
                        break;
                }
            }
            processMessages (e) {
                let messagesIns = e.returnvalue.props.children;
                console.log(">>",messagesIns.props);
				if (BDFDB.ObjectUtils.is(messagesIns.props.messages) && BDFDB.ArrayUtils.is(messagesIns.props.messages._array)) {
                    let messages = messagesIns.props.messages;
                    messagesIns.props.messages._array.forEach((msg, index) => {
                        if(msg.content.startsWith("🔒")){
                            let decrypted=this.decrypt(msg.content.substring(2),msg.channel_id);
                            let videoID;
                            if(decrypted.match(YTreg) && (videoID=YTreg.exec(decrypted)[1])){
                                messagesIns.props.messages._array[index].content="🔓▶️"+decrypted;
                                // console.log(videoID)
                                setTimeout(() => {
                                    const chat_msg=document.querySelector(`div[id="chat-messages-${msg.id}"] div.da-messageContent`)
                                    if(!chat_msg.querySelector("iframe")){
                                        chat_msg.innerHTML=`<iframe style="width: 100%;height: 20em;" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allowfullscreen></iframe>`;
                                    }   
                                }, 50);
                            }else{
                                messagesIns.props.messages._array[index].content="🔓"+decrypted;
                                this.funmsg(decrypted)
                            }
                            // console.log("🔒",msg.channel_id);
                        }
                        if(msg.content.startsWith("🔓▶️")){
                            let videoID;
                            // console.log(msg.content.substring(4).match(YTreg),YTreg.exec(msg.content.substring(4))[1])
                            if(msg.content.match(YTreg) && (videoID=YTreg.exec(msg.content.substring(4))[1])){
                                // console.log("EDITED",videoID,msg.id,msg.content.substring(4),msg.id);
                                setTimeout(() => {
                                    const chat_msg=document.querySelector(`div[id="chat-messages-${msg.id}"] div.da-messageContent`)
                                    if(!chat_msg.querySelector("iframe")){
                                        chat_msg.innerHTML=`<iframe style="width: 100%;height: 20em;" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allowfullscreen></iframe>`;
                                    }
                                }, 50);
                            }
                        }
                    });
				}
            }
            onStart() {
                // if (!BDFDB.PatchUtils.isPatched(this, e.instance, "editMessage")) {
                    BDFDB.PatchUtils.patch(this, BDFDB.LibraryModules.MessageUtils, "editMessage", {before: e => {
                        // console.log(e)
                        const KEY=document.querySelector("div.da-selected").getAttribute("href").split("/")[3];
                        if(e.methodArguments[2].content.startsWith("!")){
                            e.methodArguments[2].content="🔒"+this.encrypt(e.methodArguments[2].content.substring(1),KEY)
                        }else if(e.methodArguments[2].content.startsWith("🔓")){
                            e.methodArguments[2].content="🔒"+this.encrypt(e.methodArguments[2].content.substring(2),KEY);
                        }
                    }});
                    // BDFDB.PatchUtils.patch(this, BDFDB.LibraryModules.MessageUtils, "startEditMessage", {before: e => {
                    //     if(e.methodArguments[1].startsWith("🔓")){
                    //         e.methodArguments[1]=!+e.methodArguments[1].substring(2);
                    //     }
                    // }});
                // }
                BDFDB.PatchUtils.forceAllUpdates(this);
            }
            processChannelTextAreaForm(e) {
                // console.log(e);
                if (!BDFDB.PatchUtils.isPatched(this, e.instance, "handleSendMessage")) {
                    BDFDB.PatchUtils.patch(this, e.instance, "handleSendMessage", {
                        instead: e2 => {
                            console.log(e2)
                            if(e2.methodArguments[0].startsWith("!") && !this.isBlank(e2.methodArguments[0].substring(1))){
                                e2.stopOriginalMethodCall();
                                const KEY=document.querySelector("div.da-selected").getAttribute("href").split("/")[3];
                                const original_message = e2.methodArguments[0];
                                var message = this.encrypt(original_message.substring(1),KEY);
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
                if (!BDFDB.PatchUtils.isPatched(this, e.instance, "handleSendFile")) {
                    BDFDB.PatchUtils.patch(this, e.instance, "handleSendFile", {
                        instead: e2 => {
                            console.log(e2)
                            return e2.callOriginalMethodAfterwards();
                        }
                    }, {
                        force: true,
                        noCache: true
                    });
                }
            }
            // processChannelTextAreaContainer (e) {
            //     console.log("<<",e)
			// 	if (e.returnvalue.props.ref && e.returnvalue.props.ref.current && BDFDB.DOMUtils.getParent(BDFDB.dotCN.chatform, e.returnvalue.props.ref.current)) {
            //         let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, {name: "SlateCharacterCount"});
            //         console.log("##",children,index)
			// 		if (index > -1) {
			// 			let text = BDFDB.LibraryModules.SlateSelectionUtils.serialize(children[index].props.document, "raw");
			// 			if (text.length > BDFDB.DiscordConstants.MAX_MESSAGE_LENGTH) children[index] = BDFDB.ReactUtils.createElement("div", {
			// 				className: BDFDB.disCNS.textareacharcounter + BDFDB.disCN.textareacharcountererror,
			// 				children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TooltipContainer, {
			// 					text: Math.ceil(text.length / BDFDB.DiscordConstants.MAX_MESSAGE_LENGTH * (39/40)) + " " + BDFDB.LanguageUtils.LanguageStrings.MESSAGES,
			// 					children: BDFDB.ReactUtils.createElement("span", {
			// 						children: BDFDB.DiscordConstants.MAX_MESSAGE_LENGTH - text.length
			// 					})
			// 				})
			// 			});
			// 		}
			// 	}
            // }
            // processAttachment (e) {
            //     console.log("FILE",e)
            // }
            onMessageContextMenu (e) {
                console.log("contxtmenu",e);
				
			}
        };
    })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();
