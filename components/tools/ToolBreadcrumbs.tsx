import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ToolBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function ToolBreadcrumbs({ items }: ToolBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span aria-current="page" className="font-medium text-slate-900">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-slate-900 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
