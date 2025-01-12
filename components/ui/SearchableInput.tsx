import React, { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input"; // Assuming this is the same Input component you're using
import useSuggestions from "@/hooks/useSuggestions";
import { useTranslation } from "react-i18next";

type SearchableInputProps<T> = {
  items: T[];
  query: string;
  setQuery: (val: string) => void;
  keyName: keyof T; // Property to search within each item
  onSelect: (item: T) => void;
};

function SearchableInput<T extends { [key: string]: any }>({
  items,
  query,
  setQuery,
  keyName,
  onSelect,
}: SearchableInputProps<T>) {
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { suggestions, isDropdownVisible } = useSuggestions(
    items,
    query,
    keyName
  );

  // Close the dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close the dropdown if clicked outside
        setQuery(""); // Clear the query when the dropdown is closed
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={(e) => {
          e.target.select();
          if (query.length > 0) setQuery(query);
        }}
      />
      {/* Display suggestions only if there are matches */}
      {isDropdownVisible && suggestions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-background border border-input rounded-md shadow-sm max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-3 py-2 text-sm text-foreground hover:bg-muted cursor-pointer"
              onClick={() => {
                onSelect(suggestion); // Pass the selected item to the parent
              }}
            >
              {suggestion["translationKey"]
                ? t(suggestion["translationKey"])
                : suggestion[keyName]?.toString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchableInput;
