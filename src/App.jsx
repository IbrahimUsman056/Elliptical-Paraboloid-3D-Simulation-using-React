import React, { useState, useRef, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import * as THREE from 'three'

function HeadlightParaboloid({ curvature, segments }) {
  const meshRef = useRef()
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const vertices = []
    const normals = []
    const indices = []
    const radius = 2.5
    
    for (let i = 0; i <= segments; i++) {
      const r = (i / segments) * radius
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2
        const x = r * Math.cos(theta)
        const z = r * Math.sin(theta)
        const y = curvature * (x * x + z * z)
        
        vertices.push(x, y, z)
        
        const nx = -2 * curvature * x
        const ny = 1
        const nz = -2 * curvature * z
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
        normals.push(nx / len, ny / len, nz / len)
      }
    }
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j
        const b = a + 1
        const c = a + segments + 1
        const d = c + 1
        indices.push(a, b, d)
        indices.push(a, d, c)
      }
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geo.setIndex(indices)
    
    return geo
  }, [curvature, segments])
  
  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color="#e8e8e8"
        metalness={0.8}
        roughness={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function CoordinateAxes() {
  const length = 5
  return (
    <group>
      <Line points={[[-length, 0, 0], [length, 0, 0]]} color="red" lineWidth={1} />
      <Line points={[[0, -0.5, 0], [0, length, 0]]} color="green" lineWidth={1} />
      <Line points={[[0, 0, -length], [0, 0, length]]} color="blue" lineWidth={1} />
      <Text position={[length + 0.3, 0, 0]} fontSize={0.3} color="red">X</Text>
      <Text position={[0, length + 0.3, 0]} fontSize={0.3} color="green">Z</Text>
      <Text position={[0, 0, length + 0.3]} fontSize={0.3} color="blue">Y</Text>
    </group>
  )
}

function CarHeadlightSetup({ lightIntensity }) {
  const lightColor = '#ffcc00'
  
  return (
    <group>
      <spotLight
        position={[0, 0.3, 0]}
        angle={0.6}
        penumbra={0.3}
        intensity={lightIntensity * 15}
        color={lightColor}
        distance={25}
        castShadow
      />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#ffffff" />
      
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={lightColor} />
      </mesh>
    </group>
  )
}

export default function App() {
  const [curvature, setCurvature] = useState(1.0)
  const [lightIntensity, setLightIntensity] = useState(5)
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', fontFamily: 'Arial, sans-serif' }}>
      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [3, 3, 5], fov: 50 }}
        style={{ background: '#1a1a2e' }}
        shadows
      >
        <OrbitControls 
          enableDamping
          dampingFactor={0.08}
          minDistance={2}
          maxDistance={12}
          target={[0, 2, 0]}
        />
        
        <HeadlightParaboloid curvature={curvature} segments={64} />
        <CoordinateAxes />
        <CarHeadlightSetup lightIntensity={lightIntensity} />
        
        <gridHelper args={[8, 16, '#2a2a4e', '#1a1a2e']} position={[0, -0.01, 0]} />
      </Canvas>
      
      {/* Title - Top Center */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        background: 'rgba(0,0,0,0.7)',
        padding: '6px 16px',
        borderRadius: '4px',
        border: '1px solid #444',
      }}>
        Car Headlight Reflector - Elliptic Paraboloid
      </div>
      
      {/* Left Side Text */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        color: 'white',
        fontSize: '12px',
        background: 'rgba(0,0,0,0.7)',
        padding: '12px 15px',
        borderRadius: '4px',
        border: '1px solid #444',
        maxWidth: '220px',
        lineHeight: '1.6',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffaa00', fontSize: '13px' }}>Equation</div>
        <div style={{ fontFamily: 'monospace', marginBottom: '10px' }}>z = x² + y²</div>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffaa00', fontSize: '13px' }}>How it's Made</div>
        <div>Generated using parametric equations with radial symmetry. Each point (x, y) is mapped to height z = x² + y² creating a smooth bowl shape.</div>
      </div>
      
      {/* Right Side Text */}
      <div style={{
        position: 'absolute',
        top: '80px',
        right: '20px',
        color: 'white',
        fontSize: '12px',
        background: 'rgba(0,0,0,0.7)',
        padding: '12px 15px',
        borderRadius: '4px',
        border: '1px solid #444',
        maxWidth: '220px',
        lineHeight: '1.6',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffaa00', fontSize: '13px' }}>Applications</div>
        <div style={{ marginBottom: '6px' }}>• Car headlight reflectors</div>
        <div style={{ marginBottom: '6px' }}>• Satellite dishes</div>
        <div style={{ marginBottom: '6px' }}>• Solar concentrators</div>
        <div style={{ marginBottom: '6px' }}>• Telescope mirrors</div>
        <div style={{ marginBottom: '10px' }}>• Radio antennas</div>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffaa00', fontSize: '13px' }}>MVC Concepts</div>
        <div style={{ marginBottom: '4px' }}>• Functions of two variables</div>
        <div style={{ marginBottom: '4px' }}>• 3D coordinate systems</div>
        <div style={{ marginBottom: '4px' }}>• Cross-sections & level curves</div>
        <div style={{ marginBottom: '4px' }}>• Radial symmetry</div>
        <div>• Partial derivatives</div>
      </div>
      
      {/* Control Box - Bottom Center */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.85)',
        border: '1px solid #555',
        borderRadius: '8px',
        padding: '15px 20px',
        color: 'white',
        width: '300px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#ffaa00' }}>
          Controls
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Bowl Depth</span>
            <span style={{ color: '#ffaa00' }}>{curvature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.01"
            value={curvature}
            onChange={(e) => setCurvature(parseFloat(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666', marginTop: '2px' }}>
            <span>Shallow</span>
            <span>Deep</span>
          </div>
        </div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Brightness</span>
            <span style={{ color: '#ffaa00' }}>{lightIntensity.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666', marginTop: '2px' }}>
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Right Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: '#555',
        fontSize: '11px',
        background: 'rgba(0,0,0,0.5)',
        padding: '5px 10px',
        borderRadius: '3px',
      }}>
        Drag: Rotate | Scroll: Zoom
      </div>
    </div>
  )
}