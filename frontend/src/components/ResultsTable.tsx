import React, { useEffect, useState } from 'react'

type Row = {
  frame_nmr: string
  car_id: string
  car_bbox: string
  license_plate_bbox: string
  license_plate_bbox_score: string
  license_number: string
  license_number_score: string
}

export function ResultsTable() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/results')
        if (res.ok) setRows(await res.json())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div id="results" className="rounded-lg border p-4 bg-white">
      <h3 className="font-semibold mb-2">Captured Plates</h3>
      {loading ? (
        <div className="text-sm text-gray-600">Loading...</div>
      ) : (
      <div className="overflow-auto max-h-[24rem]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Frame</th>
              <th className="p-2 text-left">Car ID</th>
              <th className="p-2 text-left">Plate</th>
              <th className="p-2 text-left">Plate Score</th>
              <th className="p-2 text-left">Text Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{r.frame_nmr}</td>
                <td className="p-2">{r.car_id}</td>
                <td className="p-2 font-mono">{r.license_number}</td>
                <td className="p-2">{r.license_plate_bbox_score}</td>
                <td className="p-2">{r.license_number_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}


