import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

type TestimonialCardProps = {
  quote: string;
  name: string;
  title: string;
  avatar: string;
  imageUrl?: string;
  dataAiHint?: string;
};

export default function TestimonialCard({
  quote,
  name,
  title,
  avatar,
  imageUrl,
  dataAiHint,
}: TestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-accent fill-accent" />
          ))}
        </div>
        <blockquote className="text-foreground flex-grow">
          "{quote}"
        </blockquote>
        <div className="flex items-center mt-6">
          <Avatar>
            {imageUrl && <AvatarImage src={imageUrl} alt={name} data-ai-hint={dataAiHint || 'person'} />}
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {avatar}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
