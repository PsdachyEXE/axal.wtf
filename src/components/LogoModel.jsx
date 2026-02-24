import { useMemo, useRef, Suspense } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

function LogoMesh() {
  const svgData = useLoader(SVGLoader, '/logo.svg')

  const groupRef = useRef()
  const autoAngle = useRef(0)       // always-incrementing auto-rotation
  const extraRot = useRef({ x: 0, y: 0 })  // drag offset, springs back to 0
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })

  const { geometry, scale: geoScale } = useMemo(() => {
    const allShapes = []
    svgData.paths.forEach((path) => {
      SVGLoader.createShapes(path).forEach((shape) => allShapes.push(shape))
    })

    const geometry = new THREE.ExtrudeGeometry(allShapes, {
      depth: 18,
      bevelEnabled: false,
      curveSegments: 64,  // 64 segments per curve arc — smooth outlines
    })

    geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1))
    geometry.computeBoundingBox()
    geometry.center()

    const size = new THREE.Vector3()
    geometry.boundingBox.getSize(size)
    const scale = 3 / Math.max(size.x, size.y)

    return { geometry, scale }
  }, [svgData])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Auto-rotation always advances
    autoAngle.current += delta * 1.5

    if (!isDragging.current) {
      // Spring drag offset back toward 0 each frame (0.88 damping ≈ smooth 0.3s return)
      extraRot.current.x *= 0.88
      extraRot.current.y *= 0.88
    }

    groupRef.current.rotation.y = autoAngle.current + extraRot.current.y
    groupRef.current.rotation.x = extraRot.current.x
  })

  return (
    <group
      ref={groupRef}
      scale={geoScale}
      onPointerDown={(e) => {
        e.stopPropagation()
        isDragging.current = true
        lastPointer.current = { x: e.clientX, y: e.clientY }
      }}
      onPointerMove={(e) => {
        if (!isDragging.current) return
        const dx = e.clientX - lastPointer.current.x
        const dy = e.clientY - lastPointer.current.y
        extraRot.current.y += dx * 0.012
        extraRot.current.x += dy * 0.012
        // Clamp vertical tilt so it can't flip fully upside-down
        extraRot.current.x = Math.max(-1.1, Math.min(1.1, extraRot.current.x))
        lastPointer.current = { x: e.clientX, y: e.clientY }
      }}
      onPointerUp={() => { isDragging.current = false }}
      onPointerLeave={() => { isDragging.current = false }}
    >
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#e8e8e8" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Fallback() {
  return (
    <mesh>
      <torusGeometry args={[1.2, 0.3, 32, 128]} />
      <meshBasicMaterial color="#555555" />
    </mesh>
  )
}

export default function LogoModel() {
  return (
    <div style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        onPointerDown={(e) => (e.currentTarget.style.cursor = 'grabbing')}
        onPointerUp={(e) => (e.currentTarget.style.cursor = 'grab')}
        onPointerLeave={(e) => (e.currentTarget.style.cursor = 'grab')}
      >
        <Suspense fallback={<Fallback />}>
          <LogoMesh />
        </Suspense>
      </Canvas>
    </div>
  )
}
