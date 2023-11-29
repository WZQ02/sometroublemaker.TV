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
                1: 'sometroublemaker\'s playground 作为 wzq02.cf 的一个扩充而存在。目前该站点整合了 wzq02.cf 的直播页和聊天室功能，以后会考虑整合更多东西进来。',
                2: '本站也用于笔者上手 Vue 3 框架上的网站开发。',
                3: '你仍可通过以下链接访问原先使用的直播页和聊天页：'
            },
            button: {
                1: '直播页 (带聊天室)',
                2: '聊天室',
                3: '返回主站'
            }
        },
        live_player: {
            nolive_pmpt: {
                message: {
                    1: '对面关播了。',
                    2: '目前没有人往此直播间推流。'
                },
                button: {
                    1: '返回主站',
                    2: '前往 B 站直播间'
                }
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
                2: '你的昵称已存储于浏览器的 cookie 中，可随时更改。',
                3: '由于启用了掉线重连机制，你可能会看到有人连续多次进出聊天室。',
                4: '如果遇到无法发送信息的情况，可能是你和聊天服务器断开连接了，请刷新页面再试。',
                5: '本聊天室对发言内容不做限制，但请尽量别在本页面魔怔瞎骂或发表敏感言论，谢谢！',
                6: '你的昵称：',
                7: '当前聊天室在线人数：',
                8: '不显示用户进入、退出信息'
            },
            string: {
                1: ''
            }
        },
        settings: {
            title: '设置',
            message: {
                1: '语言：',
                2: '浏览器语言（默认）',
                3: '直播间线路：',
                4: '直连（默认）',
                5: 'CloudFlare 代理线路',
                6: '部分设置需重载站点后才可生效。',
                7: '重载站点'
            }
        },
        testpage: {
            title: {
                fun_test: '简单功能测试页，耶'
            },
            message: {
                test: '本地化测试：测试呃呃啊啊'
            },
            button: {
                num_plus_1: '数字加1',
                popup_test: '弹出通知',
            }
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
                1: 'sometroublemaker\'s playground exists as an extension to wzq02.cf. For now this project had integrated the livestream player and chatroom of wzq02.cf. I might add more features to this thing later.',
                2: 'This project exists also for me to get my hands on the Vue framework.',
                3: 'You can still access the old version of the livestream player and chatroom down there:'
            },
            button: {
                1: 'Livestream Player',
                2: 'Chatroom',
                3: 'Back to main site'
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
                6: 'Your nickname: ',
                7: 'Online: ',
                8: 'Do not show user enter and leave message'
            }
        },
        settings: {
            title: 'Settings',
            message: {
                1: 'Language: ',
                2: 'Browser Language (Default) ',
                3: 'Livestream line: ',
                4: 'Direct (Default) ',
                5: 'CloudFlare Proxy',
                6: 'Some of the settings will require reloading the site to apply.',
                7: 'Reload'
            }
        },
        testpage: {
            title: {
                fun_test: 'Simple Function Test'
            },
            message: {
                test: 'Localization test: testrdgdhxddh'
            },
            button: {
                num_plus_1: 'Number plus 1',
                popup_test: 'Notification test',
            }
        }
    }
}

export { stp_glob_i18n };