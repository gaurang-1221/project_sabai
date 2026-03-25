import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [serverError, setServerError] = useState("");

  // Redirect if cart is empty and order not placed
  if (cart.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.pincode.trim()) e.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const orderData = {
        customer: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
      };

      const { data } = await axios.post(`${API}/orders`, orderData);
      setOrderId(data._id || data.orderId);
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 max-w-md w-full">
          <CheckCircle size={52} className="text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order placed!</h1>
          <p className="text-sm text-gray-500 mb-1">
            Thank you for your order. We'll be in touch shortly.
          </p>
          {orderId && (
            <p className="text-xs text-gray-400 mb-6">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const Field = ({ label, name, type = "text", placeholder, half = false }) => (
    <div className={half ? "sm:col-span-1" : "sm:col-span-2"}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full text-sm px-3 py-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
          errors[name] ? "border-rose-400 bg-rose-50" : "border-gray-200"
        }`}
      />
      {errors[name] && (
        <p className="text-xs text-rose-500 mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/cart"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to cart
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Form */}
          <div className="flex-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Contact details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" name="fullName" placeholder="Gaurang Shah" />
                <Field label="Email address" name="email" type="email" placeholder="you@email.com" half />
                <Field label="Phone number" name="phone" type="tel" placeholder="9876543210" half />
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Shipping address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Address line 1" name="addressLine1" placeholder="House no, street name" />
                <Field label="Address line 2 (optional)" name="addressLine2" placeholder="Area, landmark" />
                <Field label="City" name="city" placeholder="Udaipur" half />
                <Field label="State" name="state" placeholder="Rajasthan" half />
                <Field label="Pincode" name="pincode" placeholder="313001" half />
              </div>
            </div>

            {serverError && (
              <p className="text-sm text-rose-500 mt-4 text-center">{serverError}</p>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Order summary</h2>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <img
                      src={item.images?.[0] || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">× {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Payment on delivery / manual</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Placing order...
                  </>
                ) : (
                  "Place order"
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                No payment required now. We'll contact you to confirm.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;