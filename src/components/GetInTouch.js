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
import Link from "next/link";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    if (formData.firstName) formDataToSend.append("data[firstName]", formData.firstName);
    if (formData.lastName) formDataToSend.append("data[lastName]", formData.lastName);
    if (formData.email) formDataToSend.append("data[email]", formData.email);
    if (formData.message) formDataToSend.append("data[message]", formData.message);

    try {
      const response = await fetch("https://admin.bizzcode.site/api/inbox/submit/3fba29fd52c54e6d13c55429f31e80bab098640b", {
        method: "POST",
        headers: {
          "Api-Key": "API-1c4b6c166d174997c552f8b163e7670c1bacffa9",
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setNotification({ show: true, message: "Your message has been sent successfully!", type: "success" });
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setNotification({ show: true, message: "Failed to send your message. Please try again later.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setNotification({ show: true, message: "An error occurred. Please try again later.", type: "error" });
    }
  };

  return (
    <section className="relative flex items-center justify-center w-full max-w-5xl 2xl:max-w-7xl mx-auto p-6 text-white min-h-screen 2xl:min-h-[50vh]">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <form onSubmit={handleSubmit} className="md:col-span-2 grid gap-4 grid-cols-2">
          <div className="col-span-2 md:col-span-1" data-aos="fade-right" data-aos-duration="1500">
            <label className="block text-sm 2xl:text-lg font-medium mb-1" htmlFor="firstName">
              First Name
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-white text-[#1c1d2c] focus:outline-none focus:border-indigo-500"
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2 md:col-span-1" data-aos="fade-right" data-aos-duration="1700">
            <label className="block text-sm 2xl:text-lg font-medium mb-1" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-white text-[#1c1d2c] focus:outline-none focus:border-indigo-500"
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2" data-aos="fade-right" data-aos-duration="1900">
            <label className="block text-sm 2xl:text-lg font-medium mb-1" htmlFor="email">
              Your email
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-white text-[#1c1d2c] focus:outline-none focus:border-indigo-500"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2" data-aos="fade-up" data-aos-duration="2100">
            <label className="block text-sm 2xl:text-lg font-medium mb-1" htmlFor="message">
              Your message
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-white text-[#1c1d2c] focus:outline-none focus:border-indigo-500"
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="col-span-2" data-aos="fade-up" data-aos-duration="2300">
            <input type="checkbox" id="terms" name="terms" className="mr-2" required />
            <label htmlFor="terms" className="text-sm 2xl:text-lg">
              By submitting this form, you agree to our terms and conditions and privacy policy.
            </label>
          </div>
          <button type="submit" data-aos="fade-up" data-aos-duration="2500" className="col-span-2 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg">
            Send message
          </button>
        </form>
        <div className="col-span-2 lg:col-span-1 mt-6 lg:mt-0">
          <p className="text-center md:text-start text-lg font-semibold" data-aos="fade-up" data-aos-duration="1500">
            Get in touch with me on my social media handles.
          </p>
          <div className="mt-5 flex justify-center md:justify-start gap-5 p-4">
            <Link
              href="https://www.github.com/BimaBizz"
              target="_blank"
              rel="noreferrer"
              aria-label="Github"
              className="flex items-center justify-center bg-[#1c1d2c] rounded-full p-4 border border-indigo-500 w-fit"
              data-aos="flip-left"
              data-aos-duration="1500"
            >
              <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="https://www.instagram.com/akuubimaa_"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center bg-[#1c1d2c] rounded-full p-4 border border-indigo-500 w-fit"
              data-aos="flip-left"
              data-aos-duration="1700"
            >
              <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/in/bimabizz/"
              target="_blank"
              rel="noreferrer"
              aria-label="Linkedin"
              className="flex items-center justify-center bg-[#1c1d2c] rounded-full p-4 border border-indigo-500 w-fit"
              data-aos="flip-left"
              data-aos-duration="1900"
            >
              <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                  clipRule="evenodd"
                />
                <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

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

export default ContactUs;
