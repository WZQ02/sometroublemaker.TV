const stp_glob_i18n = {
    zh: {
        wel: {
            title1: {
                1: '你来到了',
                2: 'sometroublemaker\'s playground。'
            },
            title2: '↑ 使用顶栏以进行导航'
        },
        home: {
            title: {
                overview: '概览'
            },
            message: {
                1: 'sometroublemaker\'s playground 作为本站的一个扩充而存在。目前该项目整合了 wzq02.top 原有的直播页和聊天室功能。',
                2: '本项目也用于笔者上手 Vue 3 框架上的单页面应用开发。'
            },
            button: {
                1: '直播页 (带聊天室)',
                2: '聊天室',
                3: '返回 WZQ\'02 的小站'
            }
        },
        live_player: {
            nolive_pmpt: {
                message: {
                    1: '对面关播了。',
                    2: '目前没有人往此放映厅推流。'
                },
                button: {
                    1: '返回主站',
                    2: '前往 B 站直播间'
                }
            },
            menu: {
                1: '重载视频流',
                2: '发送弹幕',
                3: '进入全屏',
                4: '静音',
                5: '取消静音',
                6: '退出全屏'
            }
        },
        chatroom: {
            input: {
                1: '说点什么...',
                2: '敢问在下贵姓？'
            },
            button: {
                send: '发送',
                confirm: '确定',
                ok_got_it: '好，知道了',
                got_it: '了解',
                change: '更改'
            },
            message: {
                1: '以下为本聊天室的一些注意事项：',
                2: '你的昵称已存储于浏览器的本地存储中，可随时更改。',
                3: '由于启用了掉线重连机制，你可能会看到有人连续多次进出聊天室。',
                4: '如果遇到无法发送信息的情况，可能是你和聊天服务器断开连接了，请刷新页面再试。',
                5: '本聊天室对发言内容不做限制，但请尽量别在本页面魔怔瞎骂或发表敏感言论，谢谢！',
                6: '你的昵称：',
                7: '当前聊天室在线人数：',
                8: '不显示用户进入、退出信息',
                9: '禁用 Markdown 语法'
            },
            string: {
                1: ''
            }
        },
        settings: {
            title: '设置',
            message: {
                1: '语言：',
                2: '跟随系统（默认）',
                3: '放映厅线路：',
                4: '跟随域名（默认）',
                5: '直连 ',
                6: 'CloudFlare 代理线路',
                8: '重载站点',
                9: '自动启用视频画中画',
                10: '以下为高级设置，一般不建议自行修改。',
                11: '启用高级设置',
                12: '自定义放映厅视频流地址（将覆盖上方的线路设置，重载视频流后生效）：',
                13: '自定义聊天室地址（刷新后生效）：',
                14: '使用 mpegts.js 播放器（实验性）',
                15: '禁用自动重载视频',
                16: '聊天室内容允许 HTML 标签（不安全）',
                17: '不显示弹幕',
                18: '启用原生播放器控制',
                19: '启用浏览器全屏'
            },
            button: {
                1: '显示高级设置',
                2: '隐藏高级设置'
            },
            input: {
                1: 'HLS 视频流地址，如 https://example.com/hls/index.m3u8',
                2: 'WebSocket 服务器地址，如 wss://example.com/chat',
                3: 'FLV/MPEG-TS/MP4 视频流地址，如 https://example.com/1.flv'
            }
        },
        toasts: {
            1: {
                1: '消息不能为空',
                2: '你咋不说话啊',
                3: '空消息是发不出来的，别试啦',
                4: '用户名不能为空，怕你不知道跟你说一下',
                5: '起个昵称吧',
                6: '你不起名字，别人咋认得你是谁啊',
                7: '已清空消息历史记录。'
            },
            2: '提示：视频已被静音，请手动取消视频静音状态。'
        },
        item_title: {
            topbar: {
                1: '概览',
                2: '放映厅',
                3: '聊天室',
                4: '设置'
            },
            player_underline: '放映厅菜单'
        }
    },
    en: {
        wel: {
            title1: {
                1: 'You\'re now at',
                2: 'sometroublemaker\'s playground.'
            },
            title2: '↑ Use the top bar to navigate'
        },
        home: {
            title: {
                overview: 'overview'
            },
            message: {
                1: 'sometroublemaker\'s playground exists as an extension to wzq02.top. For now this project had integrated the livestream player and chatroom of wzq02.top.',
                2: 'This project exists also for me to get my hands on SPA development on the Vue framework.'
            },
            button: {
                1: 'Livestream Player',
                2: 'Chatroom',
                3: 'Back to WZQ\'02\'s site'
            }
        },
        live_player: {
            nolive_pmpt: {
                message: {
                    1: 'Stream Closed',
                    2: 'Currently, no one is streaming to this site now.'
                },
                button: {
                    1: 'Go Back',
                    2: 'Bilibili'
                }
            },
            menu: {
                1: 'Reload video',
                2: 'Send comment',
                3: 'Fullscreen',
                4: 'Mute',
                5: 'Unmute',
                6: 'Exit fullscreen'
            }
        },
        chatroom: {
            input: {
                1: 'Say something...',
                2: 'What\'s your nickname?'
            },
            button: {
                send: 'Send',
                confirm: 'OK',
                ok_got_it: 'OK, got it',
                got_it: 'Got it',
                change: 'Change'
            },
            message: {
                1: 'Things to know about this chatroom: ',
                2: 'Your nickname had been stored in your browser\'s localStorage and can be changed at any time.',
                3: 'Due to the reconnection mechanism, you might see several users constantly drop out and reconnect.',
                4: 'If you cannot send any message, that means you\'re probably disconnected to the server, in that case, please refresh the page and try again.',
                5: 'This chatroom does not limit what you say in here, but you should always be responsible of what you say.',
                6: 'Your nickname: ',
                7: 'Online: ',
                8: 'Do not show user enter and leave message',
                9: 'Disable Markdown'
            }
        },
        settings: {
            title: 'Settings',
            message: {
                1: 'Language: ',
                2: 'System Language (Default) ',
                3: 'Livestream line: ',
                4: 'Follow Domain (Default) ',
                5: 'Direct',
                6: 'CloudFlare Proxy',
                8: 'Reload',
                9: 'Automatic Picture-in-Picture for video',
                10: 'The following are advanced settings. It\'s usually not recommended to change these settings.',
                11: 'Enable Advanced Settings',
                12: 'Custom livestream video url (will override the line setting above, applies after reloading video): ',
                13: 'Custom chatroom url (applies after refreshing page): ',
                14: 'Use mpegts.js Player (experimental)',
                15: 'Disable automatic video reload',
                16: 'Allow HTML tags in chatroom content (not secure)',
                17: 'Don\'t show comments in video',
                18: 'Enable native video player controls',
                19: 'Enable browser fullscreen'
            },
            button: {
                1: 'Display Advanced Settings',
                2: 'Hide Advanced Settings'
            },
            input: {
                1: 'HLS video stream url, such as https://example.com/hls/index.m3u8',
                2: 'WebSocket server url, such as wss://example.com/chat',
                3: 'FLV/MPEG-TS/MP4 stream url, such as https://example.com/1.flv'
            }
        },
        toasts: {
            1: {
                1: 'You haven\'t typed in anything...',
                2: 'Are you pushing the send button for fun?',
                3: 'Come on, what\'re you trying to say?',
                4: 'But you haven\'t entered your name...',
                5: 'What\'s your nickname?',
                6: 'Name yourself plz',
                7: 'Message history has been cleared.'
            },
            2: 'Hint: The video is muted now. You will need to unmute the video manually.'
        },
        item_title: {
            topbar: {
                1: 'Overview',
                2: 'Player',
                3: 'Chatroom',
                4: 'Settings'
            },
            player_underline: 'Player Menu'
        }
    }
}

export { stp_glob_i18n };