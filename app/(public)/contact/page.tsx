import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactDetails from '@/components/contact/ContactDetails';

export default function ContactPage() {
  return (
    <main className="bg-gray-50">
      <section className="relative overflow-hidden pb-20 md:pb-28">
        {/* Hero */}
        <ContactHero />

        {/* Form and details pulled over the curve */}
        <div className="relative mt-8 md:mt-12 z-10 max-w-6xl mx-auto grid gap-8 lg:grid-cols-2 px-4 sm:px-6 lg:px-8">
          <ContactForm />
          <ContactDetails />
        </div>
      </section>
    </main>
  );
}