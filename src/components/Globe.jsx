import { useMemo, useState, useRef, useCallback } from 'react';
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
  const texture = useTexture('/textures/earth.jpg');

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

// Procedural starfield - thousands of star particles
function Starfield() {
  const starPositions = useMemo(() => {
    const positions = new Float32Array(8000 * 3);
    const colors = new Float32Array(8000 * 3);
    const sizes = new Float32Array(8000);

    for (let i = 0; i < 8000; i++) {
      // Random position on a large sphere shell
      const radius = 40 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Slight color variation: white, blue-white, warm-white
      const temp = Math.random();
      if (temp < 0.15) {
        // Blue-ish stars
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1.0;
      } else if (temp < 0.25) {
        // Warm/yellow stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.8;
      } else {
        // White stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      }

      sizes[i] = 0.3 + Math.random() * 1.2;
    }

    return { positions, colors, sizes };
  }, []);

  // Milky Way band - denser cluster of dimmer stars along a plane
  const milkyWayPositions = useMemo(() => {
    const positions = new Float32Array(4000 * 3);
    const colors = new Float32Array(4000 * 3);

    for (let i = 0; i < 4000; i++) {
      const radius = 38 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      // Concentrate near a plane (small phi deviation) for milky way band
      const phi = Math.PI / 2 + (Math.random() - 0.5) * 0.4;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Dimmer, slightly blue/purple tint
      const brightness = 0.3 + Math.random() * 0.4;
      colors[i * 3] = brightness * 0.9;
      colors[i * 3 + 1] = brightness * 0.85;
      colors[i * 3 + 2] = brightness * 1.1;
    }

    return { positions, colors };
  }, []);

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
            count={4000}
            array={milkyWayPositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={4000}
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

function LanguageFlag({ language, onClick, zoomScale = 1 }) {
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
}

// Track camera distance and map to a zoom scale (1.0 at max distance, 1.5 at min distance)
function useZoomScale(minDist = 3, maxDist = 8) {
  const [scale, setScale] = useState(1);
  const { camera } = useThree();

  useFrame(() => {
    const dist = camera.position.length();
    // Clamp and map: maxDist -> 1.0, minDist -> 1.5
    const t = 1 - (Math.min(Math.max(dist, minDist), maxDist) - minDist) / (maxDist - minDist);
    const newScale = 1 + t * 0.5;
    // Only update if changed meaningfully to avoid excessive re-renders
    setScale(prev => Math.abs(prev - newScale) > 0.02 ? newScale : prev);
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
        style={{ background: '#000005' }}
      >
        <GlobeScene onSelectLanguage={onSelectLanguage} />
      </Canvas>
    </div>
  );
}
