import { Star } from "lucide-react";

type TestimonialCardProps = {
  quote: string;
  name: string;
  title: string;
  company?: string;
  initials: string;
  rating?: number;
  highlight?: string;
};

export default function TestimonialCard({
  quote,
  name,
  title,
  company,
  initials,
  rating = 5,
  highlight,
}: TestimonialCardProps) {
  return (
    <div className="h-full flex flex-col rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>

      <blockquote className="text-gray-800 text-sm leading-relaxed flex-grow">
        “{quote}”
      </blockquote>

      {highlight && (
        <p className="mt-4 text-xs font-semibold text-emerald-600">
          {highlight}
        </p>
      )}

      <div className="flex items-center mt-6">
        <div className="h-10 w-10 rounded-full bg-[#1A2540] text-white flex items-center justify-center font-bold">
          {initials}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-sm text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">
            {title}
            {company && ` • ${company}`}
          </p>
        </div>
      </div>
    </div>
  );
}
