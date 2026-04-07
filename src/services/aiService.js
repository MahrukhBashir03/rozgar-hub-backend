"use client";
import { useState, useRef } from "react";

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();

    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      sendAudio(audioBlob);
    };

    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const sendAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const res = await fetch("http://localhost:5000/api/ai/voice", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    speak(data.message);
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        className={`w-16 h-16 rounded-full text-white text-xl shadow-lg 
        ${isRecording ? "bg-red-500 animate-pulse" : "bg-blue-600"}`}
      >
        🎤
      </button>
    </div>
  );
}