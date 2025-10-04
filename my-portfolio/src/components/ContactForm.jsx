import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For starter: open mail client with mailto.
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="border border-gray-700 bg-black text-white px-3 py-2 rounded placeholder-gray-400"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          type="email"
          className="border border-gray-700 bg-black text-white px-3 py-2 rounded placeholder-gray-400"
          required
        />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        rows="6"
        className="border border-gray-700 bg-black text-white px-3 py-2 rounded w-full placeholder-gray-400"
        required
      />
      <div>
        <button
          type="submit"
          className="px-4 py-2 bg-white text-black rounded font-bold hover:bg-gray-200"
        >
          Send
        </button>
        {sent && (
          <span className="ml-3 text-green-400">Opening mail client…</span>
        )}
      </div>
    </form>
  );
}
