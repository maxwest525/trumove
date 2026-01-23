import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Building2, Loader2, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  dotNumber: string;
  legalName: string;
  dbaName: string;
  city: string;
  state: string;
  phone: string;
}

interface CarrierSearchProps {
  onSelect: (dotNumber: string) => void;
  className?: string;
}

export function CarrierSearch({ onSelect, className }: CarrierSearchProps) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'dot'>('name');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const search = useCallback(async (searchQuery: string, type: 'name' | 'dot') => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('carrier-lookup', {
        body: null,
        headers: {},
      });

      // Use fetch directly since we need query params
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/carrier-lookup?type=${type}&q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const result = await response.json();
      setResults(result.results || []);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length >= 2) {
      debounceRef.current = setTimeout(() => {
        search(query, searchType);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchType, search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    onSelect(result.dotNumber);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="flex gap-2">
        <div className="flex rounded-lg overflow-hidden border border-border bg-muted/30">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'rounded-none px-3 h-10 text-xs',
              searchType === 'name' && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            onClick={() => setSearchType('name')}
          >
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            Name
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'rounded-none px-3 h-10 text-xs',
              searchType === 'dot' && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            onClick={() => setSearchType('dot')}
          >
            <Hash className="w-3.5 h-3.5 mr-1.5" />
            DOT#
          </Button>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchType === 'name' ? 'Search carrier by name...' : 'Enter DOT number...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className="pl-10 bg-muted/30 border-border h-10"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {showResults && (results.length > 0 || error) && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
          {error ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {error}
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.dotNumber}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{result.legalName}</p>
                      {result.dbaName && result.dbaName !== result.legalName && (
                        <p className="text-xs text-muted-foreground truncate">DBA: {result.dbaName}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {result.city}, {result.state}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      DOT# {result.dotNumber}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
