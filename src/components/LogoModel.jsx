import { useMemo, useRef, Suspense } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

// Scene contains both the logo and a transparent full-coverage interaction plane.
// Keeping everything inside R3F means only one event system is active — no fighting.
function Scene() {
  const svgData = useLoader(SVGLoader, '/logo.svg')
  const groupRef = useRef()
  const autoAngle = useRef(0)
  const isDragging = useRef(false)
  const extraRot = useRef({ x: 0, y: 0 })
  const lastPointer = useRef({ x: 0, y: 0 })

  const { geometry, geoScale } = useMemo(() => {
    const allShapes = []
    svgData.paths.forEach((path) => {
      SVGLoader.createShapes(path).forEach((shape) => allShapes.push(shape))
    })

    const tempGeo = new THREE.ShapeGeometry(allShapes)
    tempGeo.computeBoundingBox()
    const tmpSize = new THREE.Vector3()
    tempGeo.boundingBox.getSize(tmpSize)
    tempGeo.dispose()

    const maxDim = Math.max(tmpSize.x, tmpSize.y)
    const geoScale = 3 / maxDim
    const svgDepth = 0.55 / geoScale

    const geometry = new THREE.ExtrudeGeometry(allShapes, {
      depth: svgDepth,
      bevelEnabled: false,
      curveSegments: 1,
    })

    geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1))
    geometry.computeBoundingBox()
    geometry.center()

    return { geometry, geoScale }
  }, [svgData])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Auto-rotation always advances
    autoAngle.current += delta * 1.5

    // Spring back to neutral when not dragging (exponential decay)
    if (!isDragging.current) {
      extraRot.current.x *= 0.90
      extraRot.current.y *= 0.90
    }

    groupRef.current.rotation.y = autoAngle.current + extraRot.current.y
    groupRef.current.rotation.x = extraRot.current.x
  })

  const stopDrag = () => { isDragging.current = false }

  return (
    <>
      {/* Logo */}
      <group ref={groupRef} scale={geoScale}>
        <mesh geometry={geometry}>
          <meshBasicMaterial color="#e8e8e8" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/*
        Transparent plane sitting between the camera and the logo.
        Size 30×30 world-units covers the entire viewport many times over,
        so dragging never escapes it. depthWrite:false means the logo
        behind it renders normally.
      */}
      <mesh
        position={[0, 0, 2]}
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
          extraRot.current.x = Math.max(-1.1, Math.min(1.1, extraRot.current.x))
          lastPointer.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
      >
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
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
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: '100%', height: '100%', background: 'transparent', cursor: 'grab' }}
      gl={{ alpha: true, antialias: true }}
    >
      <Suspense fallback={<Fallback />}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
