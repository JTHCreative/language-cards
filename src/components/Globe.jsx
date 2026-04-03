import { useMemo, useState, useRef, useCallback, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getAllLanguages } from '../data/languages';
import Flag from './Flag';

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function EarthGlobe() {
  const texture = useTexture(`${import.meta.env.BASE_URL}textures/earth.jpg`);

  return (
    <Sphere args={[2, 64, 64]}>
      <meshStandardMaterial
        map={texture}
        roughness={0.6}
        metalness={0.05}
      />
    </Sphere>
  );
}

// Generate nebula texture on a canvas
function generateNebulaTexture(width = 2048, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Dark base
  ctx.fillStyle = '#06090f';
  ctx.fillRect(0, 0, width, height);

  // Large nebula clouds — use full-canvas fillRect so no edges
  const clouds = [
    { x: 0.25, y: 0.45, r: 0.4, c: [60, 100, 220], a: 0.3 },
    { x: 0.72, y: 0.38, r: 0.42, c: [220, 80, 50], a: 0.25 },
    { x: 0.48, y: 0.48, r: 0.28, c: [255, 180, 80], a: 0.18 },
    { x: 0.15, y: 0.72, r: 0.35, c: [140, 50, 180], a: 0.18 },
    { x: 0.82, y: 0.22, r: 0.3, c: [40, 140, 220], a: 0.2 },
    { x: 0.58, y: 0.73, r: 0.25, c: [200, 60, 120], a: 0.15 },
    { x: 0.35, y: 0.22, r: 0.26, c: [80, 180, 220], a: 0.14 },
    { x: 0.88, y: 0.58, r: 0.22, c: [160, 70, 200], a: 0.16 },
    { x: 0.5, y: 0.3, r: 0.2, c: [255, 140, 50], a: 0.1 },
  ];

  clouds.forEach(n => {
    const grd = ctx.createRadialGradient(
      n.x * width, n.y * height, 0,
      n.x * width, n.y * height, n.r * Math.max(width, height)
    );
    grd.addColorStop(0, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${n.a})`);
    grd.addColorStop(0.4, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${n.a * 0.3})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  });

  // Stars — single pixel dots
  for (let i = 0; i < 3000; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const b = 0.2 + Math.random() * 0.8;
    ctx.fillStyle = `rgba(255,255,255,${b})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // Brighter stars
  for (let i = 0; i < 150; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    ctx.fillStyle = `rgba(255,255,255,${0.6 + Math.random() * 0.4})`;
    ctx.fillRect(x, y, 2, 1);
    ctx.fillRect(x, y, 1, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

// Set the scene background to the nebula texture (no geometry, no grid)
function SpaceBackground() {
  const { scene } = useThree();
  const texture = useMemo(() => generateNebulaTexture(), []);

  useMemo(() => {
    scene.background = texture;
  }, [scene, texture]);

  return null;
}

// Atmospheric glow around the globe
function Atmosphere() {
  return (
    <Sphere args={[2.06, 64, 64]}>
      <meshBasicMaterial
        color="#4488ff"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </Sphere>
  );
}

const LanguageFlag = memo(function LanguageFlag({ language, onClick, zoomScale = 1 }) {
  const [hovered, setHovered] = useState(false);
  const coords = language.data?.coordinates || language.coordinates;
  const name = language.data?.languageName || language.languageName;
  const country = language.data?.country || language.country;
  const available = language.available;
  const flagCode = language.flagCode;

  const position = useMemo(
    () => latLngToVector3(coords.lat, coords.lng, 2.08),
    [coords]
  );

  const baseSize = Math.round(22 * zoomScale);
  const hoverSize = Math.round(28 * zoomScale);

  return (
    <group position={position}>
      <Html center>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => available && onClick(language)}
          style={{
            cursor: available ? 'pointer' : 'default',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: 'none',
          }}
        >
          {/* Flag */}
          <div
            style={{
              transition: 'all 0.2s ease',
              filter: available ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' : 'grayscale(0.6) opacity(0.6)',
              transform: hovered ? 'translateY(-4px) scale(1.3)' : 'none',
            }}
          >
            <Flag code={flagCode} size={`${hovered ? hoverSize : baseSize}px`} />
          </div>

          {/* Tooltip on hover */}
          {hovered && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                marginTop: '4px',
                background: available
                  ? 'rgba(59, 130, 246, 0.9)'
                  : 'rgba(107, 114, 128, 0.9)',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                pointerEvents: 'none',
              }}
            >
              <div>{name}</div>
              <div style={{ fontSize: '10px', opacity: 0.8, fontWeight: 400 }}>
                {country}
                {!available && ' (Coming Soon)'}
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
});

// Track camera distance and map to a zoom scale (1.0 at max distance, 1.5 at min distance)
function useZoomScale(minDist = 3, maxDist = 8) {
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const { camera } = useThree();

  useFrame(() => {
    const dist = camera.position.length();
    const t = 1 - (Math.min(Math.max(dist, minDist), maxDist) - minDist) / (maxDist - minDist);
    const newScale = 1 + t * 0.5;
    if (Math.abs(scaleRef.current - newScale) > 0.02) {
      scaleRef.current = newScale;
      setScale(newScale);
    }
  });

  return scale;
}

function GlobeScene({ onSelectLanguage }) {
  const languages = getAllLanguages();
  const zoomScale = useZoomScale(3, 8);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <directionalLight position={[-5, -2, -5]} intensity={0.6} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      <SpaceBackground />
      <EarthGlobe />
      <Atmosphere />

      {languages.map((lang) => (
        <LanguageFlag
          key={lang.id}
          language={lang}
          onClick={onSelectLanguage}
          zoomScale={zoomScale}
        />
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        rotateSpeed={0.5}
        dampingFactor={0.1}
        enableDamping
      />
    </>
  );
}

export default function Globe({ onSelectLanguage }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <GlobeScene onSelectLanguage={onSelectLanguage} />
      </Canvas>
    </div>
  );
}
