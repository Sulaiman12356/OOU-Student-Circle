import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { founderConfig } from '../../config/founder';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    role: 'student',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', role: 'student', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#061A4F] text-xs font-bold uppercase tracking-wider">
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061A4F]">
            Contact OOU <span className="text-[#F5B400]">StudentCircle</span>
          </h1>
          <p className="text-sm text-slate-600">
            Have a question, feedback, partnership inquiry, or need assistance? Reach out directly to our leadership and support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Founder / Executive Direct Contact Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-100 flex-shrink-0">
                  <img 
                    src={founderConfig.photoUrl} 
                    alt={founderConfig.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#061A4F] leading-tight">
                    {founderConfig.name}
                  </h3>
                  <p className="text-xs text-amber-700 font-semibold">
                    {founderConfig.alias}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {founderConfig.role}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with the founder for official inquiries, strategic campus partnerships, or platform escalation.
              </p>

              <div className="space-y-2.5 pt-1">
                {/* WhatsApp Clickable Link */}
                <a
                  href={founderConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl transition text-xs font-semibold group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-emerald-600 font-normal">Direct WhatsApp</span>
                      <span>{founderConfig.whatsapp}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600 opacity-60 group-hover:opacity-100 transition" />
                </a>

                {/* Email Clickable Link */}
                <a
                  href={founderConfig.emailUrl}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl transition text-xs font-semibold group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#061A4F] text-white flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#F5B400]" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 font-normal">Direct Email</span>
                      <span>{founderConfig.email}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition" />
                </a>
              </div>
            </div>

            {/* Campus Office & Info */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#061A4F]">Campus Office & Info</h3>
              
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#F5B400]" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 text-xs">Main Campus Location</strong>
                    <span>Faculty of Science, Olabisi Onabanjo University, Ago-Iwoye, Ogun State, Nigeria</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#F5B400]" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 text-xs">Official Inquiries</strong>
                    <a href={founderConfig.emailUrl} className="text-[#061A4F] font-semibold hover:underline">
                      {founderConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#F5B400]" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 text-xs">Operating Hours</strong>
                    <span>Monday – Saturday: 8:00 AM – 7:00 PM WAT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Partnerships */}
            <div className="bg-[#061A4F] text-white p-6 rounded-3xl border border-[#F5B400]/30 space-y-2">
              <h4 className="font-bold text-sm text-[#F5B400]">For Campus Partnerships & Sponsorships</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you an OOU Department, Faculty Student Association, or Corporate Sponsor looking to recruit vetted talent? Contact our team at{' '}
                <a href={founderConfig.emailUrl} className="underline text-amber-300 font-medium">
                  {founderConfig.email}
                </a>.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-[#061A4F]">Send Us a Message</h3>
            
            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-emerald-900">Message Received!</h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you for reaching out. An OOU StudentCircle team member will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Samuel Adebayo"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@email.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">I am a...</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    >
                      <option value="student">OOU Student</option>
                      <option value="client">Client / Business Owner</option>
                      <option value="alumni">OOU Alumni</option>
                      <option value="partner">Corporate / Campus Partner</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Verification question, hiring request"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Your Message</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide detailed information regarding your inquiry..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#F5B400]" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
