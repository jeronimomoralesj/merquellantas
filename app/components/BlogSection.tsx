import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ALL_POSTS as POSTS } from "../lib/blog";

export default function BlogSection() {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Del blog
          </h2>
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-[#ff9900] transition-colors"
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#ff9900]/30 hover:shadow-[0_4px_24px_rgba(255,153,0,0.08)] transition-all duration-300"
            >
              {/* Color bar image placeholder */}
              <div
                className="h-44 flex items-end p-5 relative overflow-hidden"
                style={{ backgroundColor: post.color }}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ff9900] z-10">
                  {post.category}
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff9900] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-black text-gray-900 text-base leading-snug mb-3 group-hover:text-[#ff9900] transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-300">{post.date} · {post.readTime} lectura</span>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-[#ff9900] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
