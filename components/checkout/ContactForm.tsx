'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { User } from 'lucide-react';

export type ContactFormHandle = {
  validate: () => boolean;
  getData: () => { name: string; phone: string; email: string };
};

const ContactForm = forwardRef<ContactFormHandle>((_, ref) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    validate() {
      let ok = true;
      [nameRef, phoneRef, emailRef].forEach((r) => {
        if (!r.current?.value.trim()) {
          r.current?.classList.add('border-red-400', 'bg-red-50');
          ok = false;
        }
      });
      return ok;
    },
    getData() {
      return {
        name: nameRef.current?.value.trim() ?? '',
        phone: phoneRef.current?.value.trim() ?? '',
        email: emailRef.current?.value.trim() ?? '',
      };
    },
  }));

  const clearError = (el: HTMLInputElement) =>
    el.classList.remove('border-red-400', 'bg-red-50');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <User className="w-4 h-4 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            ref={nameRef}
            type="text"
            placeholder="Amal Perera"
            onChange={(e) => clearError(e.target)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                       outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            ref={phoneRef}
            type="tel"
            placeholder="+94 71 234 5678"
            onChange={(e) => clearError(e.target)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                       outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            ref={emailRef}
            type="email"
            placeholder="amal@example.com"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                       outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
});

ContactForm.displayName = 'ContactForm';
export default ContactForm;