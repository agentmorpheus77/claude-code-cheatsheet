"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again.");
    }
  };

  return (
    <section className="newsletter-section no-print py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#1c2333]"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#a855f7]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#f97316]/5 rounded-full blur-3xl" />
          </div>

          <div className="relative px-6 py-12 sm:px-12 sm:py-16 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20 mb-6">
              <Mail className="w-6 h-6 text-[#a855f7]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Stay Updated
            </h2>
            <p className="text-[#8b949e] max-w-md mx-auto mb-8">
              Get notified when Claude Code updates with new features, commands,
              and tips. No spam, unsubscribe anytime.
            </p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-green-400"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{message}</span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 focus:border-[#a855f7] transition-all"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#a855f7] to-[#9333ea] text-white font-medium rounded-lg text-sm hover:from-[#9333ea] hover:to-[#7e22ce] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 text-red-400 text-sm mt-3"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{message}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
