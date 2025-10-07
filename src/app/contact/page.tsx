import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="py-24 text-center bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have a question, a partnership proposal, or need help with our service? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-2">General Inquiries</h3>
              <a href="mailto:hello@rentfax.ai" className="text-primary text-lg hover:underline">
                hello@rentfax.ai
              </a>
              <p className="text-muted-foreground mt-1">For general questions and information.</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Sales & Enterprise</h3>
              <a href="mailto:sales@rentfax.ai" className="text-primary text-lg hover:underline">
                sales@rentfax.ai
              </a>
              <p className="text-muted-foreground mt-1">For volume pricing and custom solutions.</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Support</h3>
              <a href="mailto:support@rentfax.ai" className="text-primary text-lg hover:underline">
                support@rentfax.ai
              </a>
              <p className="text-muted-foreground mt-1">For help with your account or reports.</p>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-6 p-8 border border-border rounded-xl">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" id="name" name="name" className="w-full px-4 py-2 border border-border rounded-lg" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-border rounded-lg" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea id="message" name="message" rows={5} className="w-full px-4 py-2 border border-border rounded-lg"></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
