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

// Procedural starfield with nebula glows
function Starfield() {
  const starPositions = useMemo(() => {
    const positions = new Float32Array(8000 * 3);
    const colors = new Float32Array(8000 * 3);

    for (let i = 0; i < 8000; i++) {
      const radius = 40 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const temp = Math.random();
      if (temp < 0.12) {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 1.0;
      } else if (temp < 0.2) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 0.6;
      } else if (temp < 0.25) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 0.7;
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
      }
    }
    return { positions, colors };
  }, []);

  // Milky Way band
  const milkyWayPositions = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);

    for (let i = 0; i < 5000; i++) {
      const radius = 38 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.PI / 2 + (Math.random() - 0.5) * 0.35;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const brightness = 0.3 + Math.random() * 0.5;
      const tint = Math.random();
      if (tint < 0.3) {
        colors[i * 3] = brightness * 0.8; colors[i * 3 + 1] = brightness * 0.7; colors[i * 3 + 2] = brightness * 1.2;
      } else if (tint < 0.5) {
        colors[i * 3] = brightness * 1.1; colors[i * 3 + 1] = brightness * 0.85; colors[i * 3 + 2] = brightness * 1.0;
      } else {
        colors[i * 3] = brightness * 0.85; colors[i * 3 + 1] = brightness * 0.85; colors[i * 3 + 2] = brightness * 1.1;
      }
    }
    return { positions, colors };
  }, []);

  // Nebula glow definitions: position, color, size
  const nebulae = useMemo(() => [
    { pos: [30, 15, -25], color: '#4466cc', scale: 12, opacity: 0.06 },
    { pos: [-25, -10, 30], color: '#cc4488', scale: 10, opacity: 0.05 },
    { pos: [15, -30, -20], color: '#8844aa', scale: 14, opacity: 0.04 },
    { pos: [-35, 20, 10], color: '#44aacc', scale: 9, opacity: 0.05 },
    { pos: [20, 25, 30], color: '#cc8844', scale: 8, opacity: 0.06 },
    { pos: [-10, -25, -35], color: '#aa44cc', scale: 11, opacity: 0.04 },
    { pos: [35, -5, 15], color: '#4488aa', scale: 10, opacity: 0.05 },
    { pos: [-20, 30, -25], color: '#cc6688', scale: 7, opacity: 0.05 },
  ], []);

  return (
    <group>
      {/* Main stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={8000}
            array={starPositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={8000}
            array={starPositions.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* Milky Way band */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={5000}
            array={milkyWayPositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={5000}
            array={milkyWayPositions.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Nebula glows - soft colored spheres in the background */}
      {nebulae.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.scale, 16, 16]} />
          <meshBasicMaterial
            color={n.color}
            transparent
            opacity={n.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
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

      <Starfield />
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
