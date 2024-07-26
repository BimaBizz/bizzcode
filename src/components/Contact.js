/**
 * This file is part of BizzCode Website Project.
 *
 * BizzCode Website Project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 *
 * BizzCode Website Project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BizzCode Website Project. If not, see <https://www.gnu.org/licenses/>.
 */

"use client";

import React, { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    if (formData.name) formDataToSend.append("data[name]", formData.name);
    if (formData.email) formDataToSend.append("data[email]", formData.email);
    if (formData.message) formDataToSend.append("data[message]", formData.message);

    try {
      const response = await fetch("https://admin.bizzcode.site/api/inbox/submit/07506a70b2a077c7804cb748e80029123c3a8710", {
        method: "POST",
        headers: {
          "Api-Key": "API-1c4b6c166d174997c552f8b163e7670c1bacffa9",
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setNotification({ show: true, message: "Your message has been sent successfully!", type: "success" });
        setFormData({ name: "", email: "", message: "" });

        sendGAEvent({
          category: "Contact",
          action: "Submit",
          label: "Contact Form",
          value: "Success",
        });
      } else {
        setNotification({ show: true, message: "Failed to send your message. Please try again later.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setNotification({ show: true, message: "An error occurred. Please try again later.", type: "error" });
    }
  };

  return (
    <section className="relative flex flex-col lg:flex-row w-full max-w-5xl 2xl:max-w-7xl mx-auto p-4 justify-center items-center min-h-screen 2xl:min-h-[50vh]">
      <div className="max-w-3xl" data-aos="fade-right" data-aos-duration="1500">
        <h1 className="text-3xl font-bold self-start mb-10">🤝 Let&apos;s get in touch.</h1>
        <p className="text-lg text-slate-300">If you&apos;d like to get in touch, please fill out the form below and I&apos;ll get back to you as soon as possible.</p>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" acceptCharset="UTF-8" className="grid md:grid-cols-2 gap-4 w-full max-w-3xl mt-10 text-slate-800" data-aos="fade-left" data-aos-duration="1500">
        <div className="flex flex-col space-y-1 col-span-2 md:col-span-1">
          <label className="font-bold text-slate-300">Name</label>
          <input className="border border-gray-400 rounded-lg p-3" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} required name="name" />
        </div>
        <div className="flex flex-col space-y-1 col-span-2 md:col-span-1">
          <label className="font-bold text-slate-300">Email</label>
          <input className="border border-gray-400 rounded-lg p-3" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required name="email" />
        </div>
        <div className="col-span-2 flex flex-col space-y-1">
          <label className="font-bold text-slate-300">Message</label>
          <textarea className="border border-gray-400 rounded-lg p-3" rows="5" type="text" placeholder="Enter your message" value={formData.message} onChange={handleChange} required name="message" />
        </div>
        <button className="col-span-2 bg-indigo-500 text-white p-3 rounded-lg">Send</button>
      </form>

      {notification.show && (
        <div className={`fixed z-30 bottom-4 right-4 p-4 rounded-lg shadow-lg ${notification.type === "success" ? "bg-indigo-500" : "bg-red-500"} text-white`}>
          <p>{notification.message}</p>
          <button className="mt-2 w-full bg-[#1c1d2c] text-white p-2 rounded-lg" onClick={() => setNotification({ show: false, message: "", type: "" })}>
            Close
          </button>
        </div>
      )}
    </section>
  );
};

export default Contact;
