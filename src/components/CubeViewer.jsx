

import { useEffect, useRef, memo } from "react";


let cubingLoaded = false;
const loadCubing = async () => {
  if (!cubingLoaded) {
    try {
      await import("cubing/twisty");
      cubingLoaded = true;
    } catch (e) {
      console.warn("cubing.js not loaded:", e);
    }
  }
};

const CubeViewer = memo(({
  alg = "",
  experimentalSetupAlg = "",
  background = "none",
  controlPanel = "none",
  visualization = "3D",
  hintFacelets = "floating",
  backView = "top-right",
  cameraLatitude = 25,
  cameraLongitude = -30,
  animationDuration = 1000,
  className = "",
  style = {},
}) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      await loadCubing();
      if (!mounted || !containerRef.current) return;

      
      const player = document.createElement("twisty-player");
      player.setAttribute("alg", alg);
      player.setAttribute("experimental-setup-alg", experimentalSetupAlg);
      player.setAttribute("background", background);
      player.setAttribute("control-panel", controlPanel);
      player.setAttribute("visualization", visualization);
      player.setAttribute("hint-facelets", hintFacelets);
      player.setAttribute("back-view", backView);
      player.setAttribute("camera-latitude", cameraLatitude);
      player.setAttribute("camera-longitude", cameraLongitude);

      player.style.width = "100%";
      player.style.height = "100%";

     
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(player);
      playerRef.current = player;
    };

    setup();
    return () => { mounted = false; };
  }, [alg, experimentalSetupAlg, visualization]);

  return (
    <div
      ref={containerRef}
      className={`cube-viewer ${className}`}
      style={{ width: "100%", height: "100%", minHeight: 200, ...style }}
    />
  );
});

CubeViewer.displayName = "CubeViewer";
export default CubeViewer;
