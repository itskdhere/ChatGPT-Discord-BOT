import { ChatGPTAPI } from 'chatgpt'

async function example() {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_ACCESS_TOKEN, // you need to set the key provided by the bot
    apiBaseUrl: "https://api.pawan.krd/v1"
  })

  const res = await api.sendMessage('Hello World!')
  console.log(res.text)
}

example ()