'use client'

import { updatedEntry } from '@/utils/api'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'
import Analysis from './Analysis'

const Editor = ({ entry }) => {
  const [contentValue, setContentValue] = useState(entry.content)
  const [isSaving, setIsSaving] = useState(false)
  const [analysis, setAnalysis] = useState(entry.analysis)
  const { mood, summary, color, subject, negative } = analysis

  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'True' : 'False' },
    // { name: 'Color', value: color },
  ]

  useAutosave({
    data: contentValue,
    onSave: async (_value) => {
      setIsSaving(true)
      const data = await updatedEntry(entry.id, _value)
      setAnalysis(data.analysis)
      setIsSaving(false)
    },
  })

  return (
    <div className="h-full w-full grid grid-cols-3">
      <div className="col-span-2">
        <div className="w-full h-full">
          {isSaving && <div>...saving</div>}
          <textarea
            className="w-full h-full p-8 text-xl outline-none"
            value={contentValue}
            onChange={(e) => setContentValue(e.target.value)}
          />
        </div>
      </div>
      <div className="border-l border-black/10">
        <Analysis analysisData={analysisData} color={color} />
      </div>
    </div>
  )
}

export default Editor
