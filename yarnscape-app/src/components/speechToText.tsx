import React, { useState, useEffect } from 'react';

const SpeechToText: React.FC = () => {
  const [transcription, setTranscription] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Request microphone access
    const getMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
      } catch (err) {
        console.error('Microphone access denied:', err);
      }
    };
    
    getMicrophone();
  }, []);

  const startRecording = () => {
    if (mediaRecorder && audioStream) {
      setIsRecording(true);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        // Process the recorded audio data here.
        // Send it to a Speech-to-Text API
        transcribeAudio(event.data);
      };

      mediaRecorder.onstop = () => {
        // Cleanup when recording is stopped
        setIsRecording(false);
      };
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      audioStream?.getTracks().forEach(track => track.stop());
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    // For this example, we'll assume you're using a Speech-to-Text API
    // such as Google Cloud, Web Speech API, or others.
    
    const formData = new FormData();
    formData.append('file', audioBlob);
    
    // This is a placeholder; replace with your API URL and any required headers.
    const response = await fetch('YOUR_SPEECH_TO_TEXT_API_URL', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    // Assuming the transcription result is in the 'transcription' field.
    setTranscription(data.transcription);
  };

  return (
    <div>
      <h1>Speech-to-Text Demo</h1>
      <p>Transcription: {transcription}</p>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
    </div>
  );
};

export default SpeechToText;