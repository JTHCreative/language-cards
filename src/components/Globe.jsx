import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
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

// Milky Way / starfield skybox
function Starfield() {
  const texture = useTexture('/textures/starfield.jpg');
  return (
    <Sphere args={[50, 64, 64]}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
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

function LanguageFlag({ language, onClick }) {
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
            <Flag code={flagCode} size={hovered ? '28px' : '22px'} />
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

function GlobeScene({ onSelectLanguage }) {
  const languages = getAllLanguages();

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
