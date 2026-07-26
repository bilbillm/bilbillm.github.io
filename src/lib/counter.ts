export const defaultVercountEndpoint = 'https://events.vercount.one/api/v2/log';

export type CounterStats = {
  sitePv: number;
  siteUv: number;
  pagePv: number;
};

function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function counterStats(payload: unknown): CounterStats | undefined {
  if (!payload || typeof payload !== 'object') return undefined;
  const record = payload as Record<string, unknown>;
  const source = record.data && typeof record.data === 'object'
    ? record.data as Record<string, unknown>
    : record;
  const sitePv = finiteNumber(source.site_pv ?? source.sitePv);
  const siteUv = finiteNumber(source.site_uv ?? source.siteUv);
  const pagePv = finiteNumber(source.page_pv ?? source.pagePv);

  if (sitePv === undefined || siteUv === undefined || pagePv === undefined) return undefined;
  return { sitePv, siteUv, pagePv };
}

export function counterValue(payload: unknown): number | undefined {
  return counterStats(payload)?.pagePv;
}
