import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import lodash from "lodash";
function useSuggestions<T extends { [key: string]: any }>(
  items: T[],
  query: string,
  key: keyof T
) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const getMatchingItems = (query: string) => {
    if (query.length === 0) return [];
    return items.filter((item) =>
      t(lodash.camelCase(item[key]?.toString()))
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    if (query.length > 0) {
      setIsDropdownVisible(true);
      setSuggestions(getMatchingItems(query));
    } else {
      setIsDropdownVisible(false);
    }
  }, [query, items]);

  useEffect(() => {
    if (
      suggestions[0] &&
      t(lodash.camelCase(suggestions[0][key]?.toString())) === query
    ) {
      setIsDropdownVisible(false); // Close if the exact match is found
    }
  }, [suggestions, key, query]);

  return {
    suggestions,
    isDropdownVisible,
  };
}

export default useSuggestions;
