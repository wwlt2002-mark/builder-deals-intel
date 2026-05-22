import sourcesJson from "../../data/sources.json";
import { getPool, hasDatabase } from "./db";
import type { DealCategory, SourceType } from "./types";

export type MonitoredSource = {
  name: string;
  url: string;
  category: DealCategory;
  source_type: SourceType;
  auto_publish_threshold: number;
  enabled: boolean;
  last_checked_at: string | null;
};

const fallbackSources = sourcesJson as Array<Omit<MonitoredSource, "enabled" | "last_checked_at">>;

export async function getMonitoredSources(): Promise<MonitoredSource[]> {
  if (hasDatabase()) {
    const result = await getPool().query(
      `select name,
              url,
              category,
              source_type,
              auto_publish_threshold,
              enabled,
              last_checked_at
       from sources
       order by enabled desc, source_type, category, name`
    );

    return result.rows.map((row) => ({
      name: String(row.name),
      url: String(row.url),
      category: row.category as DealCategory,
      source_type: row.source_type as SourceType,
      auto_publish_threshold: Number(row.auto_publish_threshold),
      enabled: Boolean(row.enabled),
      last_checked_at: row.last_checked_at ? new Date(String(row.last_checked_at)).toISOString() : null
    }));
  }

  return fallbackSources.map((source) => ({
    ...source,
    enabled: true,
    last_checked_at: null
  }));
}

export function getSourceHealth(sources: MonitoredSource[]) {
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const enabled = sources.filter((source) => source.enabled);
  const stale = enabled.filter(
    (source) => !source.last_checked_at || new Date(source.last_checked_at).getTime() < dayAgo
  );

  return {
    total: sources.length,
    enabled: enabled.length,
    stale: stale.length
  };
}
