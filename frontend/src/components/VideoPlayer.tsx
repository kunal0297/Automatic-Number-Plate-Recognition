import React from 'react'

export function VideoPlayer() {
  return (
    <div className="rounded-lg border p-4 bg-white">
      <h3 className="font-semibold mb-2">Annotated Video</h3>
      <video controls className="w-full rounded" src="/sample.mp4" />
      <div className="mt-2 text-sm text-gray-600">Playing local sample.mp4 (mock)</div>
    </div>
  )
}


