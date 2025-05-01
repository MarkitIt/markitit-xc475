export function safeParseNumber(input: any): number {
    if (!input) return 0;
    if (typeof input === 'number') return input;
    if (typeof input === 'string') {
      const match = input.match(/\d{1,6}/);
      if (match) return parseInt(match[0]);
      if (input.toLowerCase().includes("thousand")) return 1000;
    }
    return 0;
  }
    
  
    
  
  export function parseHeadcountRange(raw: number | null): {
      headcount_min: number;
      headcount_max: number;
    } {
    if (!raw || raw <= 0) {
      return { headcount_min: 0, headcount_max: 0 };
    }
    
    if (raw < 1000) {
      // If under 1k, +-20% range
      const min = Math.round(raw * 0.8);
      const max = Math.round(raw * 1.2);
      return { headcount_min: min, headcount_max: max };
    }
    
    if (raw >= 1000 && raw < 10000) {
      // If between 1k and 10k, +-30% range
      const min = Math.round(raw * 0.7);
      const max = Math.round(raw * 1.3);
      return { headcount_min: min, headcount_max: max };
    }
    
    if (raw >= 10000 && raw < 100000) {
      // If between 10k and 100k, +-40% range
      const min = Math.round(raw * 0.6);
      const max = Math.round(raw * 1.4);
      return { headcount_min: min, headcount_max: max };
    }
    
    if (raw >= 100000) {
      // Very large events — just ±50%
      const min = Math.round(raw * 0.5);
      const max = Math.round(raw * 1.5);
      return { headcount_min: min, headcount_max: max };
    }
    
    // fallback
    return { headcount_min: raw, headcount_max: raw };
  }
    