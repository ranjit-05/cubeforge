import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { saveAlgorithm, getSavedAlgorithms, deleteSavedAlgorithm } from "../services/firestoreService";
import { algorithms, ALGORITHM_CATEGORIES } from "../data/algorithms";
import AlgoCard from "../components/AlgoCard";
import { MdSearch, MdFilterList, MdBookmark } from "react-icons/md";

const Algorithms = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [savedAlgos, setSavedAlgos] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getSavedAlgorithms(user.uid);
        setSavedAlgos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const savedIds = useMemo(
    () => new Set(savedAlgos.map((s) => s.algoId)),
    [savedAlgos]
  );

  const filtered = useMemo(() => {
    return algorithms.filter((algo) => {
      const matchesSearch =
        !search ||
        algo.name.toLowerCase().includes(search.toLowerCase()) ||
        algo.moves.toLowerCase().includes(search.toLowerCase()) ||
        algo.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "All" || algo.category === category;
      const matchesDifficulty = difficulty === "All" || algo.difficulty === difficulty;
      const matchesSaved = !showSavedOnly || savedIds.has(algo.id);
      return matchesSearch && matchesCategory && matchesDifficulty && matchesSaved;
    });
  }, [search, category, difficulty, showSavedOnly, savedIds]);

  const handleSave = useCallback(async (algo) => {
    if (!user) return;
    try {
      const doc = await saveAlgorithm(user.uid, { algoId: algo.id, name: algo.name });
      setSavedAlgos((prev) => [...prev, { id: doc.id, algoId: algo.id, name: algo.name }]);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const handleUnsave = useCallback(async (algoId) => {
    const found = savedAlgos.find((s) => s.algoId === algoId);
    if (!found) return;
    try {
      await deleteSavedAlgorithm(found.id);
      setSavedAlgos((prev) => prev.filter((s) => s.algoId !== algoId));
    } catch (e) {
      console.error(e);
    }
  }, [savedAlgos]);

  return (
    <div className="page algo-page">
      <div className="page-header">
        <h1>Algorithm Library</h1>
        <p>{algorithms.length} algorithms across Beginner, F2L, OLL, PLL</p>
      </div>

      <div className="algo-filters">
        <div className="search-wrap">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, moves, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label><MdFilterList size={13} /> Category</label>
            <div className="pill-group">
              {["All", ...ALGORITHM_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  className={`pill ${category === cat ? "active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Difficulty</label>
            <div className="pill-group">
              {["All", "Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d}
                  className={`pill ${difficulty === d ? "active" : ""}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            className={`pill saved-filter ${showSavedOnly ? "active" : ""}`}
            onClick={() => setShowSavedOnly((v) => !v)}
          >
            <MdBookmark size={13} />
            {showSavedOnly ? `Saved (${savedIds.size})` : "Show Saved"}
          </button>
        </div>
      </div>

      <div className="algo-count">
        Showing {filtered.length} of {algorithms.length} algorithms
        {showSavedOnly && savedIds.size === 0 && (
          <span className="no-saved-hint"> — Save some algorithms to see them here</span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <MdSearch size={40} opacity={0.3} />
          <p>No algorithms match your filters.</p>
          <button className="btn-outline" onClick={() => { setSearch(""); setCategory("All"); setDifficulty("All"); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="algo-grid">
          {filtered.map((algo) => (
            <AlgoCard
              key={algo.id}
              algo={algo}
              isSaved={savedIds.has(algo.id)}
              onSave={handleSave}
              onUnsave={handleUnsave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Algorithms;
