import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ALL_POSTS } from "../lib/blog";

export const metadata = {
  title: "Blog — Merquellantas",
  description: "Guias, consejos y noticias sobre llantas, lubricantes y mantenimiento automotor en Colombia.",
};

export default function BlogPage() {
  const [featured, ...rest] = ALL_POSTS;

  return (
    <>
      <Navbar />

      {/* Featured post */}
      <section style={{ backgroundColor: "#0f0f10" }} className="pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-[#ff9900] mb-8">Blog</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-t-2xl overflow-hidden">
            {/* Color block */}
            <div
              className="h-64 lg:h-auto min-h-[280px] flex items-end p-8"
              style={{ backgroundColor: featured.color }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ff9900]">
                {featured.category}
              </span>
            </div>

            {/* Text */}
            <div className="bg-white p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-gray-400">{featured.date}</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="text-xs font-bold text-gray-400">{featured.readTime} lectura</span>
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-gray-900 leading-tight mb-4">
                {featured.title}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">{featured.excerpt}</p>
              <Link
                href={`/blog/${featured.slug}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#ff9900] text-black font-black text-sm rounded-xl hover:bg-[#e68a00] transition-colors self-start shadow-[0_4px_16px_rgba(255,153,0,0.3)]"
              >
                Leer articulo <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of posts */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-black text-xl text-gray-900 mb-8">Mas articulos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#ff9900]/30 hover:shadow-[0_4px_24px_rgba(255,153,0,0.08)] transition-all duration-300"
              >
                <div
                  className="h-40 flex items-end p-5"
                  style={{ backgroundColor: post.color }}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ff9900]">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-black text-gray-900 text-base leading-snug mb-3 group-hover:text-[#ff9900] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs text-gray-300">{post.date} · {post.readTime} lectura</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-[#ff9900] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
