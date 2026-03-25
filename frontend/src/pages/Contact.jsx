import { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status) setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`${API}/contact`, form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
            <Mail size={12} />
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            We're here to <span className="text-indigo-600">help.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Have a question about an order or just want to say hi? Drop us a message and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info cards */}
          <div className="lg:col-span-1 space-y-6">
            {[
              { icon: <Mail size={24} />, title: "Email Us", detail: "support@shopname.com", color: "indigo" },
              { icon: <Phone size={24} />, title: "Call Us", detail: "+1 (555) 000-0000", color: "rose" },
              { icon: <MapPin size={24} />, title: "Visit Us", detail: "123 Design Street, Creative City", color: "amber" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/20 transition-all duration-500 group">
                <div className={`w-14 h-14 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm font-medium text-gray-500">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-indigo-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
              
              {status === "success" && (
                <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center gap-4 text-emerald-700 animate-fade-in">
                  <div className="bg-white p-2 rounded-full shadow-sm text-emerald-500">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="font-black text-lg">Message sent!</p>
                    <p className="text-sm font-medium opacity-80">We'll get back to you shortly.</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-8 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-700 animate-fade-in">
                  <AlertCircle size={24} />
                  <span className="font-bold">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="input-field py-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="input-field py-4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                  <input
                    required
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="input-field py-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    required
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    className="input-field py-4 resize-none"
                  ></textarea>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black py-5 rounded-[1.25rem] transition-all duration-300 shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={22} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
