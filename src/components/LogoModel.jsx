import { useMemo, Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

function LogoMesh() {
  const svgData = useLoader(SVGLoader, '/logo.svg')

  const { geometry, scale: geoScale } = useMemo(() => {
    const allShapes = []
    svgData.paths.forEach((path) => {
      SVGLoader.createShapes(path).forEach((shape) => allShapes.push(shape))
    })

    const geometry = new THREE.ExtrudeGeometry(allShapes, {
      depth: 18,
      bevelEnabled: false,
    })

    // Flip Y axis — SVG Y is down, Three.js Y is up
    geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1))

    // Center and normalize
    geometry.computeBoundingBox()
    geometry.center()
    const size = new THREE.Vector3()
    geometry.boundingBox.getSize(size)
    const scale = 3 / Math.max(size.x, size.y)

    return { geometry, scale }
  }, [svgData])

  return (
    <group scale={geoScale}>
      <mesh geometry={geometry}>
        {/* MeshBasicMaterial: flat colour, zero lighting artifacts */}
        <meshBasicMaterial color="#e8e8e8" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Fallback() {
  return (
    <mesh>
      <torusGeometry args={[1.2, 0.3, 16, 64]} />
      <meshBasicMaterial color="#555555" />
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
      <OrbitControls
        autoRotate
        autoRotateSpeed={8}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
      />

      <Suspense fallback={<Fallback />}>
        <LogoMesh />
      </Suspense>
    </Canvas>
  )
}
