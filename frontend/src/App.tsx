import React from 'react'
import { VortexDemo } from './components/hero/VortexDemo'
import { UploadPanel } from './components/UploadPanel'
import { Actions } from './components/Actions'
import { ResultsTable } from './components/ResultsTable'
import { VideoPlayer } from './components/VideoPlayer'
import { Vortex } from './components/ui/vortex'

export default function App() {
  return (
    <Vortex backgroundColor="black" className="min-h-screen">
      <div className="py-6">
        <VortexDemo />
      </div>
      <main className="max-w-6xl mx-auto px-4 pb-20 grid gap-6 md:grid-cols-2">
        <UploadPanel />
        <Actions />
        <ResultsTable />
        <VideoPlayer />
      </main>
    </Vortex>
  )
}


