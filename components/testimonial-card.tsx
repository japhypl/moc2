import { Card, CardContent } from "@/components/ui/card";

type TestimonialCardProps = {
  quote: string;
  author: string;
};

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <Card>
      <CardContent>
        <blockquote>
          <p className="text-text-dark italic">&ldquo;{quote}&rdquo;</p>
          <footer className="mt-3 text-sm font-medium text-text-muted">
            &mdash; {author}
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  );
}

export { TestimonialCard };
export type { TestimonialCardProps };
