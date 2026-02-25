import { useMemo, Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

function LogoMesh() {
  const svgData = useLoader(SVGLoader, '/logo.svg')

  const { geometry, geoScale } = useMemo(() => {
    const allShapes = []
    svgData.paths.forEach((path) => {
      SVGLoader.createShapes(path).forEach((shape) => allShapes.push(shape))
    })

    // Compute 2-D bounding box for normalisation scale
    const tempGeo = new THREE.ShapeGeometry(allShapes)
    tempGeo.computeBoundingBox()
    const tmpSize = new THREE.Vector3()
    tempGeo.boundingBox.getSize(tmpSize)
    tempGeo.dispose()

    const maxDim = Math.max(tmpSize.x, tmpSize.y)
    const geoScale = 3 / maxDim           // logo = 3 world-units wide

    // Proportional depth → solid, no z-fighting between cap faces
    const svgDepth = 0.55 / geoScale

    // SVG now has: smooth Bezier arcs (ring) + straight L commands (A legs)
    // High curveSegments tessellates the ring arcs smoothly
    const geometry = new THREE.ExtrudeGeometry(allShapes, {
      depth: svgDepth,
      bevelEnabled: false,
      curveSegments: 256,
    })

    geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1))
    geometry.computeBoundingBox()
    geometry.center()

    return { geometry, geoScale }
  }, [svgData])

  return (
    <group scale={geoScale}>
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
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <Suspense fallback={<Fallback />}>
        <LogoMesh />
      </Suspense>

      <OrbitControls
        autoRotate
        autoRotateSpeed={5}
        enableDamping
        dampingFactor={0.06}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2 - 1.1}
        maxPolarAngle={Math.PI / 2 + 1.1}
      />
    </Canvas>
  )
}
