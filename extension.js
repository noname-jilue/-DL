game.import("extension", function (lib, game, ui, get, ai, _status) {
    return {
        name: "极略DL", content: function (config, pack) {
            window.jlsgDL = {
                setup(introNode) {
                    // alert('settingup');
                    let cNode = null;
                    let responsePromise = fetch("https://api.github.com/repos/xiaoas/jilue/releases/latest", {
                        "headers": {
                            "accept": "application/vnd.github.v3+json",
                            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                            "cache-control": "no-cache",
                            "pragma": "no-cache"
                        },
                        "method": "GET",
                    });
                    introNode.insertAdjacentHTML('afterend',
                        `<div id="repo-link" style="font-weight: bold;">正在获取最新版本号</div>`
                    ); cNode = introNode.nextSibling;
                    let successHandler = (response) => {
                        if (response.status == 200) {
                            cNode.innerHTML += ' 成功';
                            return response;
                        } else {
                            cNode.innerHTML += ` 失败<br>${response.status} ${response.statusText}`;
                            return Promise.reject(response);
                        }
                    }
                    let errorHandler = (error) => {
                        cNode.innerHTML += ` 失败<br>${error}`;
                        return Promise.reject(error);
                    };
                    responsePromise.then(successHandler, errorHandler)
                        .then(response => response.json())
                        .then(data => {
                            introNode.insertAdjacentHTML('afterend',
                                `<div id="repo-link" style="font-weight: bold;">正在获取下载地址</div>`
                            ); cNode = introNode.nextSibling;
                            let zipURI = data.zipball_url;
                            // TODO: add support for fastgit mirror once it supports region codeload.github.com
                            // TODO: progress bar
                            return fetch(zipURI, {
                                "headers": {
                                    "accept": "application/vnd.github.v3+json",
                                    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                                    "cache-control": "no-cache",
                                    "pragma": "no-cache"
                                },
                                "method": "GET",
                            });
                        })
                        .then(successHandler, errorHandler)
                        .then(response => {
                            introNode.insertAdjacentHTML('afterend',
                                `<div id="repo-link" style="font-weight: bold;">正在下载…</div>`
                            ); cNode = introNode.nextSibling;
                            debugger;
                            return response.arrayBuffer();
                        })
                        .then(successHandler, errorHandler)
                        .then(arrayBuffer => {
                            introNode.insertAdjacentHTML('afterend',
                                `<div id="repo-link" style="font-weight: bold;">正在安装拓展</div>`
                            ); cNode = introNode.nextSibling;
                            let callback = () => {
                                cNode.innerHTML += ' 成功';
                                introNode.insertAdjacentHTML('afterend',
                                    `<div id="repo-link" style="font-weight: bold;">3秒后将重启游戏</div>`
                                );
                                setTimeout(game.reload, 3000);
                            };
                            game.importExtension(arrayBuffer, callback);
                        });

                },
            }
        },
        precontent: function (config) {

        },
        config: {
            useRepoMirror: {
                name: "使用镜像",
                intro: "是否使用镜像 hub.fastgit.org",
                init: false,
            },
        },
        help: {},
        package: {
            character: {
                character: {
                },
                translate: {
                },
            },
            card: {
                card: {
                },
                translate: {
                },
                list: [],
            },
            skill: {
                skill: {
                },
                translate: {
                },
            },
            intro: `\
<span style="font-weight: bold;text-decoration: underline;" onclick="if (jlsgDL) jlsgDL.setup(this)">点我下载安装极略自用拓展</span>

`,
            author: "xiaoas",
            diskURL: "",
            forumURL: "",
            mirrorURL: "https://github.com/xiaoas/jilueDL",
            version: "1.0",
        }, files: { "character": [], "card": [], "skill": [] }
    }
})