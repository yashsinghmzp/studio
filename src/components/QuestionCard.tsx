import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: FC<QuestionCardProps> = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  return (
    <Card className="w-full max-w-lg shadow-xl animate-fade-in">
      <CardHeader>
        <CardDescription className="text-sm">
          Question {questionNumber} of {totalQuestions}
        </CardDescription>
        <CardTitle className="text-2xl font-headline">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {question.options.map((option) => (
            <Button
              key={option}
              variant="outline"
              size="lg"
              className="justify-start text-left h-auto py-3 whitespace-normal hover:bg-accent hover:text-accent-foreground"
              onClick={() => onAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
