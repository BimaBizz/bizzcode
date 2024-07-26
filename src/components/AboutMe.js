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
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MessageForm from "./MessageForm";
import Filter from "bad-words";
import customBadWords from "./badWords.json";
import { sendGAEvent } from "@next/third-parties/google";

const AboutMe = (props) => {
  const data = props.data;
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const filter = new Filter();
  filter.addWords(...customBadWords.badWords);

  useEffect(() => {
    const fetchPesan = async () => {
      try {
        const res = await fetch('https://admin.bizzcode.site/api/content/items/pesan?sort={"_created":-1}', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Api-Key": "API-1c4b6c166d174997c552f8b163e7670c1bacffa9",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();

        const filteredMessages = data.map((item) => {
          return {
            ...item,
            message: filter.clean(item.message),
            name: filter.clean(item.name),
          };
        });

        setPesan(filteredMessages);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPesan();
  }, []);

  function convertTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes}`;

    return formattedDate;
  }

  const handleFormSubmit = async (message) => {
    if (!message) {
      setShowForm(false);
      return;
    }

    try {
      const res = await fetch("https://admin.bizzcode.site/api/content/item/pesan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": "API-1c4b6c166d174997c552f8b163e7670c1bacffa9",
        },
        body: JSON.stringify(message),
      });
      if (!res.ok) {
        throw new Error("Failed to post message");
      }
      const newMessage = await res.json();
      setPesan([newMessage, ...pesan]);
      sendGAEvent({
        category: "Trace",
        action: "Submit",
        label: "trace user",
        value: "Success",
      });
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="relative flex w-full items-center max-w-5xl 2xl:max-w-7xl mx-auto p-4 min-h-screen 2xl:min-h-[70vh]" itemType="https://schema.org/ProfilePage" itemScope>
        <div className="max-w-3xl 2xl:max-w-5xl" itemProp="mainEntity" itemType="https://schema.org/Person" itemScope>
          <div className="flex items-center justify-start mb-4" data-aos="fade-right" data-aos-duration="1500">
            <meta itemProp="identifier" content="123475623" />
            {loading ? (
              <div height={80} width={80} className="rounded-full bg-slate-400 animate-pulse max-w-[90%]" />
            ) : (
              <Image itemProp="image" src={"https://admin.bizzcode.site/storage/uploads" + data.image.path} alt={data.image.title} className="rounded-full h-auto w-auto" width={80} height={80} />
            )}
            <h2 className="text-4xl font-bold ml-5" itemProp="name" id="real-name">
              Bima Mahendra
            </h2>
          </div>
          <div itemProp="description" id="deskripsi-bima" dangerouslySetInnerHTML={{ __html: data.deskripsi }} className="text-wrap text-slate-300 space-y-5 text-base 2xl:text-xl" data-aos="fade-left" data-aos-duration="1500"></div>
          <div className="flex gap-4 mt-8">
            {data.sosmed.map((media, index) => (
              <div key={index} className="text-xl py-2 px-4 rounded-lg border border-slate-300 text-slate-300 uppercase" data-aos="fade-up" data-aos-duration={1500 + index * 300}>
                <Link href={media.link} target="_blank" className="flex justify-center items-center">
                  <div dangerouslySetInnerHTML={{ __html: media.svg }} className="mr-2"></div>
                  {media.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative flex w-full justify-center items-center max-w-5xl 2xl:max-w-7xl mx-auto p-4 min-h-screen 2xl:min-h-[70vh]">
        <div className="max-w-3xl 2xl:max-w-5xl xm-auto w-full">
          <div className="flex w-full justify-between items-center py-2 mb-5">
            <h2 className="text-2xl 2xl:text-3xl font-bold" data-aos="fade-down" data-aos-duration="1500">
              A sign you&apos;ve been here
            </h2>
            <button className="border rounded-lg text-base 2xl:text-xl border-slate-300 text-slate-300 py-2 px-4 uppercase" data-aos="fade-down" data-aos-duration="1500" onClick={() => setShowForm(true)}>
              + leave a trace
            </button>
          </div>
          <div className="max-h-[75vh] overflow-y-auto overflow-x-hidden container-scroll">
            {loading ? (
              <div role="status" className="mt-12 w-full text-center flex justify-center items-center">
                <svg aria-hidden="true" className="w-8 h-8 animate-spin text-gray-600 fill-[#1c1d2c ]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {pesan.length > 0 ? (
                  pesan.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 2xl:p-4 border border-slate-300 rounded-md backdrop-blur-sm bg-[#1c1d2c]/50" data-aos={index % 2 ? "fade-right" : "fade-left"} data-aos-duration={1500}>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-xl 2xl:text-2xl text-indigo-500 font-bold">{item.name}</h3>
                        <p className="text-slate-300 text-base 2xl:text-xl">{item.message}</p>
                      </div>
                      <p className="text-slate-300 text-sm">{convertTimestampToDate(item._created)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-300 mt-12 w-full text-center">Tidak ada pesan didalam.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {showForm && <MessageForm onSubmit={handleFormSubmit} />}
    </>
  );
};

export default AboutMe;
