'use client'

const Analysis = ({ analysisData, color }) => {
  return (
    <div>
      <div className="px-6 py-10" style={{ backgroundColor: color }}>
        <h2 className="text-2xl">Analysis</h2>
      </div>
      <div>
        <ul>
          {analysisData.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between border-b border-t border-black/10"
            >
              <span className="px-2 py-4 text-lg font-semibold">
                {item.name}
              </span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Analysis
