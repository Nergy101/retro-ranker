import { PiTag, PiX } from "@preact-icons/pi";
import { useState } from "preact/hooks";
import { TagModel } from "../../data/frontend/models/tag.model.ts";
import { TagComponent } from "../../components/shared/tag-component.tsx";

interface TagTypeaheadProps {
  allTags: TagModel[];
  initialSelectedTags: TagModel[];
  baseUrl: string;
  translations?: Record<string, string>;
}

export function TagTypeahead(
  { allTags, initialSelectedTags, baseUrl, translations = {} }:
    TagTypeaheadProps,
) {
  const [selectedTags, setSelectedTags] = useState<TagModel[]>(
    initialSelectedTags,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const getTranslation = (key: string, fallback: string) => {
    return translations[key] || fallback;
  };

  const filteredTags = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.some((selected) => selected.slug === tag.slug)
  );

  const addTag = (tag: TagModel) => {
    const newSelectedTags = [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    updateUrl(newSelectedTags);
  };

  const removeTag = (tagToRemove: TagModel) => {
    const newSelectedTags = selectedTags.filter(
      (tag) => tag.slug !== tagToRemove.slug,
    );
    setSelectedTags(newSelectedTags);
    updateUrl(newSelectedTags);
  };

  const updateUrl = (tags: TagModel[]) => {
    const url = new URL(globalThis.location.href);
    if (tags.length > 0) {
      url.searchParams.set("tags", tags.map((tag) => tag.slug).join(","));
    } else {
      url.searchParams.delete("tags");
    }
    url.searchParams.set("page", "1");
    globalThis.location.href = url.toString();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label htmlFor="tag-search">
          {getTranslation("forms.tags.search", "Search for tags:")}
        </label>
        <input
          id="tag-search"
          type="text"
          placeholder={getTranslation(
            "forms.tags.placeholder",
            "Type to search tags...",
          )}
          value={searchTerm}
          onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
          style={{ width: "100%" }}
        />
      </div>

      {selectedTags.length > 0 && (
        <div>
          <h4>{getTranslation("forms.tags.selected", "Selected Tags:")}</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {selectedTags.map((tag) => (
              <div
                key={tag.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "var(--pico-primary)",
                  color: "var(--pico-primary-inverse)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                }}
              >
                <TagComponent tag={tag} />
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label={`Remove ${tag.name} tag`}
                >
                  <PiX size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchTerm && filteredTags.length > 0 && (
        <div>
          <h4>{getTranslation("forms.tags.available", "Available Tags:")}</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {filteredTags.slice(0, 10).map((tag) => (
              <button
                key={tag.slug}
                type="button"
                onClick={() => addTag(tag)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "var(--pico-secondary)",
                  color: "var(--pico-secondary-inverse)",
                  border: "1px solid var(--pico-secondary-border)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                }}
              >
                <PiTag size={14} />
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
