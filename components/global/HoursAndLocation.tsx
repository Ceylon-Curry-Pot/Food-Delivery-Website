'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import SectionHeader from '../home/SectionHeader';

const DAYS = [
  { name: 'Monday', hours: '10:00 AM – 10:00 PM', index: 1 },
  { name: 'Tuesday', hours: '10:00 AM – 10:00 PM', index: 2 },
  { name: 'Wednesday', hours: '10:00 AM – 10:00 PM', index: 3 },
  { name: 'Thursday', hours: '10:00 AM – 10:00 PM', index: 4 },
  { name: 'Friday', hours: '10:00 AM – 10:00 PM', index: 5 },
  { name: 'Saturday', hours: '10:00 AM – 11:00 PM', index: 6 },
  { name: 'Sunday', hours: '11:00 AM – 9:00 PM', index: 0 },
];

export default function HoursAndLocation() {
  const [todayIndex, setTodayIndex] = useState<number | null>(null);

  useEffect(() => {
    setTodayIndex(new Date().getDay());
  }, []);

  return (
    <section id="hours-location" className="bg-gray-50 py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tagline="Visit Us"
          title="Hours &amp; Location"
          description="We are located at the heart of Colombo. Stop by for an authentic Sri Lankan culinary experience or order online for delivery."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-12">
          {/* Column 1: Opening Hours */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-md flex flex-col justify-between h-full hover:shadow-lg transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 leading-tight">Opening Hours</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Dine-in and Delivery schedule</p>
                </div>
              </div>

              <div className="space-y-3">
                {DAYS.map((day) => {
                  const isToday = todayIndex === day.index;
                  return (
                    <div
                      key={day.name}
                      className={`flex justify-between items-center py-3 px-4 rounded-xl transition-all duration-200 ${isToday
                          ? 'bg-red-600/5 border border-red-600/20 text-red-600 font-semibold'
                          : 'border border-gray-50 text-gray-600 hover:border-gray-100 hover:bg-gray-50/50'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isToday && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                          </span>
                        )}
                        <span>{day.name}</span>
                      </div>
                      <span className={isToday ? 'text-red-600' : 'text-gray-900 font-medium'}>
                        {day.hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>We are currently open and taking orders online!</span>
            </div> */}
          </div>

          {/* Column 2: Location Map */}
          <div className="relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="relative flex-1 min-h-[350px] md:min-h-[400px] w-full">
              <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.822082851123!2d79.84865397568132!3d6.9118653185270285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25b6695d881d1%3A0x4579338ce128a315!2sCeylon%20Curry%20Pot!5e0!3m2!1sen!2slk!4v1783013145756!5m2!1sen!2slk" 
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-none"
                aria-label="Google Maps showing Ceylon Curry Pot restaurant location at Liberty Plaza, Colombo"
              />
            </div>
            <div className="p-5 bg-white border-t border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600 mt-0.5 flex-shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Ceylon Curry Pot</p>
                  <p className="text-xs text-gray-500">Liberty Plaza Food Court, Colombo, Sri Lanka</p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ceylon+Curry+Pot+Liberty+Plaza+Colombo+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-red-600/10 cursor-pointer"
              >
                Get Directions
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
