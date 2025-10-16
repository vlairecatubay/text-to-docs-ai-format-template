import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Template {
  id: string;
  name: string;
  content: string;
  formattedHtml?: string;
}

interface TemplateListProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
  onDeleteTemplate: (id: string) => void;
}

export const TemplateList = ({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate,
  onDeleteTemplate 
}: TemplateListProps) => {
  return (
    <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Templates ({templates.length})
        </h3>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {templates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No templates uploaded yet</p>
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className={`
                    group relative p-4 rounded-lg
                    transition-all duration-200 cursor-pointer
                    ${selectedTemplate?.id === template.id
                      ? 'bg-gradient-primary text-white shadow-md scale-[1.02]'
                      : 'bg-white/50 hover:bg-white/80 text-foreground'
                    }
                  `}
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className={`
                        w-5 h-5 flex-shrink-0
                        ${selectedTemplate?.id === template.id ? 'text-white' : 'text-primary'}
                      `} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {template.name}
                        </p>
                        <p className={`
                          text-sm truncate
                          ${selectedTemplate?.id === template.id ? 'text-white/80' : 'text-muted-foreground'}
                        `}>
                          {template.content.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`
                        flex-shrink-0 opacity-0 group-hover:opacity-100
                        transition-opacity
                        ${selectedTemplate?.id === template.id 
                          ? 'text-white hover:bg-white/20' 
                          : 'text-destructive hover:bg-destructive/10'
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTemplate(template.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
