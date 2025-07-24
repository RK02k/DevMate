// "use client";
import React from 'react'
import ReactMarkdown from 'react-markdown'

function SummaryBox({ summary }) {
  return (
    <div className='h-[60vh] overflow-auto text-base leading-8'>
      <ReactMarkdown>
        {summary}
      </ReactMarkdown>
    </div>
  )
}

export default SummaryBox;
