import { useState } from "preact/hooks";
import { TagModel } from "../../data/frontend/models/tag.model.ts";
import { TagComponent } from "../../components/shared/tag-component.tsx";

interface TagTypeaheadProps {
  allTags: TagModel[];
  initialSelectedTags: TagModel[];
  baseUrl: string;
}

export function TagTypeahead(
  { allTags, initialSelectedTags, baseUrl: _baseUrl }: TagTypeaheadProps,
) {
  const [selectedTags, setSelectedTags] = useState<TagModel[]>(
    initialSelectedTags,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredTags = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.some((selected) => selected.slug === tag.slug)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label htmlFor="tag-search">
          Search for tags:
        </label>
        <input
          id="tag-search"
          type="text"
          placeholder="Type to search tags..."
          value={searchTerm}
          onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
          style={{ width: "100%" }}
        />
      </div>

      {selectedTags.length > 0 && (
        <div>
          <h4>Selected Tags:</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {selectedTags.map((tag) => (
              <TagComponent
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
        <div>
          <h4>Available Tags:</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {filteredTags.slice(0, 10).map((tag) => (
              <TagComponent
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
