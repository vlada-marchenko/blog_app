import { useBlogStore } from "@/store/blogStore";
import css from "./PostFilters.module.css";

type PostFitterProps = {
  tags: string[];
};

export default function PostFilters({ tags }: PostFitterProps) {
  const search = useBlogStore((state) => state.searchQuery);
  const selectedTag = useBlogStore((state) => state.tag);
  const setSearch = useBlogStore((state) => state.setSearchQuery);
  const setSelectedTag = useBlogStore((state) => state.setTag);

  return (
    <div className={css.filters}>
      <input
        className={css.input}
        type="text"
        value={search}
        placeholder="Type a search word"
        onChange={(e) => setSearch(e.target.value)}
      />
      {tags.length > 0 && (
        <div className={css.tags}>
          <button
            type="button"
            className={`${css.tag} ${selectedTag === null ? css.selected : ""}`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`${css.tag} ${selectedTag === tag ? css.selected : ""}`}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
