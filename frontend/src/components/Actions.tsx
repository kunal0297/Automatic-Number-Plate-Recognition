import React, { useState } from 'react'

export function Actions() {
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('')

  const runDetection = async () => {
    setRunning(true)
    setMessage('Running detection...')
    try {
      const res = await fetch('/api/run', { method: 'POST' })
      setRunning(false)
      setMessage(res.ok ? 'Detection complete.' : 'Detection failed.')
    } catch (e) {
      setRunning(false)
      setMessage('Detection failed.')
    }
  }

  return (
    <div id="actions" className="rounded-lg border p-4 bg-white">
      <h3 className="font-semibold mb-2">Run Detection</h3>
      <button onClick={runDetection} className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50" disabled={running}>
        {running ? 'Running...' : 'Run'}
      </button>
      <div className="mt-3 text-sm text-gray-700">{message}</div>
      <div className="mt-4 text-sm text-gray-600">Backend will process the uploaded sample.mp4</div>
    </div>
  )
}


