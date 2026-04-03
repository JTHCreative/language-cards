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

// Create a soft radial glow texture for nebula sprites
function createGlowTexture(size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const center = size / 2;
  const grd = ctx.createRadialGradient(center, center, 0, center, center, center);
  grd.addColorStop(0, 'rgba(255,255,255,0.6)');
  grd.addColorStop(0.15, 'rgba(255,255,255,0.3)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.12)');
  grd.addColorStop(0.6, 'rgba(255,255,255,0.03)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// Nebula clouds as sprites + star particles
function SpaceEnvironment() {
  const glowTexture = useMemo(() => createGlowTexture(), []);

  const nebulaData = useMemo(() => [
    { pos: [-30, 15, -30], color: '#3c64dc', scale: 55, opacity: 0.14 },
    { pos: [28, -8, -32], color: '#dc5032', scale: 60, opacity: 0.12 },
    { pos: [-5, 22, -38], color: '#ffb450', scale: 45, opacity: 0.1 },
    { pos: [-38, -15, -25], color: '#8c32b4', scale: 50, opacity: 0.11 },
    { pos: [35, 18, -30], color: '#288cdc', scale: 48, opacity: 0.12 },
    { pos: [15, -28, -34], color: '#c83c78', scale: 50, opacity: 0.09 },
    { pos: [-22, -28, -28], color: '#50b4dc', scale: 42, opacity: 0.09 },
    { pos: [25, 30, -28], color: '#a046c8', scale: 40, opacity: 0.1 },
    { pos: [-15, 5, -42], color: '#4060aa', scale: 65, opacity: 0.08 },
    { pos: [5, -10, -40], color: '#cc6040', scale: 52, opacity: 0.08 },
    { pos: [0, 0, -45], color: '#2a3a6a', scale: 80, opacity: 0.06 },
    { pos: [-30, 25, -35], color: '#cc8855', scale: 35, opacity: 0.07 },
  ], []);

  const starPositions = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 35 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      const b = 0.5 + Math.random() * 0.5;
      const temp = Math.random();
      if (temp < 0.1) {
        colors[i * 3] = b * 0.7; colors[i * 3 + 1] = b * 0.8; colors[i * 3 + 2] = b;
      } else if (temp < 0.18) {
        colors[i * 3] = b; colors[i * 3 + 1] = b * 0.9; colors[i * 3 + 2] = b * 0.7;
      } else {
        colors[i * 3] = b; colors[i * 3 + 1] = b; colors[i * 3 + 2] = b;
      }
    }
    return { positions, colors, count };
  }, []);

  return (
    <group>
      {/* Nebula glow sprites */}
      {nebulaData.map((n, i) => (
        <sprite key={i} position={n.pos} scale={[n.scale, n.scale, 1]}>
          <spriteMaterial
            map={glowTexture}
            color={n.color}
            transparent
            opacity={n.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}

      {/* Star particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.count}
            array={starPositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starPositions.count}
            array={starPositions.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation={false}
        />
      </points>
    </group>
  );
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

      <SpaceEnvironment />
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
        style={{ background: '#06090f' }}
      >
        <GlobeScene onSelectLanguage={onSelectLanguage} />
      </Canvas>
    </div>
  );
}
