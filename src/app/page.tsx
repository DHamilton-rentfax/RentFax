export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[90vh] text-center bg-gradient-to-b from-background to-muted/50 px-6">
      <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight">
        Screen Renters. <span className="text-primary">Prevent Fraud.</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        RentFAX helps landlords and property managers verify renter history,
        detect fraud, and resolve disputes — all in one secure platform.
      </p>
      <a
        href="/screen"
        className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition text-lg font-semibold"
      >
        Start Screening
      </a>
    </section>
  );
}