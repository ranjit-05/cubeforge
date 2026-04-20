import { useState, useMemo, useRef } from "react";
import { algorithms } from "../data/algorithms";
import CubeViewer from "../components/CubeViewer";
import { MdChevronLeft, MdChevronRight, MdCheckCircle, MdRefresh } from "react-icons/md";

const FaceTile = ({ color }) => (
  <div style={{ width:36, height:36, borderRadius:5, background:color,
    border:"2px solid rgba(0,0,0,0.5)", boxShadow:"inset 0 2px 4px rgba(255,255,255,0.15)"}} />
);
const FaceGrid = ({ pattern, label }) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
    {label && <div style={{fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:".08em",color:"#555568"}}>{label}</div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,36px)",gap:4,padding:6,background:"#0f0f12",borderRadius:8,border:"2.5px solid #2e2e3e"}}>
      {pattern.map((c,i)=><FaceTile key={i} color={c}/>)}
    </div>
  </div>
);

const R="#BA0C2F", O="#FF5800", Y="#FFD500", G="#009B48", B="#0051A2", W="#F0EFE0", X="#333";

const ModuleVisual = ({ id }) => {
  const visuals = {
    beginner: (
      <div style={{display:"flex",gap:16,alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}>
        <FaceGrid label="Scrambled" pattern={[R,Y,B,G,O,W,Y,R,G]} />
        <div style={{fontSize:28,color:"#FFD500",fontWeight:900}}>→</div>
        <FaceGrid label="Solved!" pattern={[W,W,W,W,W,W,W,W,W]} />
      </div>
    ),
    f2l: (
      <div style={{display:"flex",gap:12,alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <FaceGrid label="Top" pattern={[Y,Y,Y,Y,Y,Y,Y,Y,Y]}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,28px)",gap:3,padding:4,background:"#0f0f12",borderRadius:6,border:"2px solid #2e2e3e"}}>
            {[W,W,W, W,W,W].map((c,i)=><div key={i} style={{width:28,height:28,background:c,borderRadius:3,border:"1.5px solid rgba(0,0,0,0.4)"}}/>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,28px)",gap:3,padding:4,background:"#0f0f12",borderRadius:6,border:"2px solid #2e2e3e"}}>
            {[W,W,W,W,W,W].map((c,i)=><div key={i} style={{width:28,height:28,background:c,borderRadius:3,border:"1.5px solid rgba(0,0,0,0.4)"}}/>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,28px)",gap:3,padding:4,background:"#0f0f12",borderRadius:6,border:"2px solid #2e2e3e",opacity:.4}}>
            {[X,X,X,X,X,X].map((c,i)=><div key={i} style={{width:28,height:28,background:c,borderRadius:3}}/>)}
          </div>
          <div style={{textAlign:"center",fontSize:10,fontWeight:900,color:"#555568",letterSpacing:".06em",textTransform:"uppercase"}}>Layers</div>
        </div>
      </div>
    ),
    oll: (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{fontSize:12,fontWeight:900,textTransform:"uppercase",letterSpacing:".08em",color:"#555568",marginBottom:4}}>OLL Cases</div>
        <div style={{display:"flex",gap:12}}>
          <FaceGrid label="Dot" pattern={[X,Y,X,Y,Y,Y,X,Y,X]}/>
          <FaceGrid label="Line" pattern={[X,X,X,Y,Y,Y,X,X,X]}/>
          <FaceGrid label="Cross" pattern={[X,Y,X,Y,Y,Y,X,Y,X]}/>
        </div>
      </div>
    ),
    pll: (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{fontSize:12,fontWeight:900,textTransform:"uppercase",letterSpacing:".08em",color:"#555568",marginBottom:4}}>PLL — U Perm</div>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <FaceGrid label="Before" pattern={[Y,Y,Y,Y,Y,Y,Y,Y,Y]}/>
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
            <div style={{width:32,height:2,background:"#FFD500"}}/>
            <div style={{fontSize:10,color:"#FFD500",fontWeight:900}}>U PERM</div>
            <div style={{width:32,height:2,background:"#FFD500"}}/>
          </div>
          <FaceGrid label="After" pattern={[Y,Y,Y,Y,Y,Y,Y,Y,Y]}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          {[R,G,B,O].map((c,i)=>(<div key={i} style={{display:"flex",gap:3}}>
            {[c,c,c].map((cc,j)=>(<div key={j} style={{width:20,height:16,background:j===1&&i<2?[G,B,R,O][i]:cc,borderRadius:2,border:"1px solid rgba(0,0,0,0.3)"}}/>))}
          </div>))}
        </div>
      </div>
    ),
  };
  return visuals[id] || null;
};

const StepVisual = ({ moduleId, stepIndex }) => {
  const visuals = {
    "beginner-0": <div style={{display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
      <div style={{fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:".08em",color:"#555568"}}>Build a cross on white</div>
      <FaceGrid pattern={[X,W,X,W,W,W,X,W,X]}/>
      <div style={{fontSize:11,color:"#909090",fontWeight:700,textAlign:"center",maxWidth:180}}>4 white edges touching the white center</div>
    </div>,
    "beginner-1": <FaceGrid label="White layer complete" pattern={[W,W,W,W,W,W,W,W,W]}/>,
    "beginner-2": <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
      <FaceGrid label="Second layer" pattern={[X,X,X,X,X,X,X,X,X]}/>
      <div style={{display:"flex",gap:4}}>
        {[R,G,B,O].map((c,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"repeat(3,18px)",gap:2,padding:3,background:"#111",borderRadius:5,border:"1.5px solid #333"}}>
          {Array(9).fill(c).map((cc,j)=><div key={j} style={{width:18,height:18,background:cc,borderRadius:2,border:"1px solid rgba(0,0,0,0.3)"}}/>)}
        </div>)}
      </div>
    </div>,
    "beginner-3": <FaceGrid label="Yellow cross" pattern={[X,Y,X,Y,Y,Y,X,Y,X]}/>,
    "beginner-4": <FaceGrid label="All yellow up" pattern={[Y,Y,Y,Y,Y,Y,Y,Y,Y]}/>,
    "beginner-5": <FaceGrid label="Corners placed" pattern={[Y,Y,Y,Y,Y,Y,Y,Y,Y]}/>,
    "beginner-6": <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
      <FaceGrid label="Solved!" pattern={[Y,Y,Y,Y,Y,Y,Y,Y,Y]}/>
      <div style={{fontSize:22,color:"#FFD500"}}>🏆</div>
    </div>,
    "f2l-0": <div style={{display:"flex",gap:10,alignItems:"center"}}>
      <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
        <div style={{fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:".06em",color:"#555568"}}>Corner</div>
        <div style={{width:36,height:36,background:R,borderRadius:5,border:"2px solid rgba(0,0,0,0.4)"}}/>
      </div>
      <div style={{fontSize:24,color:"#FFD500",fontWeight:900}}>+</div>
      <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
        <div style={{fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:".06em",color:"#555568"}}>Edge</div>
        <div style={{width:36,height:36,background:G,borderRadius:5,border:"2px solid rgba(0,0,0,0.4)"}}/>
      </div>
      <div style={{fontSize:24,color:"#FFD500",fontWeight:900}}>→</div>
      <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
        <div style={{fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:".06em",color:"#555568"}}>Pair!</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,36px)",gap:3}}>
          <div style={{width:36,height:36,background:R,borderRadius:5,border:"2px solid rgba(0,0,0,0.4)"}}/>
          <div style={{width:36,height:36,background:G,borderRadius:5,border:"2px solid rgba(0,0,0,0.4)"}}/>
        </div>
      </div>
    </div>,
  };
  const key = `${moduleId}-${stepIndex}`;
  return visuals[key] || (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",opacity:.3}}>
      <div style={{fontSize:48}}>⬛</div>
    </div>
  );
};

const MODULES = [
  { id:"beginner", title:"Beginner's Method", icon:"🟢", color:"#009B48",
    desc:"Learn to solve the Rubik's cube layer by layer. Perfect starting point.",
    steps:[
      {title:"White Cross",desc:"Form a white cross on the bottom face.",tip:"Think of white edges as a daisy first — bring them to the top, then flip down.",algoIds:["beg-1"]},
      {title:"White Corners",desc:"Insert white corner pieces to complete the white face.",tip:"Find the white corner above its slot. R U R' U' until it drops in.",algoIds:["beg-2"]},
      {title:"Second Layer Edges",desc:"Insert middle-layer edges using left/right insert algorithms.",tip:"No yellow on the edge? It belongs in the second layer.",algoIds:["beg-3","beg-4"]},
      {title:"Yellow Cross",desc:"Create a yellow cross on top. Shape goes dot → L → line → cross.",tip:"Apply F R U R' U' F' until the cross appears.",algoIds:["beg-5"]},
      {title:"Orient Yellow Corners",desc:"Twist yellow corners so all face up.",tip:"Hold a non-yellow corner at front-right. Apply Sune, rotate U, repeat.",algoIds:["beg-6"]},
      {title:"Permute Corners",desc:"Move corners to correct positions.",tip:"Find two correct corners at back. Face the front and apply the cycle.",algoIds:["beg-7"]},
      {title:"Permute Edges (Finish!)",desc:"Cycle the last edges to complete the cube!",tip:"Find the solved edge, hold it at back, and run the edge cycle.",algoIds:["beg-8"]},
    ]
  },
  { id:"f2l", title:"F2L — First Two Layers", icon:"🟡", color:"#FFD500",
    desc:"Combine white cross, corners, and second layer into one fast step.",
    steps:[
      {title:"What is F2L?",desc:"F2L pairs a corner and edge, then inserts them together into the correct slot.",tip:"Think of it like building a Lego block — snap the pair together, then insert.",algoIds:[]},
      {title:"Basic Right Insert",desc:"Corner and edge aligned on the right side — most common case.",tip:"R U R' is the fundamental trigger. Practice until automatic.",algoIds:["f2l-1"]},
      {title:"Basic Left Insert",desc:"Mirror of the right insert — for left-side slots.",tip:"L' U' L — exact mirror of the right insert.",algoIds:["f2l-2"]},
      {title:"The Sexy Move",desc:"R U R' U' — the most important 4-move sequence in all of speedcubing.",tip:"Apply multiple times to cycle pieces without breaking what's solved.",algoIds:["f2l-5"]},
      {title:"Complex Cases",desc:"Handle cases where pieces are split or in the wrong slot.",tip:"First pair them up on the U face, then insert together.",algoIds:["f2l-3","f2l-4"]},
    ]
  },
  { id:"oll", title:"OLL — Orient Last Layer", icon:"🔵", color:"#0051A2",
    desc:"Make the entire top face yellow in a single algorithm.",
    steps:[
      {title:"What is OLL?",desc:"OLL makes all 9 yellow stickers face up in one step. There are 57 cases.",tip:"Beginners use 2-look OLL: first make a cross, then orient corners.",algoIds:[]},
      {title:"Yellow Cross (Edges)",desc:"Start by making a yellow cross on top using the front trigger.",tip:"Dot → 2 moves. L-shape → 1 move. Line → 1 move. Identify your case first.",algoIds:["oll-5","oll-7"]},
      {title:"Sune & Anti-Sune",desc:"Two most important OLL algs — cover most corner cases.",tip:"Sune: R U R' U R U2 R'. Anti-Sune is the mirror.",algoIds:["oll-2","oll-3"]},
      {title:"Common OLL Cases",desc:"T, F, and dot shapes — very frequently encountered.",tip:"Identify the shape on top before applying. Recognition is the skill.",algoIds:["oll-4","oll-1"]},
    ]
  },
  { id:"pll", title:"PLL — Permute Last Layer", icon:"🔴", color:"#BA0C2F",
    desc:"Move all top pieces to their correct positions to finish the solve.",
    steps:[
      {title:"What is PLL?",desc:"PLL moves pieces to correct spots while keeping all yellow facing up. 21 cases.",tip:"Look for a solved side — it tells you exactly which PLL you have.",algoIds:[]},
      {title:"U Perms",desc:"Cycles 3 edges — the most common PLL you'll see.",tip:"Ua cycles counterclockwise. Ub cycles clockwise. Check the edges.",algoIds:["pll-1","pll-2"]},
      {title:"T & Y Perms",desc:"Diagonal and adjacent swaps of corners + edges simultaneously.",tip:"T perm: one bar of matching colors on one side. Y perm: no bars.",algoIds:["pll-3","pll-4"]},
      {title:"Z & H Perms",desc:"Symmetric cases using M slice moves.",tip:"H: all 4 edges swap in pairs. Z: adjacent pairs swap. Both use M moves.",algoIds:["pll-7","pll-8"]},
    ]
  },
];

const Training = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cubeforge_training") || "{}"); }
    catch { return {}; }
  });

  const currentModule = useMemo(() => MODULES.find(m=>m.id===activeModule), [activeModule]);
  const currentStep = currentModule?.steps[stepIndex];

  const stepAlgos = useMemo(() => {
    if (!currentStep?.algoIds?.length) return [];
    return algorithms.filter(a => currentStep.algoIds.includes(a.id));
  }, [currentStep]);

  const markComplete = (modId, idx) => {
    const updated = { ...completed, [`${modId}-${idx}`]: true };
    setCompleted(updated);
    localStorage.setItem("cubeforge_training", JSON.stringify(updated));
  };
  const isStepDone = (modId, idx) => completed[`${modId}-${idx}`] === true;
  const moduleProgress = (modId) => {
    const mod = MODULES.find(m=>m.id===modId);
    if (!mod) return 0;
    const done = mod.steps.filter((_,i)=>isStepDone(modId,i)).length;
    return Math.round(done/mod.steps.length*100);
  };

  if (activeModule && currentModule) {
    return (
      <div className="page training-page">
        <button className="back-btn" onClick={()=>{setActiveModule(null);setStepIndex(0);}}>
          <MdChevronLeft/> All Modules
        </button>

        <div className="training-header" style={{borderColor:currentModule.color}}>
          <h1>{currentModule.icon} {currentModule.title}</h1>
          <div className="training-progress-bar">
            <div className="training-progress-fill" style={{width:`${((stepIndex+1)/currentModule.steps.length)*100}%`,background:currentModule.color}}/>
          </div>
          <p>Step {stepIndex+1} of {currentModule.steps.length} — {currentModule.steps[stepIndex]?.title}</p>
        </div>

        <div className="step-tabs">
          {currentModule.steps.map((s,i)=>(
            <button key={i} className={`step-tab ${i===stepIndex?"active":""} ${isStepDone(activeModule,i)?"done":""}`}
              style={{borderColor:i===stepIndex?currentModule.color:"transparent"}}
              onClick={()=>setStepIndex(i)}>
              {isStepDone(activeModule,i)?<MdCheckCircle size={14}/>:i+1}
            </button>
          ))}
        </div>

        {currentStep && (
          <div className="step-visual-card">
            <div className="step-visual-top">
              <div className="step-visual-image" style={{background:`${currentModule.color}11`}}>
                <StepVisual moduleId={activeModule} stepIndex={stepIndex}/>
              </div>
              <div className="step-visual-content">
                <div style={{fontSize:12,fontWeight:900,textTransform:"uppercase",letterSpacing:".1em",color:currentModule.color,marginBottom:6}}>
                  Step {stepIndex+1}
                </div>
                <h2>{currentStep.title}</h2>
                <p>{currentStep.desc}</p>
                <div className="step-tip-box">
                  <strong>💡 Pro Tip:</strong> {currentStep.tip}
                </div>
              </div>
            </div>

            {stepAlgos.length > 0 && (
              <div className="step-algo-section">
                <h3>Algorithms for this step</h3>
                {stepAlgos.map(algo=>(
                  <div key={algo.id} className="step-algo-row">
                    <div className="step-algo-info">
                      <strong>{algo.name}</strong>
                      <p>{algo.description}</p>
                      <div className="algo-moves" style={{marginTop:10}}>
                        {algo.moves.split(" ").map((m,i)=>(
                          <span key={i} className="algo-move-chip">{m}</span>
                        ))}
                      </div>
                    </div>
                    <div className="step-algo-cube">
                      <CubeViewer alg={algo.moves} experimentalSetupAlg={algo.setup||""} controlPanel="bottom-row" hintFacelets="floating" style={{height:180}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="step-controls">
              <button className="btn-outline" onClick={()=>setStepIndex(i=>Math.max(0,i-1))} disabled={stepIndex===0}>
                <MdChevronLeft/> Previous
              </button>
              <button className="btn-success" onClick={()=>{markComplete(activeModule,stepIndex);if(stepIndex<currentModule.steps.length-1)setStepIndex(i=>i+1);}}>
                <MdCheckCircle/> Mark Done
              </button>
              <button className="btn-outline" onClick={()=>setStepIndex(i=>Math.min(currentModule.steps.length-1,i+1))} disabled={stepIndex===currentModule.steps.length-1}>
                Next <MdChevronRight/>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page training-page">
      <div className="page-header">
        <h1>Training Modules</h1>
        <p>Structured learning paths with visual step-by-step guides — beginner to advanced</p>
      </div>

      <div className="modules-grid">
        {MODULES.map(mod => {
          const prog = moduleProgress(mod.id);
          return (
            <div key={mod.id} className="module-card" onClick={()=>{setActiveModule(mod.id);setStepIndex(0);}}>
              <div className="module-card-image" style={{background:`${mod.color}18`}}>
                <ModuleVisual id={mod.id}/>
              </div>
              <div className="module-card-body">
                <div style={{fontSize:12,fontWeight:900,textTransform:"uppercase",letterSpacing:".1em",color:mod.color,marginBottom:6}}>
                  {mod.steps.length} steps
                </div>
                <h2>{mod.icon} {mod.title}</h2>
                <p>{mod.desc}</p>
                <div className="module-meta">
                  <span>{mod.steps.filter((_,i)=>isStepDone(mod.id,i)).length}/{mod.steps.length} complete</span>
                  <span>{prog}%</span>
                </div>
                <div className="module-prog-bar">
                  <div className="module-prog-fill" style={{width:`${prog}%`,background:mod.color}}/>
                </div>
                <button className="module-start-btn" style={{background:`${mod.color}18`,color:mod.color,borderColor:`${mod.color}44`}}>
                  {prog===100?"Review":prog>0?"Continue":"Start Learning"} <MdChevronRight size={16}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{marginTop:56}}>
        <div className="section-label">How it works</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
          {[
            {num:"01",color:"#BA0C2F",title:"Choose a module",desc:"Pick your skill level — Beginner, F2L, OLL, or PLL."},
            {num:"02",color:"#FFD500",title:"Follow visual steps",desc:"Each step shows a cube diagram + algorithm with a live 3D viewer."},
            {num:"03",color:"#009B48",title:"Mark steps done",desc:"Track your progress. Come back anytime to review completed steps."},
          ].map(s=>(
            <div key={s.num} style={{background:"var(--bg2)",border:"2px solid var(--border)",borderRadius:16,padding:22,display:"flex",flexDirection:"column",gap:12}}>
              <div style={{fontSize:36,fontWeight:900,color:s.color,opacity:.6,fontFamily:"'JetBrains Mono',monospace"}}>{s.num}</div>
              <div style={{fontSize:16,fontWeight:900}}>{s.title}</div>
              <div style={{fontSize:13,color:"#909090",fontWeight:600,lineHeight:1.6}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:"center",marginTop:32}}>
        <button className="btn-outline" onClick={()=>{setCompleted({});localStorage.removeItem("cubeforge_training");}}>
          <MdRefresh size={14}/> Reset All Progress
        </button>
      </div>
    </div>
  );
};
export default Training;
