import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { resources } from "@/lib/data";

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Resource Library"
        description="Helpful articles about pet care, training, and responsible ownership."
      />
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {resources.map((resource) => (
            <AccordionItem key={resource.id} value={resource.id}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                {resource.title}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                {resource.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
