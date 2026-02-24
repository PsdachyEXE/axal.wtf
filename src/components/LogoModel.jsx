import { useMemo, useRef, Suspense } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

// Shared interaction refs are passed down from the DOM wrapper so that
// raycasting holes in the logo never break the drag.
function LogoMesh({ isDragging, extraRot }) {
  const svgData = useLoader(SVGLoader, '/logo.svg')
  const groupRef = useRef()
  const autoAngle = useRef(0)

  const { geometry, geoScale } = useMemo(() => {
    const allShapes = []
    svgData.paths.forEach((path) => {
      SVGLoader.createShapes(path).forEach((shape) => allShapes.push(shape))
    })

    // --- Step 1: compute 2-D bounding box to get the normalisation scale ---
    const tempGeo = new THREE.ShapeGeometry(allShapes)
    tempGeo.computeBoundingBox()
    const tmpSize = new THREE.Vector3()
    tempGeo.boundingBox.getSize(tmpSize)
    tempGeo.dispose()

    const maxDim = Math.max(tmpSize.x, tmpSize.y)
    const geoScale = 3 / maxDim           // logo will be 3 world-units wide

    // --- Step 2: set depth in SVG-space so it maps to a fixed world depth ---
    // 0.55 world units → solid and chunky, no z-fighting between cap faces
    const svgDepth = 0.55 / geoScale

    // --- Step 3: extrude ---
    const geometry = new THREE.ExtrudeGeometry(allShapes, {
      depth: svgDepth,
      bevelEnabled: false,
      curveSegments: 64,     // 64 segments per arc → smooth circles/curves
    })

    // SVG Y-axis is inverted vs Three.js
    geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1))
    geometry.computeBoundingBox()
    geometry.center()

    return { geometry, geoScale }
  }, [svgData])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Auto-rotation always ticks — never pauses
    autoAngle.current += delta * 1.5
    // When not dragging, spring drag offset back to 0
    if (!isDragging.current) {
      extraRot.current.x *= 0.88
      extraRot.current.y *= 0.88
    }
    groupRef.current.rotation.y = autoAngle.current + extraRot.current.y
    groupRef.current.rotation.x = extraRot.current.x
  })

  return (
    <group ref={groupRef} scale={geoScale}>
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
  // All interaction lives on the DOM div — not inside R3F — so that:
  //   • setPointerCapture locks events to this element for the whole drag
  //   • moving over logo holes / empty space never drops the drag
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const extraRot = useRef({ x: 0, y: 0 })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        cursor: 'grab',
        touchAction: 'none',   // prevent mobile scroll hijacking the drag
        userSelect: 'none',
      }}
      onPointerDown={(e) => {
        // Capture: all subsequent pointer events come here until pointerup
        e.currentTarget.setPointerCapture(e.pointerId)
        isDragging.current = true
        lastPointer.current = { x: e.clientX, y: e.clientY }
        e.currentTarget.style.cursor = 'grabbing'
      }}
      onPointerMove={(e) => {
        if (!isDragging.current) return
        const dx = e.clientX - lastPointer.current.x
        const dy = e.clientY - lastPointer.current.y
        extraRot.current.y += dx * 0.012
        extraRot.current.x += dy * 0.012
        // Clamp vertical tilt — can't go fully upside-down
        extraRot.current.x = Math.max(-1.1, Math.min(1.1, extraRot.current.x))
        lastPointer.current = { x: e.clientX, y: e.clientY }
      }}
      onPointerUp={(e) => {
        isDragging.current = false
        e.currentTarget.style.cursor = 'grab'
      }}
      onPointerCancel={() => {
        isDragging.current = false
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={<Fallback />}>
          <LogoMesh isDragging={isDragging} extraRot={extraRot} />
        </Suspense>
      </Canvas>
    </div>
  )
}
