import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getAllLanguages } from '../data/languages';

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

// Atmospheric glow around the globe
function Atmosphere() {
  const meshRef = useRef();

  return (
    <Sphere ref={meshRef} args={[2.06, 64, 64]}>
      <meshBasicMaterial
        color="#4488ff"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </Sphere>
  );
}

function PulsingRing({ available }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current && available) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
      meshRef.current.scale.setScalar(scale);
      meshRef.current.material.opacity = 0.4 - Math.sin(clock.getElapsedTime() * 2) * 0.15;
    }
  });

  if (!available) return null;

  return (
    <mesh ref={meshRef}>
      <ringGeometry args={[0.08, 0.12, 32]} />
      <meshBasicMaterial
        color="#60a5fa"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LanguagePin({ language, onClick }) {
  const [hovered, setHovered] = useState(false);
  const coords = language.data?.coordinates || language.coordinates;
  const name = language.data?.languageName || language.languageName;
  const country = language.data?.country || language.country;
  const available = language.available;

  const position = useMemo(
    () => latLngToVector3(coords.lat, coords.lng, 2.05),
    [coords]
  );

  return (
    <group position={position}>
      {/* Pin dot */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (available) onClick(language);
        }}
      >
        <sphereGeometry args={[hovered ? 0.08 : 0.06, 16, 16]} />
        <meshBasicMaterial
          color={available ? (hovered ? '#fbbf24' : '#60a5fa') : '#6b7280'}
        />
      </mesh>

      {/* Animated pulse ring for available languages */}
      <PulsingRing available={available} />

      {/* Label */}
      {hovered && (
        <Html
          position={[0, 0.15, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: available
                ? 'rgba(59, 130, 246, 0.9)'
                : 'rgba(107, 114, 128, 0.9)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <div>{name}</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>
              {country}
              {!available && ' (Coming Soon)'}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function GlobeScene({ onSelectLanguage }) {
  const languages = getAllLanguages();

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <directionalLight position={[-5, -2, -5]} intensity={0.6} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      <EarthGlobe />
      <Atmosphere />

      {languages.map((lang) => (
        <LanguagePin
          key={lang.id}
          language={lang}
          onClick={onSelectLanguage}
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
        style={{ background: 'transparent' }}
      >
        <GlobeScene onSelectLanguage={onSelectLanguage} />
      </Canvas>
    </div>
  );
}
