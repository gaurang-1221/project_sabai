import { Gift, Percent, Zap, Clock, ArrowRight, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const Offers = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeOffers = [
    {
      id: 1,
      title: "Welcome Bonus",
      description: "Get flat 20% off on your first purchase. Applicable on all categories.",
      code: "WELCOME20",
      discount: "20% OFF",
      expiry: "Valid for new users",
      color: "indigo",
      icon: <Gift size={24} />,
    },
    {
      id: 2,
      title: "Summer Sale",
      description: "Massive discounts on summer collection. Limited time only.",
      code: "SUMMER50",
      discount: "UP TO 50%",
      expiry: "Ends in 3 days",
      color: "rose",
      icon: <Zap size={24} />,
    },
    {
      id: 3,
      title: "Flash Deal",
      description: "Special weekend offer on luxury accessories and premium bags.",
      code: "WEEKEND15",
      discount: "15% OFF",
      expiry: "Valid till Sunday",
      color: "amber",
      icon: <Percent size={24} />,
    },
  ];

  return (
    <div className="pb-20 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
            <Gift size={12} />
            Exclusive Deals
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Best <span className="text-indigo-600">Offers</span> for You
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Explore our latest promotions and use the coupon codes at checkout to save big on your favorite products.
          </p>
        </div>

        {/* Featured Banner */}
        <div className="relative group rounded-[3rem] overflow-hidden mb-16 shadow-2xl shadow-indigo-100/50 border border-indigo-50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 mix-blend-multiply opacity-90" />
          <div className="relative p-12 md:p-20 text-left">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                Seasonal Highlight
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Unlock 30% Off <br /> Entire Collection
              </h2>
              <p className="text-indigo-100 text-lg font-medium mb-10 opacity-90">
                Our biggest sale of the season is here. Premium quality, now at unbeatable prices. Use code <span className="font-black text-white underline decoration-wavy decoration-rose-400 underline-offset-4">PREMIUM30</span>
              </p>
              <button 
                onClick={() => handleCopy("PREMIUM30")}
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-5 rounded-2xl font-black transition-all flex items-center gap-3 shadow-xl active:scale-95"
              >
                {copiedCode === "PREMIUM30" ? (
                  <>
                    <CheckCircle2 size={20} />
                    COPIED!
                  </>
                ) : (
                  <>
                    GET DISCOUNT
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeOffers.map((offer) => (
            <div 
              key={offer.id} 
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/20 transition-all duration-500 group relative flex flex-col h-full"
            >
              <div className={`w-14 h-14 bg-${offer.color}-50 text-${offer.color}-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {offer.icon}
              </div>
              
              <div className="mb-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-gray-900">{offer.title}</h3>
                  <span className={`text-[10px] font-black text-${offer.color}-600 bg-${offer.color}-50 px-3 py-1 rounded-full uppercase tracking-wider`}>
                    {offer.discount}
                  </span>
                </div>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="mt-auto space-y-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{offer.expiry}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                  <code className="text-indigo-600 font-black text-base font-mono">{offer.code}</code>
                  <button 
                    onClick={() => handleCopy(offer.code)}
                    className="p-2 text-indigo-400 hover:text-indigo-600 transition-colors"
                    title="Copy Code"
                  >
                    {copiedCode === offer.code ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-20 p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 text-center">
          <p className="text-sm font-medium text-gray-500">
            Terms and conditions apply to all offers. Only one coupon code can be used per order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Offers;
