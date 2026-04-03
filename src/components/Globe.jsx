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
  const [opacity, setOpacity] = useState(1);
  const coords = language.data?.coordinates || language.coordinates;
  const name = language.data?.languageName || language.languageName;
  const country = language.data?.country || language.country;
  const available = language.available;
  const flagCode = language.flagCode;
  const opacityRef = useRef(1);

  const position = useMemo(
    () => latLngToVector3(coords.lat, coords.lng, 2.08),
    [coords]
  );

  // Fade flags on the far side of the globe
  useFrame(({ camera }) => {
    const camDir = camera.position.clone().normalize();
    const flagDir = new THREE.Vector3(...position.toArray()).normalize();
    const dot = camDir.dot(flagDir); // 1 = facing camera, -1 = opposite side
    // Map dot from [-1, 1] to opacity [0.1, 1]
    const newOpacity = Math.max(0.1, Math.min(1, dot * 0.8 + 0.5));
    if (Math.abs(opacityRef.current - newOpacity) > 0.03) {
      opacityRef.current = newOpacity;
      setOpacity(newOpacity);
    }
  });

  const baseSize = Math.round(22 * zoomScale);
  const hoverSize = Math.round(28 * zoomScale);

  return (
    <group position={position}>
      <Html center zIndexRange={hovered ? [1000, 1000] : [1, 10]}>
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
            opacity,
            transition: 'opacity 0.3s ease',
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
    const newScale = 1 + t * 1.2;
    if (Math.abs(scaleRef.current - newScale) > 0.02) {
      scaleRef.current = newScale;
      setScale(newScale);
    }
  });

  return scale;
}

// Create lens flare textures
function createFlareTexture(size = 128, style = 'core') {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const center = size / 2;

  if (style === 'core') {
    // Bright white core with warm halo
    const grd = ctx.createRadialGradient(center, center, 0, center, center, center);
    grd.addColorStop(0, 'rgba(255,255,240,1)');
    grd.addColorStop(0.08, 'rgba(255,250,220,0.9)');
    grd.addColorStop(0.2, 'rgba(255,220,150,0.4)');
    grd.addColorStop(0.5, 'rgba(255,180,80,0.08)');
    grd.addColorStop(1, 'rgba(255,150,50,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);
  } else if (style === 'rays') {
    // Star rays
    ctx.translate(center, center);
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      const grd = ctx.createLinearGradient(0, 0, center * 0.9, 0);
      grd.addColorStop(0, 'rgba(255,240,200,0.5)');
      grd.addColorStop(0.3, 'rgba(255,220,160,0.1)');
      grd.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, -1.5, center * 0.9, 3);
    }
  } else if (style === 'ring') {
    // Subtle ring flare
    const grd = ctx.createRadialGradient(center, center, center * 0.6, center, center, center * 0.8);
    grd.addColorStop(0, 'rgba(255,200,100,0)');
    grd.addColorStop(0.4, 'rgba(255,220,150,0.06)');
    grd.addColorStop(0.6, 'rgba(255,200,120,0.03)');
    grd.addColorStop(1, 'rgba(255,180,80,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);
  }

  return new THREE.CanvasTexture(canvas);
}

// Sun with lens flare at the main light position
const SUN_POS = [5, 3, 5];

function Sun() {
  const coreTexture = useMemo(() => createFlareTexture(256, 'core'), []);
  const raysTexture = useMemo(() => createFlareTexture(256, 'rays'), []);
  const ringTexture = useMemo(() => createFlareTexture(256, 'ring'), []);

  // Normalize and extend sun position far out
  const sunDir = useMemo(() => {
    const v = new THREE.Vector3(...SUN_POS).normalize().multiplyScalar(18);
    return [v.x, v.y, v.z];
  }, []);

  return (
    <group position={sunDir}>
      {/* Sun core glow */}
      <sprite scale={[4, 4, 1]}>
        <spriteMaterial
          map={coreTexture}
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* Star rays */}
      <sprite scale={[8, 8, 1]}>
        <spriteMaterial
          map={raysTexture}
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* Outer glow */}
      <sprite scale={[12, 12, 1]}>
        <spriteMaterial
          map={coreTexture}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ffcc66"
        />
      </sprite>
      {/* Ring flare */}
      <sprite scale={[16, 16, 1]}>
        <spriteMaterial
          map={ringTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

// Smoothly rotate camera to face a target position on the globe
function CameraAnimator({ targetPosition }) {
  const { camera } = useThree();
  const animating = useRef(false);
  const targetRef = useRef(null);

  useFrame(() => {
    if (!targetRef.current || !animating.current) return;

    const target = targetRef.current;
    const currentPos = camera.position.clone().normalize();
    const targetDir = target.clone().normalize();

    // Spherical interpolation
    const dot = currentPos.dot(targetDir);
    if (dot > 0.999) {
      animating.current = false;
      return;
    }

    const newDir = currentPos.lerp(targetDir, 0.04).normalize();
    const dist = camera.position.length();
    camera.position.copy(newDir.multiplyScalar(dist));
    camera.lookAt(0, 0, 0);
  });

  // React to new target
  useMemo(() => {
    if (targetPosition) {
      targetRef.current = new THREE.Vector3(...targetPosition);
      animating.current = true;
    }
  }, [targetPosition]);

  return null;
}

function GlobeScene({ onSelectLanguage, flyToPosition }) {
  const languages = getAllLanguages();
  const zoomScale = useZoomScale(3, 8);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={SUN_POS} intensity={1.8} />
      <directionalLight position={[-5, -2, -5]} intensity={0.3} />

      <CameraAnimator targetPosition={flyToPosition} />
      <SpaceEnvironment />
      <Sun />
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

function LanguageDropdownRow({ lang, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const name = lang.data?.languageName || lang.languageName;
  const country = lang.data?.country || lang.country;

  return (
    <button
      onClick={() => onSelect(lang)}
      onMouseEnter={(e) => { setHovered(true); e.currentTarget.style.background = 'rgba(126,200,200,0.08)'; }}
      onMouseLeave={(e) => { setHovered(false); e.currentTarget.style.background = 'none'; }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%',
        padding: '9px 16px',
        background: 'none',
        border: 'none',
        color: lang.available ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
        fontSize: '0.84rem',
        cursor: lang.available ? 'pointer' : 'default',
        transition: 'background 0.15s',
        textAlign: 'left',
        position: 'relative',
      }}
    >
      <Flag code={lang.flagCode} size="1.1em" />
      <span style={{ flex: 1 }}>{name}</span>
      <span style={{
        fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.3)',
        position: 'relative',
      }}>
        {country}
        {!lang.available && hovered && (
          <span style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(232,117,90,0.9)',
            color: '#fff',
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: '0.68rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            animation: 'comingSoonFade 0.2s ease-out',
          }}>
            Coming Soon
          </span>
        )}
      </span>
    </button>
  );
}

export default function Globe({ onSelectLanguage }) {
  const [flyToPosition, setFlyToPosition] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const languages = getAllLanguages();
  const dropdownRef = useRef(null);

  const handleLanguageSelect = (lang) => {
    const coords = lang.data?.coordinates || lang.coordinates;
    if (coords) {
      const pos = latLngToVector3(coords.lat, coords.lng, 5);
      setFlyToPosition([pos.x, pos.y, pos.z]);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Language selector */}
      <div ref={dropdownRef} style={{
        position: 'absolute', top: 16, left: 16, zIndex: 10,
      }}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px',
            background: 'rgba(28,42,53,0.85)',
            border: '1px solid rgba(126,200,200,0.2)',
            borderRadius: 10,
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          Languages
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
            transform: dropdownOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {dropdownOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0,
            background: 'rgba(28,42,53,0.95)',
            border: '1px solid rgba(126,200,200,0.15)',
            borderRadius: 12,
            padding: '6px 0',
            minWidth: 240,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            animation: 'dropdownIn 0.15s ease-out',
          }}>
            {languages.map((lang) => (
              <LanguageDropdownRow
                key={lang.id}
                lang={lang}
                onSelect={handleLanguageSelect}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes comingSoonFade {
          from { opacity: 0; transform: translateY(-50%) translateX(4px); }
          to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: '#06090f' }}
      >
        <GlobeScene onSelectLanguage={onSelectLanguage} flyToPosition={flyToPosition} />
      </Canvas>
    </div>
  );
}
