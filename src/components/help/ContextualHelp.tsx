'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info } from 'lucide-react'; // Using a popular icon library

// A hook to fetch contextual help data
function useContextualHelp(locationKey: string) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!locationKey) return;
        
        // In a real app, you might want to add a loading state and handle errors.
        fetch(`/api/help/contextual?locationKey=${locationKey}`)
            .then(res => res.json())
            .then(data => {
                setItems(data.items || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(`Failed to fetch contextual help for ${locationKey}`, err);
                setLoading(false);
            });

    }, [locationKey]);

    return { items, loading };
}

// Renders a single help item, handling different display styles
function HelpItem({ item }: { item: any }) {
    const [isPopoverVisible, setPopoverVisible] = useState(false);

    const content = (
        <div className="flex gap-2 items-start text-sm text-gray-700">
            <Info size={16} className="mt-1 flex-shrink-0 text-blue-500" />
            <div>
                <p className="m-0">{item.content}</p>
                {item.articleSlug && (
                    <Link
                        href={`/help/article/${item.articleSlug}`}
                        className="text-blue-600 hover:underline text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn more
                    </Link>
                )}
            </div>
        </div>
    );

    if (item.display === 'tooltip' || item.display === 'popover') {
        return (
            <div className="relative inline-block">
                <button 
                    onMouseEnter={() => setPopoverVisible(true)}
                    onMouseLeave={() => setPopoverVisible(false)}
                    onClick={() => setPopoverVisible(!isPopoverVisible)}
                    className="p-1"
                >
                    <Info size={16} className="text-gray-500 hover:text-blue-600" />
                </button>
                {isPopoverVisible && (
                    <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {content}
                    </div>
                )}
            </div>
        );
    }

    // Default to inline display
    return <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">{content}</div>;
}


export function ContextualHelp({ locationKey }: { locationKey: string }) {
  const { items, loading } = useContextualHelp(locationKey);

  if (loading) return null; // Or a loading skeleton
  if (!items.length) return null;

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <HelpItem key={i} item={item} />
      ))}
    </div>
  );
}

// Example of how to add it to a form field
/*
<label className="block text-sm font-medium text-gray-700">
  Incident Amount
  <ContextualHelp locationKey="incident.amount" />
</label>
<input type="text" ... />
*/
