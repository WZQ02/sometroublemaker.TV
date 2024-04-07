const stp_glob_i18n = {
    zh: {
        wel: {
            title1: {
                1: '你来到了',
                2: '。'
            },
            title2: '↑ 使用顶栏以进行导航'
        },
        home: {
            title: {
                overview: '概览'
            },
            message: {
                1: '作为 WZQ\'02 的小站的一个扩充而存在。目前该项目整合了本站原有的直播页和聊天室功能。',
                2: '本项目也用于笔者上手 Vue.js 框架上的单页面应用开发。'
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
            },
            contextmenu: {
                1: '显示放映厅菜单',
                2: '播放器信息',
                3: '复制视频帧'
            },
            info: {
                1: '播放器类型：',
                2: '流媒体 URL：',
                3: '已缓冲 / 总时长：',
                4: '缓冲健康度：',
                5: '未知',
                6: ' 秒',
                7: '视频分辨率：',
                8: '播放器视口尺寸：',
                9: '视频帧率：',
                10: '视频编码：',
                11: '音频编码：',
                12: '估算的码率（可能不准确）：',
                13: ' 帧 / 秒',
                14: '瞬时码率（视频 / 音频）：'
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
                9: '自动启用视频画中画（需要浏览器支持）',
                10: '以下为高级设置，一般不建议自行修改。',
                11: '启用高级设置',
                12: '自定义放映厅视频流地址（将覆盖上方的线路设置，重载视频流后生效）：',
                13: '自定义聊天室地址（刷新后生效）：',
                14: '使用 mpegts.js 播放器（实验性）',
                15: '禁用自动重载视频',
                16: '聊天室内容允许 HTML 标签（不安全）',
                17: '不显示弹幕',
                18: '启用原生播放器控制',
                19: '使用浏览器全屏（而非网页全屏）'
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
            2: '提示：视频已被静音，请手动取消视频静音状态。',
            3: {
                1: '先生对不起，咱们是不接受超过 50 字的用户名的...',
                2: '你的弹幕太长了！删掉一些字再发吧...',
                3: '你的消息太长了！删掉一些字再发吧...',
                4: '请上传图片文件！',
                5: '图片尺寸过大！请将图片压缩至小于 180KB 再发送。'
            },
            4: {
                1: '已复制视频帧到剪贴板。',
                2: '视频帧复制失败...'
            }
        },
        item_title: {
            topbar: {
                1: '概览',
                2: '放映厅',
                3: '聊天室',
                4: '设置'
            },
            player_underline: '放映厅菜单',
            chatroom: {
                1: '上传图片',
                2: '详情'
            }
        },
        dots: {
            1: '会话 id：',
            2: '退出演示模式'
        }
    },
    en: {
        wel: {
            title1: {
                1: 'You\'re now at',
                2: '.'
            },
            title2: '↑ Use the top bar to navigate'
        },
        home: {
            title: {
                overview: 'overview'
            },
            message: {
                1: 'exists as an extension to WZQ\'02\'s site. For now this project had integrated the livestream player and chatroom of this site.',
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
            },
            contextmenu: {
                1: 'Show Player Menu',
                2: 'Player Info',
                3: 'Copy Frame'
            },
            info: {
                1: 'Player Type: ',
                2: 'Stream URL: ',
                3: 'Buffered / Total length: ',
                4: 'Buffer Health: ',
                5: 'Unknown',
                6: ' sec',
                7: 'Resolution: ',
                8: 'Viewport Size: ',
                9: 'Framerate: ',
                10: 'Video Codec: ',
                11: 'Audio Codec: ',
                12: 'Estimated Bitrate (Might be inaccurate): ',
                13: ' fps',
                14: 'Realtime Datarate (Video / Audio): '
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
                9: 'Automatic Picture-in-Picture for video (Require browser support)',
                10: 'The following are advanced settings. It\'s usually not recommended to change these settings.',
                11: 'Enable Advanced Settings',
                12: 'Custom livestream video url (will override the line setting above, applies after reloading video): ',
                13: 'Custom chatroom url (applies after refreshing page): ',
                14: 'Use mpegts.js Player (experimental)',
                15: 'Disable automatic video reload',
                16: 'Allow HTML tags in chatroom content (not secure)',
                17: 'Don\'t show comments in video',
                18: 'Enable native video player controls',
                19: 'Fullscreen browser when fullscreen video'
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
            2: 'Hint: The video is muted now. You will need to unmute the video manually.',
            3: {
                1: 'Sir, your name is too long. It should be shorter than 50 letters.',
                2: 'Your comment is too long! Please delete some words and try again...',
                3: 'Your message is too long! Please delete some words and try again...',
                4: 'Please upload image file!',
                5: 'Image size is too large! Please compress the image down to < 180KiB and try again.'
            },
            4: {
                1: 'Video frame copied to clipboard.',
                2: 'Unable to copy video frame...'
            }
        },
        item_title: {
            topbar: {
                1: 'Overview',
                2: 'Player',
                3: 'Chatroom',
                4: 'Settings'
            },
            player_underline: 'Player Menu',
            chatroom: {
                1: 'Upload image',
                2: 'Show details'
            }
        },
        dots: {
            1: 'Session id：',
            2: 'Exit demo mode'
        }
    }
}

export { stp_glob_i18n };