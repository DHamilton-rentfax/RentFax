import Image from "next/image";

import TestimonialCard from "@/components/testimonial-card";

const testimonials = [
  {
    quote:
      "Rentfax has completely transformed how we handle tenant screening. The AI insights are a game-changer, saving us time and preventing potential issues.",
    name: "Sarah L.",
    title: "Property Manager",
    avatar: "SL",
    imageUrl: "https://placehold.co/100x100.png",
    dataAiHint: "woman smiling",
  },
  {
    quote:
      "The detailed rental history reports are invaluable. We make more informed decisions and have seen a significant decrease in late payments.",
    name: "Michael B.",
    title: "Real Estate Investor",
    avatar: "MB",
    imageUrl: "https://placehold.co/100x100.png",
    dataAiHint: "man portrait",
  },
  {
    quote:
      "As an independent landlord, Rentfax gives me the same tools as the big companies. It's easy to use and provides incredible peace of mind.",
    name: "Jessica T.",
    title: "Landlord",
    avatar: "JT",
    imageUrl: "https://placehold.co/100x100.png",
    dataAiHint: "woman portrait",
  },
  {
    quote:
      "The speed of the background checks is incredible. We can now move qualified applicants in faster than ever before, reducing vacancy periods.",
    name: "David G.",
    title: "Leasing Agent",
    avatar: "DG",
    imageUrl: "https://placehold.co/100x100.png",
    dataAiHint: "man smiling",
  },
  {
    quote:
      "I was hesitant about AI tools, but Rentfax's platform is intuitive and genuinely helpful. The risk analysis helped me dodge a major headache.",
    name: "Emily R.",
    title: "Small Portfolio Owner",
    avatar: "ER",
    imageUrl: "https://placehold.co/100x100.png",
    dataAiHint: "woman happy",
  },
  {
    quote:
      "Customer support is fantastic. They helped me get set up and understand my first few reports. Highly recommended for any serious landlord.",
    name: "Chris P.",
    title: "First-time Landlord",
    avatar: "CP",
    imageUrl: "https://placehold.co/100x100.png",
    dataAiHint: "man happy",
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            Success Stories
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover how property managers, investors, and landlords are using
            Rentfax to build successful rental businesses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}
