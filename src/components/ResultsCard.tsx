import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyzeVibe, type AnalyzeVibeOutput } from '@/ai/flows/analyze-vibe';
import { Copy, RefreshCw, TwitterIcon as Twitter } from 'lucide-react'; // Assuming TwitterIcon is available or use an SVG.
import { useToast } from "@/hooks/use-toast";


interface ResultsCardProps {
  analysis: AnalyzeVibeOutput;
  onRestartQuiz: () => void;
  userResponses: string[];
}

const ResultsCard: FC<ResultsCardProps> = ({ analysis, onRestartQuiz, userResponses }) => {
  const { toast } = useToast();

  const shareText = `My VibeRate: ${analysis.vibeAnalysis.substring(0, 100)}... Check yours out!`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        .then(() => {
          toast({ title: "Copied to clipboard!", description: "Share your vibe with friends." });
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          toast({ title: "Failed to copy", description: "Could not copy link to clipboard.", variant: "destructive" });
        });
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-xl animate-fade-in">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Your Vibe Analysis</CardTitle>
        <CardDescription>Here's what the AI thinks about your vibe based on your answers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg leading-relaxed">{analysis.vibeAnalysis}</p>
        <div>
          <h3 className="font-semibold mb-2 font-headline">Your Answers:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {userResponses.map((response, index) => (
              <li key={index}>{response}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShareTwitter} aria-label="Share on Twitter">
            <Twitter className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" onClick={handleCopyLink} aria-label="Copy link">
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
        </div>
        <Button onClick={onRestartQuiz} variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" aria-label="Take quiz again">
          <RefreshCw className="mr-2 h-4 w-4" /> Take Quiz Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultsCard;
