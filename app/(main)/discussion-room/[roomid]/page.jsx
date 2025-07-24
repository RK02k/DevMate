'use client'
import { useMutation, useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { api } from '@/convex/_generated/api'
import { CoachingExpert } from '@/services/Options'
import Image from 'next/image'
import { UserButton } from '@stackframe/stack'
import { Button } from '@/components/ui/button'
import { AIModel, AIModelTogeneratenf } from '@/services/GlobalServices'
import { LoaderCircle } from 'lucide-react'
import { ExpertsList } from '@/services/Options'
// import { UpdateSummary } from '@/convex/DiscussionRoom'

function DiscussionRoom() {
  const { roomid } = useParams()
  const [enableMic, setEnableMic] = useState(false)
  const updateSummary = useMutation(api.DiscussionRoom.UpdateSummary)
  const [transcript, setTranscript] = useState('')
  const [conversationHistory, setConversationHistory] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState('')
  const [lastSpeechTime, setLastSpeechTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const speechSynthesisRef = useRef(null)
  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation)
  const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPEN_NEXT_NOTES
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  })
  const [expert, setExpert] = useState()
  const recognitionRef = useRef(null)
  const checkSilenceIntervalRef = useRef(null)
  const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false)
  const [fbt, setfbt] = useState(false)

  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      )
      setExpert(Expert)
    }
  }, [DiscussionRoomData])

  const speakText = async (text) => {
    try {
      // Cancel any ongoing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }

      // Split text into sentences for more natural pauses
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

      for (const sentence of sentences) {
        const utterance = new SpeechSynthesisUtterance(sentence.trim())

        // Get available voices
        const voices = window.speechSynthesis.getVoices()

        // Select voice based on expert name with preference for more natural voices
        let selectedVoice

        if (expert?.name === 'Joanna') {
          // Microsoft Zira tends to sound more natural for female US voice
          selectedVoice =
            voices.find(
              (voice) =>
                voice.name === 'Microsoft Zira - English (United States)'
            ) ||
            voices.find((voice) => voice.name === 'Google UK English Female')
        } else if (expert?.name === 'Salli') {
          selectedVoice =
            voices.find(
              (voice) =>
                voice.name === 'Microsoft Zira - English (United States)'
            ) ||
            voices.find(
              (voice) =>
                voice.name.toLowerCase().includes('female') &&
                voice.lang.includes('en-US')
            )
        } else if (expert?.name === 'Joey') {
          // Microsoft Mark tends to sound more natural for male voice
          selectedVoice =
            voices.find(
              (voice) =>
                voice.name === 'Microsoft Mark - English (United States)'
            ) ||
            voices.find(
              (voice) =>
                voice.name === 'Microsoft David - English (United States)'
            )
        }

        // Fallback to any English voice if no match found
        if (!selectedVoice) {
          selectedVoice =
            voices.find((voice) => voice.lang.includes('en-US')) || voices[0]
        }

        utterance.voice = selectedVoice

        // Adjust speech parameters for more natural sound
        // Rate between 0.9 and 1.1 for natural variation
        utterance.rate = 0.95 + Math.random() * 0.1

        // Pitch adjustments based on gender and for natural variation
        if (expert?.name === 'Joey') {
          // Male voice - slightly lower pitch with subtle variation
          utterance.pitch = 0.85 + Math.random() * 0.1
        } else {
          // Female voices - slightly higher pitch with subtle variation
          utterance.pitch = 1.05 + Math.random() * 0.1
        }

        // Add slight volume variation
        utterance.volume = 0.9 + Math.random() * 0.1

        // Add natural pauses between sentences
        await new Promise((resolve) => {
          utterance.onend = resolve
          window.speechSynthesis.speak(utterance)
        })

        // Add a small pause between sentences
        if (sentences.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 250))
        }
      }

      return true
    } catch (e) {
      console.log('Speech synthesis error:', e)
      return false
    }
  }

  const processAIResponse = async (userMessage) => {
    try {
      setIsProcessing(true)

      // First save the user's message
      const userMessageHistory = [
        ...conversationHistory,
        {
          text: userMessage,
          timestamp: new Date().toISOString(),
          speaker: 'user',
        },
      ]
      setConversationHistory(userMessageHistory)

      // Save user message to Convex
      await UpdateConversation({
        id: roomid,
        conversation: userMessageHistory,
      })

      const lastAIMessage = conversationHistory
        .filter((msg) => msg.speaker === 'ai')
        .slice(-1)[0]

      const messages = [
        { role: 'assistant', content: lastAIMessage?.text || '' },
        { role: 'user', content: userMessage },
      ]

      const aiResponse = await AIModel(
        DiscussionRoomData?.topic,
        DiscussionRoomData?.coachingOption,
        messages
      )

      if (aiResponse?.choices?.[0]?.message?.content) {
        const responseText = aiResponse.choices[0].message.content
        const newConversationHistory = [
          ...userMessageHistory,
          {
            text: responseText,
            timestamp: new Date().toISOString(),
            speaker: 'ai',
          },
        ]
        setConversationHistory(newConversationHistory)

        // Save AI response to Convex
        await UpdateConversation({
          id: roomid,
          conversation: newConversationHistory,
        })

        // Speak the AI response
        speakText(responseText)
      }
    } catch (err) {
      console.error('AI processing error:', err)
      setError('Failed to get AI response. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const endSession = () => {
    // Save the transcript if there is one and get AI response
    if (transcript) {
      const finalTranscript = transcript
      const newConversationHistory = [
        ...conversationHistory,
        {
          text: finalTranscript,
          timestamp: new Date().toISOString(),
          speaker: 'user',
        },
      ]
      setConversationHistory(newConversationHistory)

      // Save user's final message to Convex
      UpdateConversation({
        id: roomid,
        conversation: newConversationHistory,
      })

      processAIResponse(finalTranscript)
    }

    // Stop recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    // Clear interval
    if (checkSilenceIntervalRef.current) {
      clearInterval(checkSilenceIntervalRef.current)
    }

    // Reset states
    setEnableMic(false)
    setIsSpeaking(false)
    setTranscript('')
    setLastSpeechTime(0)
  }

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onstart = () => {
          setError('')
          setLastSpeechTime(Date.now())
          setIsSpeaking(false)
        }

        recognitionRef.current.onresult = (event) => {
          const currentTranscript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join(' ')

          setTranscript(currentTranscript)
          setIsSpeaking(true)
          setLastSpeechTime(Date.now())
        }

        recognitionRef.current.onerror = (event) => {
          if (event.error !== 'no-speech') {
            setError('Microphone error. Please check your settings.')
            endSession()
          }
        }

        recognitionRef.current.onend = () => {
          // Only restart if we haven't manually ended the session
          if (enableMic) {
            recognitionRef.current.start()
          }
        }
      } else {
        setError('Speech recognition is not supported in this browser.')
      }
    }
  }

  useEffect(() => {
    initializeSpeechRecognition()

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (checkSilenceIntervalRef.current) {
        clearInterval(checkSilenceIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (enableMic) {
      // Start checking for silence every second
      checkSilenceIntervalRef.current = setInterval(() => {
        const timeSinceLastSpeech = Date.now() - lastSpeechTime
        if (timeSinceLastSpeech > 10000) {
          // 10 seconds
          endSession()
        }
      }, 1000)
    }

    return () => {
      if (checkSilenceIntervalRef.current) {
        clearInterval(checkSilenceIntervalRef.current)
      }
    }
  }, [enableMic, lastSpeechTime])

  const connectToServer = async () => {
    try {
      setEnableMic(true)
      setError('')
      setLastSpeechTime(Date.now())
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    } catch (err) {
      setError('Failed to start speech recognition. Please try again.')
    }
  }

  const disconnect = async (e) => {
    e.preventDefault()
    // Save final conversation state including both user and AI messages
    if (conversationHistory.length > 0) {
      await UpdateConversation({
        id: roomid,
        conversation: conversationHistory,
      })
    }
    setEnableFeedbackNotes(true)
    endSession()
  }

  // const GenerateFeedbackNotes = async () => {
  //   setfbt(true)
  //   const res = await AIModelTogeneratenf(
  //     DiscussionRoomData?.coachingOption,
  //     conversationHistory
  //   )
  //   console.log(res)
  //   setfbt(false)
  // }

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
      setfbt(false)
      await updateSummary({
        id: roomid,
        summary: feedback,
      })
    } catch (err) {
      console.error('Error generating feedback/notes:', err)
      setfbt(false)
    }
  }

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load voices when they're available
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices()
        console.log('Available voices:', voices)
      }
    }
  }, [])

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">
        {DiscussionRoomData?.coachingOption}
      </h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative scrollbar-hide">
            {expert?.avatar && (
              <Image
                src={expert.avatar}
                alt="Avatar"
                width={200}
                height={200}
                className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
              />
            )}
            <h2 className="text-gray-500">{expert?.name}</h2>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
            {error &&
              error !==
                'Session ended due to pause. Click Connect to start again.' && (
                <div className="absolute top-4 left-4 right-4 p-2 bg-red-100 text-red-800 rounded-lg text-sm">
                  {error}
                </div>
              )}
          </div>
          <div className="mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button
                onClick={connectToServer}
                className="bg-[#0084FF] hover:bg-[#0073E6] text-white"
              >
                Speak
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={disconnect}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Take a Break
              </Button>
            )}
          </div>
        </div>
        <div>
          <div className="h-[60vh] bg-white border rounded-4xl flex flex-col p-4">
            <div className="flex-1 overflow-y-auto scrollbar-hide mb-4 space-y-4 px-2">
              {conversationHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.speaker === 'ai'
                        ? 'bg-[#0084FF] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span
                      className={`text-xs ${message.speaker === 'ai' ? 'text-blue-100' : 'text-gray-500'}`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-[#0084FF] text-white p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {enableMic && (
              <div
                className={`p-3 rounded-2xl ${isSpeaking ? 'bg-gray-100' : 'bg-gray-50'}`}
              >
                <p className="text-sm text-gray-800">{transcript}</p>
              </div>
            )}
          </div>
          {conversationHistory.length === 0 && (
            <h2 className="mt-4 text-gray-400 text-sm text-center">
              At the end of your conversation we will automatically generate
              feedback/notes from your conversation
            </h2>
          )}
          {conversationHistory.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={GenerateFeedbackNotes}
                disabled={fbt}
                className="bg-[#0084FF] w-full hover:bg-[#0073E6] text-white"
              >
                {fbt ? <LoaderCircle className="animate-spin mr-2" /> : null}
                Generate Feedback/Notes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscussionRoom
