import { useState } from "preact/hooks";
import { TagModel } from "../../data/frontend/models/tag.model.ts";
import { TagComponent } from "../../components/shared/tag-component.tsx";

interface TagTypeaheadProps {
  allTags: TagModel[];
  initialSelectedTags: TagModel[];
}

export function TagTypeahead(
  { allTags, initialSelectedTags }: TagTypeaheadProps,
) {
  const [selectedTags, setSelectedTags] = useState<TagModel[]>(
    initialSelectedTags,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false);

  // Create suggestion tags by finding matching real tags
  const suggestionSlugs = [
    "clamshell",
    "anbernic",
    "linux",
    "oled",
    "year-2025",
    "upcoming",
  ];
  const suggestionTags: TagModel[] = suggestionSlugs
    .map((slug) => allTags.find((tag) => tag.slug.toLowerCase() === slug))
    .filter((tag): tag is TagModel => tag !== undefined)
    .filter((tag) =>
      !selectedTags.some((selected) => selected.slug === tag.slug)
    );

  const filteredTags = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.some((selected) => selected.slug === tag.slug)
  );

  const getDivStyle = () => {
    if (isFocused) {
      return {
        paddingTop: "1rem",
        display: "flex",
        flexDirection: "column",
      };
    }
    return {};
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{ paddingTop: "1rem" }}
      >
        <input
          id="tag-search"
          type="text"
          placeholder="Type to search for tags..."
          value={searchTerm}
          onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsAnimatingOut(true);
            setTimeout(() => {
              setIsFocused(false);
              setIsAnimatingOut(false);
            }, 250);
          }}
          style={{ width: "100%" }}
        />
      </div>

      {isFocused && !searchTerm && (
        <div
          style={{
            animation: isAnimatingOut
              ? "fadeOut 0.25s ease-in"
              : "slideIn 0.5s ease-in",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {suggestionTags.map((tag) => (
              <TagComponent
                key={tag.id}
                tag={tag}
                tagType="add"
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            ))}
          </div>
        </div>
      )}

      {selectedTags.length > 0 && (
        <div style={getDivStyle()}>
          <h4>Selected Tags:</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {selectedTags.map((tag) => (
              <TagComponent
                key={tag.id}
                tag={tag}
                tagType="remove"
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            ))}
          </div>
        </div>
      )}

      {searchTerm && filteredTags.length > 0 && (
        <div style={{ paddingTop: "1rem" }}>
          <h4>Available Tags:</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {filteredTags.slice(0, 10).map((tag) => (
              <TagComponent
                key={tag.id}
                tag={tag}
                tagType="add"
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
