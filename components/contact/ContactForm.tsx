export default function ContactForm() {
  return (
    <div className="bg-white shadow-lg rounded-3xl p-8 md:p-12 w-full max-w-lg mx-auto">
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            placeholder="077 123 4567"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            placeholder="Your message..."
            rows={5}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}