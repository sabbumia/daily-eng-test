"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Volume2,
  BookOpen,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Brain,
  Zap,
  TrendingUp,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: Date;
  corrections?: string[];
  isStreaming?: boolean;
}

export default function EnglishLearningVoiceChat() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTranscript]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const startRecording = async () => {
    try {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentTranscript("");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError("");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setCurrentTranscript("Transcribing...");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append(
        "conversationHistory",
        JSON.stringify(conversationContext)
      );

      const response = await fetch("/api/english-tutor", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API request failed");
      }

      const data = await response.json();

      // Immediately show user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        text: data.transcript,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setCurrentTranscript("");

      // Show agent message immediately with streaming effect
      const agentMessageId = (Date.now() + 1).toString();
      const agentMessage: Message = {
        id: agentMessageId,
        role: "agent",
        text: "",
        timestamp: new Date(),
        corrections: data.corrections,
        isStreaming: true,
      };
      setMessages((prev) => [...prev, agentMessage]);

      // Simulate streaming effect
      const responseText = data.response;
      let currentText = "";
      for (let i = 0; i < responseText.length; i++) {
        currentText += responseText[i];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMessageId ? { ...msg, text: currentText } : msg
          )
        );
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // Mark streaming complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMessageId ? { ...msg, isStreaming: false } : msg
        )
      );

      // Update conversation context
      setConversationContext((prev) =>
        [...prev, `User: ${data.transcript}`, `Tutor: ${data.response}`].slice(
          -10
        )
      );

      // Speak the response
      speakText(data.response);
    } catch (error) {
      console.error("Error processing audio:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error processing audio. Please check your setup."
      );
      setCurrentTranscript("");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const resetConversation = () => {
    setMessages([]);
    setConversationContext([]);
    setError("");
    setCurrentTranscript("");
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20 -bottom-48 left-1/3 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative flex items-center justify-center min-h-[calc(100vh-3rem)] p-2 sm:p-4">
        <div className="w-full max-w-6xl h-[calc(100vh-6rem)] flex flex-col bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600/80 via-indigo-600/80 to-pink-600/80 backdrop-blur-md p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                  <Brain className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-1 sm:gap-2">
                    <span className="truncate">AI English Tutor</span>
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0" />
                  </h1>
                  <p className="text-purple-100 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">
                    Practice conversational English with real-time AI feedback
                  </p>
                  <p className="text-purple-100 text-xs mt-0.5 sm:hidden">
                    Practice speaking English
                  </p>
                </div>
              </div>
              <button
                onClick={resetConversation}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 hover:scale-105 transform flex-shrink-0"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent relative">
            <div className="min-h-full flex flex-col justify-end">
              {messages.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in px-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-500/30 backdrop-blur-sm mb-4 sm:mb-6">
                    <Sparkles className="w-12 h-12 sm:w-20 sm:h-20 text-purple-300 mx-auto mb-2 sm:mb-4" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 sm:mb-3">
                    Start Your Speaking Practice
                  </h3>
                  <p className="text-gray-400 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 px-4">
                    Click the microphone button to begin. Your AI tutor will
                    help you improve pronunciation, grammar, and fluency with
                    personalized feedback.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl w-full px-4">
                    <div className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mb-2" />
                      <p className="text-xs sm:text-sm text-gray-300">
                        Real-time corrections
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
                      <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 mb-2" />
                      <p className="text-xs sm:text-sm text-gray-300">
                        Context-aware responses
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mb-2" />
                      <p className="text-xs sm:text-sm text-gray-300">
                        Instant feedback
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 animate-fade-in">
                  <p className="text-red-300 font-semibold mb-1 text-sm sm:text-base">
                    ⚠️ Error
                  </p>
                  <p className="text-red-200 text-xs sm:text-sm">{error}</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] mt-4 sm:max-w-[80%] ${
                      message.role === "user" ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white border border-purple-400/30"
                          : "bg-white/10 backdrop-blur-md text-white border border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        {message.role === "agent" ? (
                          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-1 sm:p-1.5 rounded-md sm:rounded-lg">
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        ) : (
                          <div className="bg-white/20 p-1 sm:p-1.5 rounded-md sm:rounded-lg">
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                        <span className="font-semibold text-xs sm:text-sm">
                          {message.role === "user" ? "You" : "AI Tutor"}
                        </span>
                        <span
                          className={`text-xs ml-auto ${
                            message.role === "user"
                              ? "text-purple-200"
                              : "text-gray-400"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="leading-relaxed text-sm sm:text-base">
                        {message.text}
                        {message.isStreaming && (
                          <span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-current ml-1 animate-pulse"></span>
                        )}
                      </p>

                      {message.corrections &&
                        message.corrections.length > 0 &&
                        !message.isStreaming && (
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                            <p className="text-xs sm:text-sm font-semibold text-yellow-300 mb-1.5 sm:mb-2 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                              Learning Tips
                            </p>
                            {message.corrections.map((correction, idx) => (
                              <div
                                key={idx}
                                className="text-xs sm:text-sm text-gray-200 mb-1 sm:mb-1.5 pl-2 border-l-2 border-yellow-400/50"
                              >
                                {correction}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}

              {currentTranscript && (
                <div className="flex justify-end animate-fade-in">
                  <div className="max-w-[85%] sm:max-w-[80%] bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-purple-400/30 shadow-lg">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-semibold text-xs sm:text-sm">
                        You
                      </span>
                    </div>
                    <p className="leading-relaxed text-sm sm:text-base">
                      {currentTranscript}
                    </p>
                  </div>
                </div>
              )}

              {isProcessing && !currentTranscript && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/20">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-pink-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-300">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="p-4 sm:p-5 md:p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
              {/* Microphone Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl ${
                  isRecording
                    ? "bg-gradient-to-br from-red-500 to-red-600 animate-pulse shadow-red-500/50"
                    : "bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:via-indigo-700 hover:to-pink-700 shadow-purple-600/50"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isRecording ? (
                  <MicOff className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white" />
                ) : (
                  <Mic className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white" />
                )}
              </button>

              {/* Stop Speaking Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-110 shadow-2xl shadow-orange-500/50 animate-pulse"
                >
                  <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white" />
                </button>
              )}
            </div>

            <div className="text-center mt-3 sm:mt-4 md:mt-5 px-4">
              {isRecording && (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-red-400 font-semibold text-xs sm:text-sm md:text-base">
                    Recording... Click to send
                  </p>
                </div>
              )}
              {isProcessing && !isRecording && (
                <p className="text-indigo-400 font-semibold text-xs sm:text-sm md:text-base">
                  ⚡ Processing your speech...
                </p>
              )}
              {isSpeaking && (
                <p className="text-orange-400 font-semibold text-xs sm:text-sm md:text-base">
                  🔊 Tutor is speaking... Click speaker to stop
                </p>
              )}
              {!isRecording && !isProcessing && !isSpeaking && (
                <p className="text-gray-500 text-xs sm:text-sm">
                  Click microphone to start speaking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
