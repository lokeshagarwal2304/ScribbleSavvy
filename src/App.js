import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { motion } from "framer-motion";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";


export default function WritingAssistant() {
  const [text, setText] = useState("");
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleReword = async () => {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        prompt: `Reword and revise the following text:\n${text || transcript}`,
        max_tokens: 200,
      }),
    });
    const data = await response.json();
    setText(data.choices[0].text.trim());
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.h1 className="text-xl font-bold mb-4" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        Writing Assistant
      </motion.h1>
      <Card>
        <CardContent className="p-4">
          <Textarea
            value={transcript || text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start speaking or type your text here..."
            rows={5}
          />
          <div className="flex gap-2 mt-4">
            <Button onClick={SpeechRecognition.startListening} disabled={listening}>
              🎤 Start Speaking
            </Button>
            <Button onClick={resetTranscript} variant="secondary">
              🔄 Reset
            </Button>
            <Button onClick={handleReword}>
              ✍️ Reword & Revise
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
