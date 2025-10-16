import { useState } from "react";
import { TemplateUpload } from "@/components/TemplateUpload";
import { TemplateList } from "@/components/TemplateList";
import { TransformPanel } from "@/components/TransformPanel";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  content: string;
  formattedHtml?: string;
}

const Index = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { toast } = useToast();

  const handleTemplateUpload = async (file: File, htmlContent?: string) => {
    try {
      const content = await file.text();
      
      const newTemplate: Template = {
        id: Date.now().toString(),
        name: file.name,
        content,
        formattedHtml: htmlContent,
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      setSelectedTemplate(newTemplate);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to read template file",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null);
    }
    toast({
      title: "Template deleted",
      description: "Template removed successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-lg bg-white/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Template Transformer</h1>
              <p className="text-sm text-muted-foreground">AI-powered text transformation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel: Template Management */}
          <div className="space-y-6 animate-fade-in">
            <TemplateUpload onTemplateUpload={handleTemplateUpload} />
            <TemplateList
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          </div>

          {/* Right Panel: Transformation */}
          <div className="animate-slide-in-right">
            <TransformPanel selectedTemplate={selectedTemplate} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
