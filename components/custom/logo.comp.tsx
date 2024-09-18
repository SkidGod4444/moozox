import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/assets/logo.png"
        alt="Moozox logo"
        width={40}
        height={40}
        className="w-10 h-auto sm:w-24 md:w-10 object-contain mr-1"
      />
      <span className="text-4xl font-bold text-primary">
        oo<span className="text-white">z</span>o
        <span className="text-white">x</span>
      </span>
    </div>
  );
}
