import React, { useState } from 'react'

export function UploadPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')

  const onUpload = async () => {
    if (!file) return
    setStatus('Uploading...')
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      setStatus(res.ok ? 'Uploaded as sample.mp4' : 'Upload failed')
    } catch (e) {
      setStatus('Upload failed')
    }
  }

  return (
    <div className="rounded-lg border p-4 bg-white/90 backdrop-blur">
      <h3 className="font-semibold mb-2">Upload Video</h3>
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="mt-3 flex gap-2">
        <button onClick={onUpload} className="px-3 py-2 bg-blue-600 text-white rounded" disabled={!file}>
          Upload
        </button>
        <span className="text-sm text-gray-600">{status}</span>
      </div>
    </div>
  )
}


