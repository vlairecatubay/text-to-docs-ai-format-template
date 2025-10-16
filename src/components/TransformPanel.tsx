import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateContent } from "@/lib/genai";

interface TransformPanelProps {
  selectedTemplate: { name: string; content: string; formattedHtml?: string } | null;
}

export const TransformPanel = ({ selectedTemplate }: TransformPanelProps) => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [outputHtml, setOutputHtml] = useState("");
  const [isTransforming, setIsTransforming] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleTransform = async () => {
    if (!selectedTemplate || !inputText.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a template and enter text to transform",
        variant: "destructive",
      });
      return;
    }

    setIsTransforming(true);
    try {
      console.log(selectedTemplate);
      const { data, error } = await supabase.functions.invoke('transform-text', {
        body: {
          template: selectedTemplate.content,
          templateHtml: selectedTemplate.formattedHtml,
          input: inputText,
        },
      });

      const a = await generateContent(selectedTemplate.content, selectedTemplate.formattedHtml, inputText);
      console.log(a);

      if (error) throw error;

      data.transformed = data.transformed?.replace("```html", "").replace("```", "");
      data.transformedHtml = data.transformedHtml?.replace("```html", "").replace("```", "");
      const cleanedA = a?.replace("```html", "").replace("```", "");

      setOutputText(cleanedA || "");
      setOutputHtml(cleanedA || "");
      toast({
        title: "Transformation complete",
        description: "Your text has been transformed successfully",
      });
    } catch (error: any) {
      console.error('Transform error:', error);
      toast({
        title: "Transformation failed",
        description: error.message || "Failed to transform text",
        variant: "destructive",
      });
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast({
      title: "Copied",
      description: "Output copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-lg">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Input Text</h3>
            {selectedTemplate && (
              <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-primary/10">
                Using: {selectedTemplate.name}
              </span>
            )}
          </div>
          
          <Textarea
            placeholder="Enter your text to transform..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] resize-none bg-white/50 backdrop-blur border-white/30 focus:border-primary"
          />

          <Button
            onClick={handleTransform}
            disabled={isTransforming || !selectedTemplate || !inputText.trim()}
            className="w-full bg-gradient-primary text-white font-medium shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <Sparkles className={`w-5 h-5 mr-2 ${isTransforming ? 'animate-spin' : ''}`} />
            {isTransforming ? 'Transforming...' : 'Transform with AI'}
          </Button>
        </div>
      </Card>

      {outputText && (
        <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-lg animate-fade-in">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Transformed Output</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="text-primary hover:bg-primary/10"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {selectedTemplate?.formattedHtml ? (
              <div 
                className="p-6 rounded-lg bg-white backdrop-blur border border-border min-h-[200px] overflow-auto"
                dangerouslySetInnerHTML={{ __html: outputHtml }}
              />
            ) : (
              <div className="p-6 rounded-lg bg-white/50 backdrop-blur border border-border min-h-[200px] whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {outputText}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
