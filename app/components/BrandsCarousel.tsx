"use client";

const BRANDS = [
  { name: "Michelin",    url: "https://mqplatform.blob.core.windows.net/brandslogo/7e0b03d5-b536-0ac8-dd46-c54a9ee209d5.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D" },
  { name: "Continental", url: "https://mqplatform.blob.core.windows.net/brandslogo/64230120-8140-4803-2c1f-ab27bf74f6d5.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D" },
  { name: "Bridgestone", url: "https://mqplatform.blob.core.windows.net/brandslogo/c2793a79-d7e4-0d7e-aef5-f94ab6d37961.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D" },
  { name: "Pirelli",     url: "https://mqplatform.blob.core.windows.net/brandslogo/80f70f0c-e275-5f26-25e2-75b5db5b648d.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D" },
  { name: "Goodyear",    url: "https://mqplatform.blob.core.windows.net/brandslogo/a1c7d1ba-60fc-10ae-6948-b16c78bd3121.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D" },
  { name: "Kumho",       url: "https://mqplatform.blob.core.windows.net/brandslogo/9a38160c-8054-bdcd-16b9-0035d82138dc.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D" },
  { name: "Hankook",     url: "https://mqplatform.blob.core.windows.net/brandslogo/7548f973-914a-5e18-1baf-eaea15c68a2a.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D" },
  { name: "Dunlop",      url: "https://mqplatform.blob.core.windows.net/brandslogo/8074f926-20cb-d418-d7c4-169d7f0cdeb5.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D" },
  { name: "BFGoodrich",  url: "https://mqplatform.blob.core.windows.net/brandslogo/9fe5d640-6863-ac3a-23be-f9df6d81f099.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D" },
  { name: "Nexen",       url: "https://www.tyrestar.cz/files/manufacturer_images/nexen-logo-1920x1080.png" },
];

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
                  className="max-h-9 max-w-[110px] w-auto object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
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
