"use client";

import { BRANDS } from "../lib/mockData";

export default function BrandsCarousel() {
  const all = [...BRANDS, ...BRANDS];

  return (
    <section className="bg-[#00000024] border-b border-gray-100 overflow-hidden">
      {/* Orange accent strip at top */}
      <div className="h-[3px] bg-[#ff9900]" />

      <div className="flex items-center">
        {/* Scrolling logos */}
        <div className="flex-1 overflow-hidden">
          <div
            className="flex items-center gap-0"
            style={{ animation: "marquee 38s linear infinite", width: "max-content" }}
          >
            {all.map((brand, i) => (
              <div
                key={i}
                className="flex-none flex items-center justify-center border-r border-gray-100"
                style={{ width: "140px", height: "68px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.url}
                  alt={brand.name}
                  className="max-h-9 max-w-[110px] w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const span = document.createElement("span");
                    span.textContent = brand.name;
                    span.style.cssText = "font-size:11px;font-weight:900;color:#d4d4d8;";
                    el.parentElement?.appendChild(span);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
