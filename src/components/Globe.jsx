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

// No Three.js skybox — nebula is rendered as a CSS background behind the transparent canvas

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

const spaceBackground = {
  width: '100%',
  height: '100%',
  position: 'relative',
  background: [
    'radial-gradient(ellipse at 25% 45%, rgba(60,100,220,0.3) 0%, transparent 50%)',
    'radial-gradient(ellipse at 70% 35%, rgba(220,80,50,0.25) 0%, transparent 45%)',
    'radial-gradient(ellipse at 50% 50%, rgba(255,180,80,0.15) 0%, transparent 35%)',
    'radial-gradient(ellipse at 15% 70%, rgba(140,50,180,0.18) 0%, transparent 45%)',
    'radial-gradient(ellipse at 80% 20%, rgba(40,140,220,0.2) 0%, transparent 40%)',
    'radial-gradient(ellipse at 60% 75%, rgba(200,60,120,0.15) 0%, transparent 40%)',
    'radial-gradient(ellipse at 35% 20%, rgba(80,180,220,0.12) 0%, transparent 40%)',
    'radial-gradient(ellipse at 90% 60%, rgba(160,70,200,0.15) 0%, transparent 35%)',
    'radial-gradient(ellipse at 45% 40%, rgba(255,150,50,0.1) 0%, transparent 30%)',
    '#06090f',
  ].join(', '),
};

export default function Globe({ onSelectLanguage }) {
  return (
    <div style={spaceBackground}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent', position: 'absolute', inset: 0 }}
        gl={{ alpha: true }}
      >
        <GlobeScene onSelectLanguage={onSelectLanguage} />
      </Canvas>
    </div>
  );
}
