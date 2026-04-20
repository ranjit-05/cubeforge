import { useState, useCallback } from "react";
import { MdBookmark, MdPlayArrow, MdRemoveRedEye } from "react-icons/md";
import CubeViewer from "./CubeViewer";
import { difficultyColor } from "../data/algorithms";


const CAT_COLORS = { Beginner:"#009B48", F2L:"#FFD500", OLL:"#0051A2", PLL:"#BA0C2F" };

const AlgoCard = ({ algo, isSaved, onSave, onUnsave, onPractice }) => {
  const [showCube, setShowCube] = useState(false);
  const catColor = CAT_COLORS[algo.category] || "#555568";

  const handleSaveToggle = useCallback(() => {
    if (isSaved) onUnsave(algo.id);
    else onSave(algo);
  }, [isSaved, algo, onSave, onUnsave]);

  return (
    <div className="algo-card">
      <div className="algo-card-top" style={{background:catColor,color:catColor=="#FFD500"?"#000":"#fff"}}>
        {algo.category}
      </div>
      <div className="algo-card-body">
        <div className="algo-header">
          <div className="algo-meta">
            <span className="algo-difficulty" style={{color:difficultyColor[algo.difficulty]}}>{algo.difficulty}</span>
          </div>
          <div className="algo-actions">
            <button onClick={()=>setShowCube(v=>!v)} className={`btn-icon ${showCube?"active":""}`} title="3D Preview"><MdRemoveRedEye size={15}/></button>
            <button onClick={handleSaveToggle} className={`btn-icon ${isSaved?"saved":""}`} title={isSaved?"Unsave":"Save"}><MdBookmark size={15}/></button>
            {onPractice && <button onClick={()=>onPractice(algo)} className="btn-icon" title="Practice"><MdPlayArrow size={15}/></button>}
          </div>
        </div>
        <h3 className="algo-name">{algo.name}</h3>
        <p className="algo-description">{algo.description}</p>
        <div className="algo-moves">
          {algo.moves.split(" ").map((m,i)=><span key={i} className="algo-move-chip">{m}</span>)}
        </div>
        {showCube && (
          <div className="algo-cube-preview">
            <CubeViewer alg={algo.moves} experimentalSetupAlg={algo.setup||""} controlPanel="bottom-row" hintFacelets="floating" style={{height:200}}/>
          </div>
        )}
        <div className="algo-tags">
          {algo.tags.map(tag=><span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
    </div>
  );
};
export default AlgoCard;
