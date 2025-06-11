import { useEffect, useState } from 'react';

type PersistentTableDefaults = {
  columnVisibility?: Record<string, boolean>;
  columnFilters?: any[];
  sorting?: any[];
  pagination?: { pageIndex: number; pageSize: number };
  columnOrder?: string[];
  density?: string;
  globalFilter?: string | undefined;
  grouping?: string[];
  columnSizing?: Record<string, number>;
  columnPinning?: {
    left?: string[];
    right?: string[];
  };
};

export function usePersistentTableState(
  keyPrefix: string,
  defaults?: PersistentTableDefaults
) {
  const getFromStorage = (key: string, fallback: any) => {
    try {
      const saved = localStorage.getItem(`${keyPrefix}-${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getFromStorage('columnVisibility', defaults?.columnVisibility ?? {})
  );

  const [columnFilters, setColumnFilters] = useState(() =>
    getFromStorage('columnFilters', defaults?.columnFilters ?? [])
  );

  const [sorting, setSorting] = useState(() =>
    getFromStorage('sorting', defaults?.sorting ?? [])
  );

  const [pagination, setPagination] = useState(() =>
    getFromStorage('pagination', defaults?.pagination ?? {
      pageIndex: 0,
      pageSize: 10
    })
  );

  const [columnOrder, setColumnOrder] = useState(() =>
    getFromStorage('columnOrder', defaults?.columnOrder ?? [])
  );

  const [density, setDensity] = useState(() =>
    getFromStorage('density', defaults?.density ?? 'compact')
  );

  const [globalFilter, setGlobalFilter] = useState(() =>
    getFromStorage('globalFilter', '')
  );

  const [grouping, setGrouping] = useState(() =>
    getFromStorage('grouping', defaults?.grouping ?? [])
  );

  const [columnSizing, setColumnSizing] = useState(() =>
    getFromStorage('columnSizing', defaults?.columnSizing ?? {})
  );

  const [columnPinning, setColumnPinning] = useState(() =>
    getFromStorage('columnPinning', defaults?.columnPinning ?? {})
  );

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-columnVisibility`, JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-columnFilters`, JSON.stringify(columnFilters));
  }, [columnFilters]);

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-sorting`, JSON.stringify(sorting));
  }, [sorting]);

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-pagination`, JSON.stringify(pagination));
  }, [pagination]);

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-columnOrder`, JSON.stringify(columnOrder));
  }, [columnOrder]);

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-density`, JSON.stringify(density));
  }, [density]);

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-globalFilter`, JSON.stringify(globalFilter));
  }, [globalFilter]);

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-grouping`, JSON.stringify(grouping));
  }, [grouping]);

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-columnSizing`, JSON.stringify(columnSizing));
  }, [columnSizing]);

  useEffect(() => {
    localStorage.setItem(`${keyPrefix}-columnPinning`, JSON.stringify(columnPinning));
  }, [columnPinning]);

  // ✅ restore default state
  const resetTableState = () => {
    localStorage.removeItem(`${keyPrefix}-columnVisibility`);
    localStorage.removeItem(`${keyPrefix}-columnFilters`);
    localStorage.removeItem(`${keyPrefix}-sorting`);
    localStorage.removeItem(`${keyPrefix}-pagination`);
    localStorage.removeItem(`${keyPrefix}-columnSizing`);
    // localStorage.removeItem(`${keyPrefix}-columnOrder`);
    localStorage.removeItem(`${keyPrefix}-density`);
    localStorage.removeItem(`${keyPrefix}-columnPinning`);

    setColumnVisibility(defaults?.columnVisibility ?? {});
    setColumnFilters(defaults?.columnFilters ?? []);
    setSorting(defaults?.sorting ?? []);
    setPagination(defaults?.pagination ?? {
      pageIndex: 0,
      pageSize: 10
    });
    // setColumnOrder(defaults?.columnOrder ?? []);
    setDensity(defaults?.density ?? 'compact');
    setGlobalFilter(defaults?.globalFilter ?? undefined);
    setGrouping(defaults?.grouping ?? []);
    setColumnPinning(defaults?.columnPinning ?? {
      left: [],
      right: ['mrt-row-actions']
    });
    setColumnSizing(defaults?.columnSizing ?? {});
  };

  return {
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnOrder,
    setColumnOrder,
    density,
    setDensity,
    globalFilter,
    setGlobalFilter,
    grouping,
    setGrouping,
    columnSizing,
    setColumnSizing,
    columnPinning,
    setColumnPinning,
    resetTableState,
  };
}
