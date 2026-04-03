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

// Generate a nebula/space texture on a 2D canvas
function generateSpaceTexture(width = 2048, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Dark base
  ctx.fillStyle = '#070b15';
  ctx.fillRect(0, 0, width, height);

  // Nebula clouds - layered radial gradients
  const nebulae = [
    { x: 0.25, y: 0.45, r: 0.4, colors: ['rgba(60,100,220,0.35)', 'rgba(30,60,160,0.15)', 'rgba(10,15,40,0)'] },
    { x: 0.7, y: 0.4, r: 0.45, colors: ['rgba(220,80,50,0.3)', 'rgba(200,100,40,0.12)', 'rgba(10,10,20,0)'] },
    { x: 0.45, y: 0.5, r: 0.3, colors: ['rgba(255,200,100,0.25)', 'rgba(220,120,60,0.1)', 'rgba(10,10,20,0)'] },
    { x: 0.15, y: 0.7, r: 0.35, colors: ['rgba(150,50,180,0.2)', 'rgba(80,30,120,0.08)', 'rgba(10,10,20,0)'] },
    { x: 0.8, y: 0.25, r: 0.3, colors: ['rgba(40,140,220,0.25)', 'rgba(20,80,160,0.1)', 'rgba(10,10,20,0)'] },
    { x: 0.55, y: 0.7, r: 0.25, colors: ['rgba(200,60,120,0.2)', 'rgba(120,30,80,0.08)', 'rgba(10,10,20,0)'] },
    { x: 0.35, y: 0.25, r: 0.28, colors: ['rgba(80,180,220,0.18)', 'rgba(40,100,160,0.07)', 'rgba(10,10,20,0)'] },
    { x: 0.9, y: 0.6, r: 0.22, colors: ['rgba(180,80,200,0.2)', 'rgba(100,40,140,0.08)', 'rgba(10,10,20,0)'] },
  ];

  nebulae.forEach(n => {
    const grd = ctx.createRadialGradient(
      n.x * width, n.y * height, 0,
      n.x * width, n.y * height, n.r * width
    );
    grd.addColorStop(0, n.colors[0]);
    grd.addColorStop(0.5, n.colors[1]);
    grd.addColorStop(1, n.colors[2]);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  });

  // Wispy cloud layers using noise-like random passes
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = 15 + Math.random() * 100;
      const hue = Math.random() < 0.5 ? 220 + Math.random() * 40 : 10 + Math.random() * 30;
      const sat = 40 + Math.random() * 40;
      const light = 30 + Math.random() * 30;
      const alpha = 0.01 + Math.random() * 0.04;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, `hsla(${hue},${sat}%,${light}%,${alpha})`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }

  // No stars baked into the texture — they are rendered as 3D particles instead
  // to avoid stretching at the poles of the skybox sphere

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Space skybox with generated nebula texture + star particles
function Starfield() {
  const spaceTexture = useMemo(() => generateSpaceTexture(), []);

  const starPositions = useMemo(() => {
    const positions = new Float32Array(6000 * 3);
    const colors = new Float32Array(6000 * 3);

    for (let i = 0; i < 6000; i++) {
      const radius = 42 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const temp = Math.random();
      if (temp < 0.1) {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 1.0;
      } else if (temp < 0.18) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.5;
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
      }
    }
    return { positions, colors };
  }, []);

  return (
    <group>
      {/* Nebula skybox sphere — high segment count to avoid visible grid */}
      <Sphere args={[50, 128, 64]}>
        <meshBasicMaterial map={spaceTexture} side={THREE.BackSide} />
      </Sphere>

      {/* 3D star particles — rendered separately to avoid texture stretching */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={6000}
            array={starPositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={6000}
            array={starPositions.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.9}
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
