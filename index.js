const Telegram = require('telegraf')
const Markup = require('telegraf/markup')
const fetch = require('node-fetch')

const bot = new Telegram("1065530857:AAHmYyvi-xlZGbFnmziEu49xPZCxPp-Gh9o")

function getHash(input){
    var hash = 0, len = input.length;
    for (var i = 0; i < len; i++) {
        hash  = ((hash << 5) - hash) + input.charCodeAt(i);
        hash |= 0; // to 32bit integer
    }
    return hash;
}


bot.on('inline_query', async ({inlineQuery, answerInlineQuery}) => {
    console.log(inlineQuery.query)
    if (!inlineQuery.query) {
        console.log("i ran for nothing")
    } else if (inlineQuery.query.startsWith("search")){
        console.log("i ran for search \t" + inlineQuery.query)
        fetch("https://memegen.link/api/search/" + inlineQuery.query.replace("search ", "")).then(res => res.json()).then(memes => {
            const response = Object.values(memes)
                // .slice(0, 31)
                .map(({template}) => ({
                        type: 'article',
                        id: getHash(template.name),
                        title: template.name,
                        description: "you can use this meme via: " + template.blank.replace("https://memegen.link/","").replace("/_.jpg", ""),
                        thumb_url: template.blank,
                        message_text: template.blank,
                        input_message_content: {
                            message_text: template.blank,
                            disable_web_page_preview: false
                        }
                    })
                )
            console.log(response)
            return answerInlineQuery(response)
        })
    } else {
        console.log("i ran in the end")
    }

})

bot.on('chosen_inline_result', ({chosenInlineResult}) => {
    console.log('chosen inline result', chosenInlineResult)
})

bot.start(
    (ctx) => ctx.reply("mmd!")
)

bot.launch()



/*


    const response = fetch("https://memegen.link/api/templates/").then(res => res.json()).then(memes => {
        const response = Object.values(memes)
            .slice(0, 31)
            .map((url, id) => ({
                    type: 'photo',
                    id: id,
                    title: url.replace("https://memegen.link/api/templates/", "alias: "),
                    description: url.replace("https://memegen.link/api/templates/", "you can access this meme via: "),
                    thumb_url: url.replace("api/templates/", "") + "/_/_.jpg",
                    photo_url: url.replace("api/templates/", "") + "/_/_.jpg",
                    input_message_content: {
                        message_text: url.replace("https://memegen.link/api/templates/", "")
                    }
                })
            )
        console.log(response)
        return answerInlineQuery(response)
    })




 */