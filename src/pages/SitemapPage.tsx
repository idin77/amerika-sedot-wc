import { ArrowRight, FileCode, CheckCircle2, Globe, Shield, MapPin, Wrench } from 'lucide-react';
import { getAllSiteRoutes, SitemapUrlEntry } from '../lib/sitemap';
import { BUSINESS_CONFIG } from '../config/business';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface SitemapPageProps {
  onNavigate: (path: string) => void;
}

export function SitemapPage({ onNavigate }: SitemapPageProps) {
  const routes = getAllSiteRoutes();

  const coreRoutes = routes.filter((r) => r.category === 'core');
  const serviceRoutes = routes.filter((r) => r.category === 'service');
  const cityRoutes = routes.filter((r) => r.category === 'city');
  const companyRoutes = routes.filter((r) => r.category === 'company');
  const legalRoutes = routes.filter((r) => r.category === 'legal');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'HTML Sitemap', url: '/sitemap/' },
  ];

  return (
    <>
      <SEOHead
        title="HTML Sitemap & Crawl Directory | SepticProDirect Houston"
        description="Comprehensive index of all service pages, local city landing pages, and septic maintenance resources across Greater Houston, TX."
        canonicalPath="/sitemap/"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      <section className="bg-slate-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Globe className="w-3.5 h-3.5" />
              <span>Search Engine & Crawler Navigation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Website Index & Sitemap Directory
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore all {routes.length} structured routes across SepticProDirect. This index helps both search engine spiders and Houston homeowners efficiently navigate our septic pumping services, city hubs, and service parameters.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <FileCode className="w-4 h-4" />
                <span>Open Raw sitemap.xml</span>
              </a>
              <span className="text-xs text-slate-400">
                Last updated: {new Date().toISOString().split('T')[0]} · UTF-8 XML Schema 0.9
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* 1. Core & Conversion Routes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6 text-slate-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold">Main Pages & Service Request Hubs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreRoutes.map((route) => (
                <a
                  key={route.path}
                  href={route.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(route.path);
                  }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all block group"
                >
                  <div className="font-semibold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    {route.title}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{route.path}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Priority: {route.priority}</span>
                    <span className="capitalize">{route.changefreq}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 2. Specialized Septic Services */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6 text-slate-900">
              <Wrench className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold">Houston Septic Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceRoutes.map((route) => (
                <a
                  key={route.path}
                  href={route.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(route.path);
                  }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all block group"
                >
                  <div className="font-semibold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    {route.title}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{route.path}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Priority: {route.priority}</span>
                    <span className="capitalize">{route.changefreq}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 3. Greater Houston City & Suburb Landing Pages */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6 text-slate-900">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold">Local City & Regional Coverage Pages</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cityRoutes.map((route) => (
                <a
                  key={route.path}
                  href={route.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(route.path);
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all block group"
                >
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors truncate">
                    {route.title.replace('Septic Tank Pumping in ', '')}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1 truncate">{route.path}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Priority: {route.priority}</span>
                    <span className="capitalize">{route.changefreq}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 4. Company & Legal Policies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 text-slate-900">
                <Globe className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-base">Company & Contact</h3>
              </div>
              <div className="space-y-3">
                {companyRoutes.map((route) => (
                  <a
                    key={route.path}
                    href={route.path}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(route.path);
                    }}
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors block"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{route.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{route.path}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 text-slate-900">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-base">Disclosures & Legal Policies</h3>
              </div>
              <div className="space-y-3">
                {legalRoutes.map((route) => (
                  <a
                    key={route.path}
                    href={route.path}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(route.path);
                    }}
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors block"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{route.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{route.path}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
