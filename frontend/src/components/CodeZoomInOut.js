

const CodeZoomInOut =({fontSize,setFontSize})=> {
    return (
      <div className="flex items-center justify-center w-[8%] h-[85%]">
              <span className="material-icons h-[80%] w-[40%] text-slate-300 hover:text-[#0DB276] hover:cursor-pointer" onClick={()=>setFontSize((prev) => Math.min(prev + 2, 36))
              }>zoom_in</span>
              <span className="material-icons h-[80%] w-[40%] text-slate-300 hover:text-[#0DB276] hover:cursor-pointer" onClick={()=> setFontSize((prev)=> Math.max(prev-2,10))}>zoom_out</span>
          </div>
    )
  }
  
  export default CodeZoomInOut