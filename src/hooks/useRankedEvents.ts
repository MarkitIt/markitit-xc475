import { useEffect, useState } from "react";

interface RankedEvent {
  id: string;
  score: number;
  name?: string;
  [key: string]: any;
}

interface UseRankedEventsResult {
  rankedEvents: RankedEvent[] | null;
  loading: boolean;
  error: string | null;
  clearCache: () => void;
}

export function useRankedEvents(vendorId: string | null): UseRankedEventsResult {
  const [rankedEvents, setRankedEvents] = useState<RankedEvent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = vendorId ? `rankedEvents_${vendorId}` : null;

  useEffect(() => {
    if (!vendorId || !storageKey) return;

    const cached = localStorage.getItem(storageKey);
    if (cached) {
      setRankedEvents(JSON.parse(cached));
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8-second timeout

    const fetchRankings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/rankEvents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        if (data.rankedEvents) {
          localStorage.setItem(storageKey, JSON.stringify(data.rankedEvents));
          setRankedEvents(data.rankedEvents);
        } else {
          throw new Error("No ranked events returned.");
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          setError("Request timed out.");
        } else {
          setError(err.message || "Failed to fetch rankings.");
        }
        console.error("Ranking fetch failed:", err);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchRankings();
    return () => controller.abort(); // Cleanup

  }, [vendorId, storageKey]);

  const clearCache = () => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
      setRankedEvents(null);
    }
  };

  return { rankedEvents, loading, error, clearCache };
}
