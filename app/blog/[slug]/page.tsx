import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ALL_POSTS, getPostBySlug } from "../../lib/blog";

export function generateStaticParams() {
  return ALL_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} — Merquellantas`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const maybePost = getPostBySlug(slug);
  if (!maybePost) notFound();
  const post = maybePost!;

  const related = ALL_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Navbar />

      {/* Hero bar */}
      <div className="h-56 flex flex-col justify-end px-4 pb-0" style={{ backgroundColor: post.color }}>
        <div className="max-w-3xl mx-auto w-full pb-16">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ff9900]">
            {post.category}
          </span>
        </div>
      </div>

      {/* Article card — overlaps hero */}
      <div className="bg-gray-50 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <article className="bg-white rounded-2xl shadow-sm -mt-12 px-6 py-8 sm:px-10 sm:py-10">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#ff9900] transition-colors mb-6"
            >
              <ArrowLeft size={13} /> Volver al blog
            </Link>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs text-gray-400 font-semibold">{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
                <Clock size={11} /> {post.readTime} lectura
              </div>
            </div>

            <h1 className="font-black text-2xl sm:text-3xl text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8 border-l-[3px] border-[#ff9900] pl-4 italic">
              {post.excerpt}
            </p>

            {/* Body */}
            <div
              className="prose-body text-gray-700 text-sm leading-[1.85] [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:text-lg [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:mb-2 [&_li]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {/* CTA */}
            <div className="mt-10 bg-[#0f0f10] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-black text-white text-base mb-1">Encuentra tu llanta ideal</p>
                <p className="text-sm text-white/50">Mas de 1.200 referencias disponibles con entrega express.</p>
              </div>
              <Link
                href="/products"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#ff9900] text-black font-black text-sm rounded-xl hover:bg-[#e68a00] transition-colors shadow-[0_4px_16px_rgba(255,153,0,0.3)]"
              >
                Ver productos <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 mt-10">
            <h2 className="font-black text-lg text-gray-900 mb-5">Articulos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#ff9900]/30 hover:shadow-[0_4px_16px_rgba(255,153,0,0.08)] transition-all"
                >
                  <div
                    className="h-28 flex items-end p-4"
                    style={{ backgroundColor: p.color }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ff9900]">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-sm text-gray-900 leading-snug group-hover:text-[#ff9900] transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-300">{p.readTime} lectura</span>
                      <ArrowRight size={13} className="text-gray-300 group-hover:text-[#ff9900] transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
