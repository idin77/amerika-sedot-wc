import { useState } from 'react';
import { MapPin, ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { SERVICE_AREAS, BUSINESS_CONFIG } from '../config/business';
import { IMAGES } from '../lib/images';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { QuoteForm } from '../components/QuoteForm';

interface ServiceAreasPageProps {
  onNavigate: (path: string) => void;
}

export function ServiceAreasPage({ onNavigate }: ServiceAreasPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('all');

  const filteredAreas = SERVICE_AREAS.filter((area) => {
    const matchesSearch =
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.zipCodes.some((z) => z.includes(searchQuery));
    const matchesCounty =
      selectedCounty === 'all' || area.county.toLowerCase().includes(selectedCounty.toLowerCase());
    return matchesSearch && matchesCounty;
  });

  const breadcrumbs = [{ name: 'Service Areas', url: '/service-areas/' }];

  return (
    <>
      <SEOHead
        title="Septic Tank Pumping Service Areas in Greater Houston, TX | SepticProDirect"
        description="Find professional residential septic tank pumping and cleaning services across Houston, Katy, Sugar Land, The Woodlands, Pearland, Cypress, and surrounding Texas cities."
        canonicalPath="/service-areas/"
        schemaType="WebSite"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.houstonHome.src}
            alt={IMAGES.houstonHome.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Regional Coverage Network
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Greater Houston Septic Service Areas
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We connect homeowners across Harris, Fort Bend, Montgomery, and Brazoria counties with verified, licensed local septic contractor partners. Review local soil conditions and dispatch routes below.
            </p>
          </div>
        </div>
      </section>

      {/* Main Filter & City Grid */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-8 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by city or 5-digit ZIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
              />
            </div>

            {/* Filter buttons - functional interactive controls */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <span className="text-xs text-slate-400 mr-1">County:</span>
              {[
                { label: 'All', value: 'all' },
                { label: 'Harris', value: 'harris' },
                { label: 'Fort Bend', value: 'fort bend' },
                { label: 'Montgomery', value: 'montgomery' },
                { label: 'Brazoria', value: 'brazoria' },
              ].map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedCounty(c.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedCounty === c.value
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* City Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredAreas.map((city) => (
              <div
                key={city.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {city.name}, TX
                    </h2>
                    <span className="text-xs text-slate-400">{city.county}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {city.metaDesc}
                  </p>

                  <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100 mb-4">
                    <div>
                      <span className="font-semibold text-slate-700 block">Soil & Drainage:</span>
                      <span className="text-slate-600">{city.soilNotes}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 block">Typical Systems:</span>
                      <span className="text-slate-600">{city.systemTypes}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 block">Coverage ZIP Codes:</span>
                      <span className="text-slate-600 tabular-nums">{city.zipCodes.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`/service-areas/${city.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/service-areas/${city.slug}/`);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors pt-3 border-t border-slate-100"
                >
                  <span>View {city.name} Septic Guide & Pricing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {filteredAreas.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-md mx-auto my-8">
              <p className="text-sm text-slate-700 font-semibold mb-1">No matching service areas found</p>
              <p className="text-xs text-slate-500 mb-4">Try searching for a different Houston metro city or ZIP code.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCounty('all');
                }}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Quick Quote Section */}
          <div className="max-w-3xl mx-auto">
            <QuoteForm
              title="Don't see your specific ZIP code?"
              subtitle="Submit your inquiry anyway—our dispatch network frequently routes partner trucks to adjoining unincorporated areas."
            />
          </div>
        </div>
      </section>
    </>
  );
}
