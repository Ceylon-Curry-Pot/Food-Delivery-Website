'use client';

import { useState } from 'react';
import { User, Mail, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center gap-4 min-h-[420px]">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-gray-900">Message Sent!</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-2 text-sm text-red-600 font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 w-full max-w-lg mx-auto">
      <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">Send a Message</h2>
      <p className="text-gray-400 text-sm mb-7">We&apos;ll respond within 24 hours</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Amal Perera"
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400
                         outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="amal@example.com"
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400
                         outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              placeholder="077 828 2112"
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400
                         outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
            />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Message
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <textarea
              placeholder="How can we help you?"
              rows={4}
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400
                         outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3.5 rounded-full
                     hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </form>
    </div>
  );
}