import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, Sphere } from '@react-three/drei';
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

function GlobeMesh() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshPhongMaterial
        color="#1a1a4e"
        emissive="#0a0a2e"
        specular="#4444aa"
        shininess={15}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

function GlobeGrid() {
  const gridLines = useMemo(() => {
    const lines = [];
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const points = [];
      for (let lng = 0; lng <= 360; lng += 5) {
        points.push(latLngToVector3(lat, lng, 2.01));
      }
      lines.push(points);
    }
    // Longitude lines
    for (let lng = 0; lng < 360; lng += 30) {
      const points = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(latLngToVector3(lat, lng, 2.01));
      }
      lines.push(points);
    }
    return lines;
  }, []);

  return (
    <group>
      {gridLines.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#3344aa" transparent opacity={0.2} />
        </line>
      ))}
    </group>
  );
}

// Simplified continent outlines as filled mesh regions
function ContinentMeshes() {
  const continentData = useMemo(() => {
    // Rough continent outlines as lat/lng polygon centers with size
    const regions = [
      // North America
      ...generateRegionDots(25, 70, -130, -60, 0.8),
      // South America
      ...generateRegionDots(-55, 10, -80, -35, 0.7),
      // Europe
      ...generateRegionDots(35, 70, -10, 40, 0.9),
      // Africa
      ...generateRegionDots(-35, 35, -20, 50, 0.7),
      // Asia
      ...generateRegionDots(10, 70, 60, 145, 0.6),
      // Australia
      ...generateRegionDots(-40, -12, 115, 155, 0.7),
    ];
    return regions;
  }, []);

  return (
    <group>
      {continentData.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#2d6a4f" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function generateRegionDots(latMin, latMax, lngMin, lngMax, density) {
  const dots = [];
  const step = 3 / density;
  for (let lat = latMin; lat <= latMax; lat += step) {
    for (let lng = lngMin; lng <= lngMax; lng += step) {
      // Add some randomness to make it look more natural
      if (isLand(lat, lng)) {
        const pos = latLngToVector3(lat, lng, 2.015);
        dots.push([pos.x, pos.y, pos.z]);
      }
    }
  }
  return dots;
}

// Very rough land detection
function isLand(lat, lng) {
  // North America
  if (lat > 25 && lat < 70 && lng > -130 && lng < -60) {
    if (lat > 48 && lng < -100) return lat < 65;
    if (lat < 35 && lng < -100) return lng > -120;
    return true;
  }
  // Central America
  if (lat > 8 && lat < 25 && lng > -110 && lng < -75) return true;
  // South America
  if (lat > -55 && lat < 12 && lng > -82 && lng < -34) {
    if (lat < -45) return lng > -75 && lng < -65;
    return true;
  }
  // Europe
  if (lat > 36 && lat < 71 && lng > -10 && lng < 40) {
    if (lat > 60 && lng > 30) return false;
    return true;
  }
  // UK
  if (lat > 50 && lat < 59 && lng > -8 && lng < 2) return true;
  // Africa
  if (lat > -35 && lat < 37 && lng > -18 && lng < 52) {
    if (lat > 20 && lng > 35) return lat > 25 ? false : true;
    return true;
  }
  // Middle East
  if (lat > 12 && lat < 42 && lng > 35 && lng < 60) return true;
  // South Asia / India
  if (lat > 8 && lat < 35 && lng > 68 && lng < 90) return true;
  // Southeast Asia
  if (lat > -8 && lat < 28 && lng > 95 && lng < 110) return true;
  // East Asia / China / Korea / Japan
  if (lat > 18 && lat < 55 && lng > 100 && lng < 145) {
    if (lng > 130 && lat < 30) return false;
    return true;
  }
  // Japan
  if (lat > 30 && lat < 45 && lng > 129 && lng < 146) return true;
  // Indonesia / Philippines
  if (lat > -8 && lat < 18 && lng > 95 && lng < 140) {
    return Math.random() > 0.4;
  }
  // Russia / Siberia
  if (lat > 50 && lat < 72 && lng > 40 && lng < 180) return true;
  // Australia
  if (lat > -40 && lat < -12 && lng > 115 && lng < 155) return true;
  return false;
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

      {/* Pulse ring for available languages */}
      {available && (
        <mesh>
          <ringGeometry args={[0.08, 0.12, 32]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

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
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4444ff" />

      <GlobeMesh />
      <GlobeGrid />
      <ContinentMeshes />

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
