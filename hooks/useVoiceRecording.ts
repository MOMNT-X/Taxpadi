import { useState, useEffect, useCallback, useRef } from "react";

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  error: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  resetTranscript: () => void;
}

export const useVoiceRecording = (): UseVoiceRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");

  // Check if browser supports speech recognition
  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interim = "";
      
      // Process all results from the last processed index
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptPiece = result[0].transcript;
        
        if (result.isFinal) {
          // Add final result to our accumulated final transcript
          finalTranscriptRef.current += transcriptPiece + " ";
        } else {
          // Accumulate interim results
          interim += transcriptPiece;
        }
      }

      // Update state with accumulated final transcript and current interim
      setTranscript(finalTranscriptRef.current.trim());
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      
      // Handle specific errors
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone access denied. Please allow microphone access.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else if (event.error === "network") {
        setError("Network error. Please check your connection.");
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [isSupported]);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    setError(null);
    setTranscript("");
    setInterimTranscript("");
    finalTranscriptRef.current = "";
    setIsRecording(true);

    try {
      recognitionRef.current?.start();
    } catch (err: any) {
      console.error("Error starting recognition:", err);
      
      // If already started, try stopping and restarting
      if (err.message?.includes("already started")) {
        try {
          recognitionRef.current?.stop();
          setTimeout(() => {
            recognitionRef.current?.start();
          }, 100);
        } catch (restartErr) {
          setError("Failed to start recording. Please try again.");
          setIsRecording(false);
        }
      } else {
        setError("Failed to start recording. Please try again.");
        setIsRecording(false);
      }
    }
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
    setIsRecording(false);
    setInterimTranscript("");
  }, [isRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    finalTranscriptRef.current = "";
    setError(null);
  }, []);

  return {
    isRecording,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
  };
};