import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

function LogoMesh() {
  const groupRef = useRef()
  const svgData = useLoader(SVGLoader, '/logo.svg')

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  const { geometry, scale: geoScale } = useMemo(() => {
    const allShapes = []
    svgData.paths.forEach((path) => {
      SVGLoader.createShapes(path).forEach((shape) => allShapes.push(shape))
    })

    const extrudeSettings = {
      depth: 18,
      bevelEnabled: false,
    }

    const geometry = new THREE.ExtrudeGeometry(allShapes, extrudeSettings)

    // Flip Y axis — SVG Y is down, Three.js Y is up
    geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1))

    // Center the geometry
    geometry.computeBoundingBox()
    geometry.center()

    // Calculate scale to normalize to ~3 units wide
    const size = new THREE.Vector3()
    geometry.boundingBox.getSize(size)
    const scale = 3 / Math.max(size.x, size.y)

    return { geometry, scale }
  }, [svgData])

  return (
    <group ref={groupRef} scale={geoScale}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function Fallback() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
    }
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.2, 0.3, 16, 64]} />
      <meshStandardMaterial color="#555555" roughness={0.8} />
    </mesh>
  )
}

export default function LogoModel() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[4, 4, 4]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-4, -2, 2]} intensity={0.3} color="#aaaaaa" />

      <Suspense fallback={<Fallback />}>
        <LogoMesh />
      </Suspense>
    </Canvas>
  )
}
