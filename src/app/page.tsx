"use client";

import { useState, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import ResultsCard from '@/components/ResultsCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { analyzeVibe, type AnalyzeVibeOutput, type AnalyzeVibeInput } from '@/ai/flows/analyze-vibe';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Question {
  id: string;
  text: string;
  options: string[];
}

const quizQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What\'s your go-to social media platform for news updates?',
    options: ['Twitter (X)', 'Instagram Stories', 'TikTok', 'News Websites/Apps', 'Reddit'],
  },
  {
    id: 'q2',
    text: 'Preferred way to listen to new music releases?',
    options: ['Spotify/Apple Music New Releases', 'YouTube recommendations', 'Radio/Playlists', 'Friend suggestions', 'TikTok Sounds'],
  },
  {
    id: 'q3',
    text: 'How do you typically spend your Friday nights?',
    options: ['Out with friends at a trendy spot', 'Cozy night in with a movie/show', 'Exploring a new hobby or skill', 'Gaming with an online squad', 'Attending a live event/concert'],
  },
  {
    id: 'q4',
    text: 'Your take on the latest fashion trends?',
    options: ['Love to experiment and adopt them', 'Appreciate from afar, stick to classics', 'Comfort over everything', 'Only if it\'s sustainable/ethical', 'What trends?'],
  },
  {
    id: 'q5',
    text: 'When planning a vacation, what\'s your priority?',
    options: ['Adventure and exploration', 'Relaxation and unwinding', 'Cultural immersion', 'Instagrammable spots', 'Budget-friendly experiences'],
  },
];

export default function VibeRatePage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [vibeAnalysisResult, setVibeAnalysisResult] = useState<AnalyzeVibeOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const totalQuestions = quizQuestions.length;

  const handleAnswerSelect = async (answer: string) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsLoadingAnalysis(true);
      setError(null);
      try {
        const result = await analyzeVibe({ responses: newAnswers } as AnalyzeVibeInput);
        setVibeAnalysisResult(result);
      } catch (e) {
        console.error("Error analyzing vibe:", e);
        setError("Oops! Something went wrong while analyzing your vibe. Please try again.");
      }
      setIsLoadingAnalysis(false);
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setVibeAnalysisResult(null);
    setIsLoadingAnalysis(false);
    setError(null);
    setShowWelcome(true);
  };
  
  const startQuiz = () => {
    setShowWelcome(false);
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-secondary">
        <div className="text-center space-y-6 bg-card p-8 sm:p-12 rounded-xl shadow-2xl max-w-xl">
          <h1 className="text-5xl sm:text-6xl font-bold font-headline text-primary">VibeRate</h1>
          <p className="text-xl sm:text-2xl text-card-foreground/80">
            Ready to find out your current vibe? Answer a few questions and let our AI give you the lowdown!
          </p>
          <Button size="lg" onClick={startQuiz} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-lg shadow-md transition-transform hover:scale-105">
            Check My Vibe!
          </Button>
        </div>
      </div>
    );
  }

  const progressValue = ((currentQuestionIndex + (quizCompleted ? 1 : 0)) / totalQuestions) * 100;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">VibeRate</h1>
      </header>

      {!quizCompleted && !isLoadingAnalysis && (
        <div className="w-full max-w-lg space-y-6">
           <Progress value={progressValue} className="w-full h-3 [&>div]:bg-accent" aria-label={`Quiz progress: ${Math.round(progressValue)}%`} />
          <QuestionCard
            question={quizQuestions[currentQuestionIndex]}
            onAnswer={handleAnswerSelect}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />
        </div>
      )}

      {isLoadingAnalysis && (
        <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-accent" />
          <p className="text-xl font-semibold">Analyzing your vibe...</p>
          <p className="text-muted-foreground">Our AI is hard at work. This won't take long!</p>
        </div>
      )}

      {error && !isLoadingAnalysis && (
         <Alert variant="destructive" className="w-full max-w-lg">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Analysis Failed</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
           <Button onClick={handleRestartQuiz} variant="outline" className="mt-4">Try Again</Button>
         </Alert>
      )}

      {quizCompleted && vibeAnalysisResult && !isLoadingAnalysis && !error && (
        <ResultsCard 
          analysis={vibeAnalysisResult} 
          onRestartQuiz={handleRestartQuiz}
          userResponses={userAnswers} 
        />
      )}
    </main>
  );
}
