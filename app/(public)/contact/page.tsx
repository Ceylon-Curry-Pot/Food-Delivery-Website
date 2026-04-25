import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactDetails from '@/components/contact/ContactDetails';

export default function ContactPage() {
  return (
    <main className="bg-gray-50">
      <section className="relative overflow-hidden">
        {/* Hero */}
        <ContactHero />

        {/* Form and details pulled over the curve */}
        <div className="relative -mt-12 z-10 flex flex-col md:flex-row justify-center gap-10 px-4 sm:px-6 lg:px-8">
          <ContactForm />
          <ContactDetails />
        </div>
      </section>
    </main>
  );
}