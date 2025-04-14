import React, { useEffect, useRef } from "react";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. 카메라 접근
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  // 2. 0.3초마다 서버로 프레임 전송
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 640, 480);
          const dataUrl = canvasRef.current.toDataURL("image/jpeg");
          sendFrameToServer(dataUrl);
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // 3. 서버로 POST
  function sendFrameToServer(imageDataUrl: string) {
    fetch("http://localhost:5000/upload_frame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    })
      .then(() => console.log("✅ 전송 완료"))
      .catch(console.error);
  }

  return (
    <div>
      <h2>📷 실시간 프레임 전송 중...</h2>
      <video ref={videoRef} width="640" height="480" autoPlay muted />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      />
    </div>
  );
}

export default App;
