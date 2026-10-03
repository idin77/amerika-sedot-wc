import { ServiceItem, CityArea } from '../types';
import { FAQItem } from '../components/FAQSchema';
import { BUSINESS_CONFIG } from '../config/business';

/**
 * Generates targeted, search-optimized FAQ items specifically tailored to a given septic service.
 */
export function getServiceFAQs(service: ServiceItem): FAQItem[] {
  const processOverview = service.processSteps
    .map((step, idx) => `${idx + 1}. ${step.title}: ${step.desc}`)
    .join(' ');

  const warningSigns = service.commonSigns.slice(0, 4).join(', ');

  return [
    {
      question: `How much does ${service.name.toLowerCase()} cost in Greater Houston, TX?`,
      answer: `Professional ${service.name.toLowerCase()} through our Houston partner network typically ranges between ${service.pricingEstimate}. The final price is determined by your septic tank capacity (typically 1,000 to 1,500 gallons), distance from driveway access, and whether heavy digging is required to uncover buried concrete lids. All partner contractors provide transparent, upfront quotes prior to beginning work.`,
      category: 'Cost & Pricing',
    },
    {
      question: `How often is ${service.name.toLowerCase()} recommended for residential systems?`,
      answer: `${service.frequency}. Maintaining this schedule prevents solid scum and sludge carryover from clogging the absorption trenches or spray field nozzles, which can save homeowners upwards of $8,000 in premature drainfield replacement costs.`,
      category: 'Frequency & Maintenance',
    },
    {
      question: `What are the primary warning signs that I need ${service.name.toLowerCase()} immediately?`,
      answer: `Key indicators include: ${warningSigns}. If you notice gurgling pipes or sluggish drainage throughout multiple fixtures, your tank is nearing capacity and requires prompt evaluation before raw sewage backs up into household bathtubs.`,
      category: 'Warning Signs',
    },
    {
      question: `What exact steps take place during a professional ${service.name.toLowerCase()} service call?`,
      answer: `Our certified local technicians follow a rigorous multi-point process: ${processOverview}. All extracted waste is transported to TCEQ-authorized wastewater treatment facilities.`,
      category: 'Process & Procedures',
    },
    {
      question: `Are SepticProDirect contractor partners licensed and insured in Texas?`,
      answer: `Yes. All contractor partners operating through the SepticProDirect dispatch platform are registered with the Texas Commission on Environmental Quality (TCEQ) as licensed sludge haulers and carry comprehensive general liability and commercial vehicle insurance across Harris, Fort Bend, and Montgomery counties.`,
      category: 'Licensing & Compliance',
    },
    {
      question: `How quickly can a local service truck be dispatched for ${service.name.toLowerCase()}?`,
      answer: `For urgent backup emergencies, local contractor partners can frequently arrive within 90 to 180 minutes depending on your Houston ZIP code. Routine maintenance appointments are typically scheduled within 24 to 48 hours with flexible morning and afternoon arrival windows Monday through Saturday.`,
      category: 'Dispatch & Scheduling',
    },
  ];
}

/**
 * Generates targeted, search-optimized FAQ items specifically tailored to a Houston-area city/suburb.
 */
export function getCityFAQs(city: CityArea): FAQItem[] {
  return [
    {
      question: `How much does septic tank pumping cost in ${city.name}, TX?`,
      answer: `Septic tank pumping in ${city.name} (${city.county}) typically costs between $375 and $650 for a standard 1,000 to 1,500-gallon residential tank. Rates vary slightly based on lid depth, volume of settled sludge, and hose run distance from the driveway. Partner contractors provide flat upfront estimates with no surprise disposal surcharges.`,
      category: 'Local Pricing',
    },
    {
      question: `How do local soil conditions in ${city.name} affect septic maintenance?`,
      answer: `In ${city.name}, properties frequently feature ${city.soilNotes}. Because these soil conditions drain slower than sandy loam, regular pumping is critical to prevent hydraulic overload and ensure your drainfield or spray area does not become saturated.`,
      category: 'Soil & System Performance',
    },
    {
      question: `What types of septic systems are most common in ${city.name}, TX?`,
      answer: `Homes and acreage properties in ${city.name} predominantly utilize ${city.systemTypes}. Aerobic units require routine trash tank pump-outs every 1 to 2 years, whereas conventional gravity systems should be pumped every 3 to 5 years depending on household occupancy.`,
      category: 'System Types',
    },
    {
      question: `Which ZIP codes in ${city.name} do partner septic pumpers cover?`,
      answer: `Our local partner network provides scheduled and emergency septic pumping dispatch across ${city.name} ZIP codes including ${city.zipCodes.join(', ')}, as well as adjacent unincorporated areas throughout ${city.county}.`,
      category: 'Coverage Areas',
    },
    {
      question: `Do I need a county permit to have my septic tank pumped in ${city.name}?`,
      answer: `Homeowners in ${city.name} do not need a separate permit simply to pump out routine septic sludge. However, the service must be performed by a TCEQ-registered sludge transporter who legally disposes of the effluent at an authorized municipal facility and provides you with a completed waste manifest receipt.`,
      category: 'Permits & TCEQ Regulations',
    },
    {
      question: `How fast can a septic vacuum tanker respond to emergencies in ${city.name}?`,
      answer: `${city.dispatchNote} In sudden sewage overflow situations, emergency pump trucks can often be on-site within 2 to 3 hours to evacuate high liquid levels and relieve pressure on household plumbing.`,
      category: 'Emergency Dispatch',
    },
  ];
}
