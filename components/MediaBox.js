export function MediaBox({ selected, imgSrc, children }) {
    return (
        <div className={`border-2 border-dashed ${selected ? "border-cyan-300" : "border-gray-500"} p-4 rounded-lg flex flex-col items-center bg-gray-800 text-white w-64`}>
        <img src={imgSrc} alt="Media content" className="w-48 h-48 object-cover rounded-lg mb-4" />
        {children}
      </div>
    );
  }
export function TextComponent({ selected = false, imgSrc, text }) {
    return (
      <MediaBox selected={selected} imgSrc={imgSrc}>
        <p className="text-lg font-semibold text-center">{text}</p>
      </MediaBox>
    );
  }
  
export function AudioComponent({ selected = false, imgSrc, audioSrc }) {
    return (
      <MediaBox selected={selected} imgSrc={imgSrc}>
        <audio controls className="w-full">
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </MediaBox>
    );
  }
  
  