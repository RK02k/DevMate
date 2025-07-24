export const ExpertsList = [
  {
    name: 'Topic Base Lecture',
    icon: '/lecture.png',
    prompt:
      'You are a helpful lecture voice assistant delivering structured talks on {user_topic}. Keep responses friendly, clear, and engaging. Maintain a human-like, conversational tone while keeping answers concise and under 120 characters. Ask follow-up questions after to engage users but only one at a time.',
    summeryPrompt:
      'As per conversation generate a notes depends in well structure',
    abstract: '/ab1.png',
  },
  {
    name: 'Mock Interview',
    icon: '/interview.png',
    prompt:
      'You are a friendly AI voice interviewer simulating real interview scenarios for {user_topic}. Keep responses clear and concise. Ask structured, industry-relevant questions and provide constructive feedback to help users improve. Ensure responses stay under 120 characters.',
    summeryPrompt:
      'As per conversation give feedback to user along with where is improvment space depends in well structure',
    abstract: '/ab2.png',
  },
  {
    name: 'Ques Ans Prep',
    icon: '/qa.png',
    prompt:
      'You are a conversational AI voice tutor helping users practice Q&A for {user_topic}. Ask clear, well-structured questions and provide concise feedback. Encourage users to think critically while keeping responses under 120 characters. Engage them with one question at a time.',
    summeryPrompt:
      'As per conversation give feedback to user along with where is improvment space depends in well structure',
    abstract: '/ab3.png',
  },
  {
    name: 'Learn Language',
    icon: '/language.png',
    prompt:
      'You are a helpful AI voice coach assisting users in learning {user_topic}. Provide pronunciation guidance, vocabulary tips, and interactive exercises. Keep responses friendly, engaging, and concise, ensuring clarity within 120 characters.',
    summeryPrompt:
      'As per conversation generate a notes depends in well structure',
    abstract: '/ab4.png',
  },
  // {
  //   name: 'Meditation',
  //   icon: '/meditation.png',
  //   prompt:
  //     'You are a soothing AI voice guide for meditation on {user_topic}. Lead calming exercises, breathing techniques, and mindfulness practices. Maintain a peaceful tone while keeping responses under 120 characters.',
  //   summeryPrompt:
  //     'As per conversation generate a notes depends in well structure',
  //   abstract: '/ab5.png',
  // },
]

export const CoachingExpert = [
  {
    name: 'Joanna',
    avatar: '/t1.avif',
    pro: false,
  },
  {
    name: 'Salli',
    avatar: '/t2.jpg',
    pro: false,
  },
  {
    name: 'Joey',
    avatar: '/t3.jpg',
    pro: false,
  },
  // {
  //     name: 'Rachel',
  //     avatar: '/t4.png',
  //     pro: true
  // },
]

const OPENROUTER_API_KEY =
  '&'

const GenerateFeedbackNotes = async () => {
  setfbt(true)
  try {
    const expertType = DiscussionRoomData?.coachingOption
    const expert = ExpertsList.find((e) => e.name === expertType)
    const promptInstruction =
      expert?.summeryPrompt ||
      'Give feedback and notes for the following conversation:'

    const text = conversationHistory
      .map((msg) => `${msg.speaker}: ${msg.text}`)
      .join('\n')

    const prompt = `
${promptInstruction}

Conversation:
${text}

Feedback:
`

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo', // You can change to another model if you want
          messages: [{ role: 'system', content: prompt }],
          max_tokens: 512,
          temperature: 0.7,
        }),
      }
    )

    const data = await response.json()
    const feedback =
      data.choices?.[0]?.message?.content || 'No feedback generated.'
    console.log('Interview Feedback:', feedback)
    // You can display the feedback in the UI as needed
  } catch (err) {
    console.error('Error generating feedback/notes:', err)
  }
  setfbt(false)
}
