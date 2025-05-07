"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("/api/scrape", {
          method: "GET", // Correct HTTP method
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setQuotes(data.quotes);
        } else {
          console.error("Failed to fetch quotes:", data.error);
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Quotes to Scrape</h1>
      <div className="grid grid-cols-1 gap-4">
        {quotes.map((quote, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <p className="text-lg font-medium mb-2">"{quote.text}"</p>
            <p className="text-sm text-gray-600">- {quote.author}</p>
            <div className="flex gap-2 mt-2">
              {quote.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
