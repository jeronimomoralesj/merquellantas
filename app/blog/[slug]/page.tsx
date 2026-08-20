import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Newspaper } from "lucide-react";
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

  const isTip = post.section === "tips";
  const sectionLabel = isTip ? "Tips de Merquito" : "Mundo Merque";
  const sectionHref  = isTip ? "/blog#tips" : "/blog#mundo";
  const SectionIcon  = isTip ? BookOpen : Newspaper;

  const related = ALL_POSTS
    .filter((p) => p.slug !== post.slug && p.section === post.section)
    .slice(0, 2);

  return (
    <>
      <Navbar />

      {/* Hero bar */}
      <div
        className="relative overflow-hidden h-60 flex flex-col justify-end px-4 pb-0"
        style={{ background: `linear-gradient(145deg, ${post.color} 0%, ${isTip ? "#2a0800" : "#080808"} 100%)` }}
      >
        {/* Section chip */}
        <div className="max-w-3xl mx-auto w-full pb-14">
          <div className="flex items-center gap-2">
            <Link
              href={sectionHref}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                bg-black/20 border border-white/10 text-[10px] font-black uppercase tracking-wider
                text-[#ff9900] hover:bg-black/30 transition-colors"
            >
              <SectionIcon size={10} />
              {sectionLabel}
            </Link>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{post.category}</span>
          </div>
        </div>

        {/* Merquito for tips posts */}
        {isTip && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/merquito.png"
            alt=""
            aria-hidden="true"
            className="absolute right-4 bottom-0 hidden sm:block h-40 w-auto object-contain"
            style={{ mixBlendMode: "screen" }}
          />
        )}
      </div>

      {/* Article card — overlaps hero */}
      <div className={`pb-16 ${isTip ? "bg-gray-50" : "bg-[#0c0c0d]"}`}>
        <div className="max-w-3xl mx-auto px-4">
          <article className={`rounded-2xl shadow-sm -mt-12 px-6 py-8 sm:px-10 sm:py-10
            ${isTip ? "bg-white" : "bg-[#141414] border border-white/[0.06]"}`}>

            {/* Back link */}
            <Link
              href={sectionHref}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold
                hover:text-[#ff9900] transition-colors mb-6
                ${isTip ? "text-gray-400" : "text-white/30"}`}
            >
              <ArrowLeft size={13} /> Volver al blog
            </Link>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-xs font-semibold ${isTip ? "text-gray-400" : "text-white/30"}`}>{post.date}</span>
              <span className={`w-1 h-1 rounded-full ${isTip ? "bg-gray-200" : "bg-white/10"}`} />
              <div className={`flex items-center gap-1 text-xs font-semibold ${isTip ? "text-gray-400" : "text-white/30"}`}>
                <Clock size={11} /> {post.readTime} lectura
              </div>
            </div>

            <h1 className={`font-black text-2xl sm:text-3xl leading-tight mb-6
              ${isTip ? "text-gray-900" : "text-white"}`}>
              {post.title}
            </h1>
            <p className={`text-base leading-relaxed mb-8 border-l-[3px] border-[#ff9900] pl-4 italic
              ${isTip ? "text-gray-500" : "text-white/50"}`}>
              {post.excerpt}
            </p>

            {/* Body */}
            <div
              className={`text-sm leading-[1.85]
                [&_h2]:font-black [&_h2]:text-lg [&_h2]:mt-8 [&_h2]:mb-3
                [&_p]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:mb-2 [&_li]:leading-relaxed
                [&_strong]:font-bold
                ${isTip
                  ? "text-gray-700 [&_h2]:text-gray-900"
                  : "text-white/55 [&_h2]:text-white [&_strong]:text-white/80"}`}
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {/* CTA */}
            <div className={`mt-10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row
              items-start sm:items-center justify-between gap-4
              ${isTip ? "bg-[#0f0f10]" : "bg-white/5 border border-white/10"}`}>
              <div>
                <p className="font-black text-white text-base mb-1">Encuentra tu llanta ideal</p>
                <p className="text-sm text-white/50">Más de 1.200 referencias con entrega express.</p>
              </div>
              <Link
                href="/products"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3
                  bg-[#ff9900] text-black font-black text-sm rounded-xl
                  hover:bg-[#e68a00] transition-colors shadow-[0_4px_16px_rgba(255,153,0,0.3)]"
              >
                Ver productos <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 mt-10">
            <h2 className={`font-black text-lg mb-5 ${isTip ? "text-gray-900" : "text-white"}`}>
              Más {isTip ? "tips" : "novedades"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className={`group rounded-2xl overflow-hidden transition-all
                    ${isTip
                      ? "bg-white border border-gray-100 hover:border-[#ff9900]/30 hover:shadow-[0_4px_16px_rgba(255,153,0,0.08)]"
                      : "border border-white/[0.06] hover:border-[#ff9900]/25"}`}
                  style={!isTip ? { background: "rgba(255,255,255,0.03)" } : {}}
                >
                  <div
                    className="h-28 flex items-end p-4"
                    style={{ background: `linear-gradient(145deg, ${p.color} 0%, ${isTip ? "#2a0800" : "#080808"} 100%)` }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ff9900]">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className={`font-black text-sm leading-snug group-hover:text-[#ff9900] transition-colors
                      ${isTip ? "text-gray-900" : "text-white"}`}>
                      {p.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs ${isTip ? "text-gray-300" : "text-white/25"}`}>{p.readTime} lectura</span>
                      <ArrowRight size={13} className={`group-hover:text-[#ff9900] transition-colors ${isTip ? "text-gray-300" : "text-white/20"}`} />
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
