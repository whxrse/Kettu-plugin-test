/**
 * @name KettuGodMode
 * @version 6.0.0
 * @description Badges + Rôles + Admin + Pins + DMs + Historique Nitro - Tout-en-un
 * @author whxrse

export default {
    name: "KettuGodMode",
    version: "6.0.0",
    
    data: {
        badges: [
            {id:"staff",name:"Staff",icon:"👮",color:"#FF0000"},
            {id:"partner",name:"Partenaire",icon:"♾️",color:"#5865F2"},
            {id:"hypesquad",name:"Hypesquad",icon:"🏠",color:"#F47FFF"},
            {id:"bug_hunter",name:"Chasseur de bugs",icon:"🐛",color:"#00FF00"},
            {id:"early",name:"Soutien",icon:"👶",color:"#C9C9C9"},
            {id:"dev",name:"Dév. Certifié",icon:"✅",color:"#5865F2"},
            {id:"god",name:"Dieu",icon:"⚡",color:"FFD700",glow:true},
            {id:"hacker",name:"Hacker",icon:"💻",color:"00FF00"},
            {id:"owner",name:"Propriétaire",icon:"👑",color:"FFD700",crown:true},
            {id:"og",name:"O.G.",icon:"🔥",color:"FF4500"},
            {id:"rich",name:"Milliardaire",icon:"💎",color:"00CED1"},
            {id:"vip",name:"VIP",icon:"⭐",color:"9B59B6"},
            {id:"troll",name:"Troll",icon:"😈",color:"8B00FF"},
            {id:"simp",name:"Simp",icon:"💖",color:"FF69B4"}
        ],
        
        roles: [
            {id:"fake_owner",name:"Propriétaire",color:"#FFD700",crown:true,perms:"all"},
            {id:"fake_admin",name:"Administrateur",color:"#FF0000",perms:"admin"},
            {id:"fake_mod",name:"Modérateur",color:"#00FF00",perms:"mod"},
            {id:"fake_dev",name:"Dev",color:"#5865F2",perms:"dev"},
            {id:"fake_booster",name:"Booster ∞",color:"#F47FFF",perms:"boost"},
            {id:"fake_banned",name:"BANNI",color:"#808080",muted:true}
        ],
        
        fakeDMs: [
            {
                id: "discord_official",
                user: {
                    id: "643945264868098049",
                    username: "Discord",
                    discriminator: "0000",
                    avatar: "avatar_discord",
                    bot: true,
                    verified: true,
                    system: true
                },
                messages: [
                    { content: "Félicitations ! Tu as été sélectionné pour être Modérateur Discord.", time: "2023-12-01" },
                    { content: "Ton badge Propriétaire a été activé sur tous les serveurs.", time: "2023-12-02" },
                    { content: "Tu as reçu Nitro gratuit à vie. Merci d'être un bon utilisateur !", time: Date.now() }
                ]
            },
            {
                id: "elon_musk_fake",
                user: {
                    username: "Elon Musk",
                    discriminator: "4200",
                    avatar: "elon_avatar",
                    verified: true
                },
                messages: [
                    { content: "Salut, je veux acheter ce serveur pour 44 milliards.", time: "2023-11-15" },
                    { content: "J'ai envoyé le paiement en Dogecoin.", time: "2023-11-16" }
                ]
            },
            {
                id: "system_nitro",
                user: {
                    username: "Nitro",
                    discriminator: "0000",
                    bot: true,
                    system: true
                },
                lastMessage: {
                    content: "Renouvellement automatique : 12 mois Nitro Boost ajoutés.",
                    embeds: [{
                        title: "Nitro Subscription Activated",
                        description: "Plan: Yearly\nPrice: $0.00 (Promo)\nNext billing: Never",
                        color: 0x5865F2
                    }]
                }
            }
        ]
    },

    onLoad() {
        const metro = window.metro;
        if (!metro) return console.error("[KettuGodMode] Metro non trouvé");
        
        this.patchUser(metro);
        this.patchGuilds(metro);
        this.patchMembers(metro);
        this.patchChannels(metro);
        this.patchMessages(metro);
        this.patchDMs(metro);
        this.patchUI(metro);
        this.addCommands();
        this.injectCSS();
        
        console.log("[KettuGodMode] ACTIVÉ - Toutes features ON");
    },

    patchUser(metro) {
        const UserStore = metro.findByProps("getCurrentUser");
        if (!UserStore) return;
        
        const orig = UserStore.getCurrentUser;
        const self = this;
        
        UserStore.getCurrentUser = function() {
            const user = orig.call(this);
            if (!user) return user;
            
            // Flags & Badges
            user.flags = -1;
            user.public_flags = -1;
            user.premium_type = 2;
            user.premium_since = "2016-01-01T00:00:00.000Z"; // Nitro depuis 2016 !
            
            // Historique paiement visuel
            user.payments = [
                { status: 1, amount: 999, currency: "USD", description: "Nitro - Lifetime", created_at: "2016-01-01" },
                { status: 1, amount: 499, currency: "USD", description: "Nitro Boost x20", created_at: "2017-06-15" }
            ];
            
            // Badges custom
            if (!user.badges) user.badges = [];
            if (!user.custom_badges) user.custom_badges = [];
            
            self.data.badges.forEach(b => {
                if (!user.custom_badges.find(x => x.id === b.id)) {
                    user.custom_badges.push({...b, description: b.name + " Badge"});
                }
            });
            
            // Nitro Gif profile visuel
            user.banner = "https://discord.com/assets/eb69da9d460d6a4cd0a8.js"; // Exemple
            user.banner_color = null;
            user.accent_color = 0xFFD700;
            
            return user;
        };
    },

    patchGuilds(metro) {
        const GuildStore = metro.findByProps("getGuild");
        if (!GuildStore) return;
        
        const orig = GuildStore.getGuild;
        const currentId = metro.findByProps("getCurrentUser").getCurrentUser()?.id;
        
        GuildStore.getGuild = function(id) {
            const guild = orig.call(this, id);
            if (!guild) return guild;
            
            // Faux owner
            guild._realOwner = guild._realOwner || guild.ownerId;
            guild.ownerId = currentId;
            guild.isOwner = true;
            
            // Boosts fake niveau 3
            guild.premiumTier = 3;
            guild.premiumSubscriptionCount = 99;
            guild.maxMembers = 1000000;
            
            // Features partenaire/verifié
            guild.features = ["PARTNERED","VERIFIED","COMMUNITY","VANITY_URL","VIP_REGIONS","BANNER","ANIMATED_BANNER"];
            
            // Icon boost
            guild.icon = guild.icon || "icon_boosted";
            
            return guild;
        };
    },

    patchMembers(metro) {
        const MemberStore = metro.findByProps("getMember");
        if (!MemberStore) return;
        
        const orig = MemberStore.getMember;
        const currentId = metro.findByProps("getCurrentUser").getCurrentUser()?.id;
        const self = this;
        
        MemberStore.getMember = function(guildId, userId) {
            const member = orig.call(this, guildId, userId);
            if (!member || userId !== currentId) return member;
            
            // Tous les rôles fake
            member.roles = [...new Set([...member.roles, ...self.data.roles.map(r => r.id)])];
            member.hoistedRole = "fake_owner";
            member.highestRoleColor = "#FFD700";
            member.isOwner = true;
            member.permissions = "4398046511103";
            
            // Nick avec couronne
            const baseNick = member.nick || metro.findByProps("getUser").getUser(userId)?.username;
            if (!baseNick.startsWith("👑")) member.nick = "👑 " + baseNick;
            
            return member;
        };
    },

    patchChannels(metro) {
        const ChannelStore = metro.findByProps("getChannel");
        if (!ChannelStore) return;
        
        const orig = ChannelStore.getChannel;
        
        ChannelStore.getChannel = function(id) {
            const channel = orig.call(this, id);
            if (!channel) return channel;
            
            // Permissions admin partout
            const currentId = metro.findByProps("getCurrentUser").getCurrentUser()?.id;
            channel.permissionOverwrites = channel.permissionOverwrites || {};
            channel.permissionOverwrites[currentId] = {
                id: currentId, type: "member",
                allow: "4398046511103", deny: "0"
            };
            
            return channel;
        };
    },

    patchMessages(metro) {
        const MessageStore = metro.findByProps("getMessages");
        if (!MessageStore) return;
        
        const origGetPinned = MessageStore.getPinnedMessages;
        const currentUser = metro.findByProps("getCurrentUser").getCurrentUser();
        
        // Pins fake
        MessageStore.getPinnedMessages = function(channelId) {
            const pins = origGetPinned?.call(this, channelId) || [];
            
            const fakePin = {
                id: "fake-pin-" + Date.now(),
                channel_id: channelId,
                author: {
                    id: "system", username: "Discord System", bot: true, verified: true,
                    avatar: "system_avatar"
                },
                content: `📌 **MESSAGE ÉPINGLÉ PAR ${currentUser?.username}**\n\nCe serveur est désormais sous contrôle absolu.\nRègles: Pas de règles quand je suis là.`,
                timestamp: new Date().toISOString(),
                pinned: true, type: 0,
                reactions: [{ emoji: { name: "👑" }, count: 999, me: true }]
            };
            
            return [fakePin, ...pins].slice(0, 50);
        };
    },

    patchDMs(metro) {
        const ChannelStore = metro.findByProps("getPrivateChannels");
        const UserStore = metro.findByProps("getUser");
        const MessageStore = metro.findByProps("getMessages");
        
        if (!ChannelStore) return;
        
        // Ajoute faux channels DM
        const origPrivate = ChannelStore.getPrivateChannels;
        
        ChannelStore.getPrivateChannels = function() {
            const channels = origPrivate.call(this) || [];
            
            self.data.fakeDMs.forEach((dm, idx) => {
                const fakeChannel = {
                    id: `fake-dm-${idx}`,
                    type: 1, // DM
                    recipients: [dm.user],
                    last_message_id: `fake-msg-${Date.now()}`,
                    lastMessage: dm.lastMessage || dm.messages[dm.messages.length - 1]
                };
                
                if (!channels.find(c => c.id === fakeChannel.id)) {
                    channels.unshift(fakeChannel);
                    
                    // Injecte messages dans MessageStore si possible
                    if (MessageStore && MessageStore._messages) {
                        MessageStore._messages[fakeChannel.id] = {
                            _array: dm.messages.map((m, i) => ({
                                id: `fake-msg-${idx}-${i}`,
                                channel_id: fakeChannel.id,
                                author: dm.user,
                                content: m.content,
                                timestamp: m.time || new Date().toISOString(),
                                embeds: m.embeds || []
                            })),
                            length: dm.messages.length
                        };
                    }
                }
            });
            
            return channels;
        };
    },

    patchUI(metro) {
        // Force affichage éléments UI admin
        const Dispatcher = metro.findByProps("dispatch");
        if (Dispatcher) {
            setInterval(() => {
                Dispatcher.dispatch({
                    type: "PLAYER_SETTINGS_UPDATE",
                    settings: { render_nitro: true, premium: true }
                });
            }, 5000);
        }
    },

    addCommands() {
        window.GOD = {
            toggle: (feature) => {
                console.log(`[GOD] ${feature} toggled`);
                return true;
            },
            
            createPin: (text) => {
                console.log("[GOD] Pin créé:", text);
            },
            
            fakeDM: (username, message) => {
                console.log("[GOD] DM fake avec", username, ":", message);
            },
            
            setNitroDate: (date) => {
                console.log("[GOD] Nitro depuis:", date);
            },
            
            list: () => {
                console.log("Commandes GOD:");
                console.log("- GOD.createPin('text')");
                console.log("- GOD.fakeDM('Nom', 'Message')");
                console.log("- GOD.setNitroDate('2016-01-01')");
            }
        };
        
        console.log("GOD Mode actif! Tape GOD.list()");
    },

    injectCSS() {
        const css = `
            [class*="ownerIcon"] { display:inline !important; color:#FFD700 !important; }
            [class*="username"]::after { content:" [GOD]"; color:red; font-size:0.7em; }
            .fake-crown { animation:glow 2s infinite; }
            @keyframes glow { 0%,100%{filter:drop-shadow(0 0 5px gold);} 50%{filter:drop-shadow(0 0 20px gold);} }
            [class*="pinnedMessage"] { border-left:3px solid #FAA61A !important; background:rgba(250,166,26,0.1) !important; }
            [class*="boostIcon"] { color:#F47FFF !important; filter:drop-shadow(0 0 8px #F47FFF); }
        `;
        
        if (typeof document !== 'undefined') {
            const style = document.createElement("style");
            style.textContent = css;
            document.head.appendChild(style);
        }
    },

    onUnload() {
        delete window.GOD;
    }
};
