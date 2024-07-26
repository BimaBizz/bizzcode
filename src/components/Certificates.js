import React from "react";
import Image from "next/image";

const Certificates = (props) => {
  const data = props.data;
  return (
    <section className="relative flex flex-col lg:flex-row w-full max-w-5xl 2xl:max-w-7xl mx-auto p-4 justify-center items-center min-h-screen 2xl:min-h-[50vh]">
      <h1 data-aos="fade-right" data-aos-duration="1500" className={`text-3xl font-bold self-start mb-10 ${props.class}`}>
        {props.title}
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((certificate, index) => (
          <div key={index} data-aos="fade-up" data-aos-duration={1500} className="flex flex-col space-y-3">
            <div className="object-cover object-center h-[350px] rounded-xl overflow-hidden relative group">
              <Image src={"https://admin.bizzcode.site/storage/uploads" + certificate.image.path} width={400} height={200} alt={certificate.image.title} className="h-full w-full object-cover" priority={true} />
              <div className="text-lg font-bold w-full bg-gradient-to-b from-transparent to-black/80 text-white z-10 translate-y-0 p-4 h-1/2 absolute group-hover:-translate-y-[100%] group-hover:transition-all group-hover:duration-500">
                <h1 className="absolute bottom-2">{certificate.name}</h1>
              </div>
            </div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td>Published on</td>
                  <td>{certificate.terbit}</td>
                </tr>
                <tr>
                  <td>Credentials</td>
                  <td>{certificate.credit}</td>
                </tr>
                <tr>
                  <td>Published by</td>
                  <td>{certificate.organisasi}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certificates;
