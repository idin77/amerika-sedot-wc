import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
        <li className="flex items-center gap-1.5">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </a>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.url);
                  }}
                  className="hover:text-slate-900 transition-colors truncate max-w-[150px]"
                >
                  {item.name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
