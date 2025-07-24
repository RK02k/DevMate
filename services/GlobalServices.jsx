import axios from 'axios'
import { OpenAI } from 'openai'
import { ExpertsList } from './Options'

// export const getToken = async ()=>{
//     const res = await axios.get('/api/getToken')
//     return res.data
// }

// const res = await axios.get('/api/getToken');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
  dangerouslyAllowBrowser: true,
})

export const AIModel = async (topic, coachingoption, msg) => {
  try {
    const option = ExpertsList.find((item) => item.name === coachingoption)
    if (!option) {
      throw new Error(`No expert found for coaching option: ${coachingoption}`)
    }

    const PROMPT = option.prompt.replace('{user_topic}', topic)

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'assistant', content: PROMPT },
        // { role: 'user', content: msg },
        ...msg
      ],
      temperature: 0.7,
      max_tokens: 150,
      headers: {
        'HTTP-Referer': 'https://localhost:3000',
        'X-Title': 'Coaching Assistant',
      },
    })

    return completion
  } catch (error) {
    console.error('AIModel error:', error)
    throw error
  }
}

export const AIModelTogeneratenf = async (coachingoption, conversation) => {
  try {
    const option = ExpertsList.find((item) => item.name === coachingoption)
    if (!option) {
      throw new Error(`No expert found for coaching option: ${coachingoption}`)
    }

    const PROMPT = option.summeryPrompt

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        ...conversation,
        { role: 'assistant', content: PROMPT },
        // { role: 'user', content: msg },
        // ...msg
      ],
      temperature: 0.7,
      max_tokens: 150,
      headers: {
        'HTTP-Referer': 'https://localhost:3000',
        'X-Title': 'Coaching Assistant',
      },
    })

    return completion
  } catch (error) {
    console.error('AIModel error:', error)
    throw error
  }
}