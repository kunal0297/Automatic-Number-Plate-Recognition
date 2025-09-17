import React from 'react'
import { Vortex } from '../../components/ui/vortex'

export function VortexDemo() {
  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[28rem] overflow-hidden">
      <Vortex backgroundColor="black" className="flex items-center flex-col justify-center px-4 py-6 w-full h-full">
        <h2 className="text-white text-3xl md:text-6xl font-bold text-center">Automatic Number Plate Recognition</h2>
        <p className="text-white text-base md:text-2xl max-w-2xl mt-6 text-center">
          Upload video, run detection, view annotated playback, and export captured plates.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <a href="#actions" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white">Get Started</a>
          <a href="#results" className="px-4 py-2 text-white">View Results</a>
        </div>
      </Vortex>
    </div>
  )
}



