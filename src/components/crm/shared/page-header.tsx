import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";

interface ItemMiga {
  href: string;
  label: string;
}

interface PageHeaderProps {
  titulo: string;
  items: ItemMiga[];
  acciones?: React.ReactNode;
}

export function PageHeader({ titulo, items, acciones }: PageHeaderProps) {
  return (
    <div className="flex flex-col-reverse items-start justify-between gap-3 px-2 sm:flex-row sm:items-center lg:px-6">
      <h1 className="mb-1 text-[28px] leading-8 font-medium text-text-primary">{titulo}</h1>
      <div className="flex items-center gap-3">
        {acciones}
        <Breadcrumbs dividerType="chevron" items={items} />
      </div>
    </div>
  );
}
