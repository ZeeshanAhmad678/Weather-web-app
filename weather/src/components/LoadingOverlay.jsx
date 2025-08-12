import React from 'react'

function LoadingOverlay() {
  return (
    <div className='fixed bg-slate-500/90 w-full h-screen  flex flex-col items-center justify-center z-[9999]'>
        <div className='animate-spin rounded-full h-20 w-20 border-t-8 border-blue-500 border-dotted mb-4'></div>
         <p className="text-white text-2xl font-semibold">Fetching data...</p>
    </div>
  )
}

export default LoadingOverlay