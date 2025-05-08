import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html, useGLTF } from "@react-three/drei";
import { useRoomStore, FurnitureItem, Point2D } from "@/store/roomStore";
import { useEffect, useState, Suspense, useRef } from "react";
import FurnitureModel from "./FurnitureModel";
import { Shape, ExtrudeGeometry, Vector2, Group, MeshStandardMaterial, BackSide } from "three";

const SceneExporter = () => {
  const { scene } = useThree();
  
  useEffect(() => {

    (window as any).__ROOM3D_SCENE__ = scene;
    
    return () => {
     
      (window as any).__ROOM3D_SCENE__ = null;
    };
  }, [scene]);
  
  return null;
};

const Room = () => {
  const activeDesign = useRoomStore(state => state.activeDesign);
  const selectedFurniture = useRoomStore(state => state.selectedFurniture);
  const setSelectedFurniture = useRoomStore(state => state.setSelectedFurniture);
  const roomRef = useRef<Group>(null);

  if (!activeDesign) return null;

  const { length, width, height, wallColor, floorColor, ceilingColor, shape, customPoints } = activeDesign;

  
  const renderCustomShape = () => {
    if (!customPoints || customPoints.length < 3) return null;
    

    const roomShape = new Shape();
    
 
    const scaledPoints = customPoints.map(point => ({
      x: point.x * length - length/2,
      y: point.y * width - width/2
    }));
    

    roomShape.moveTo(scaledPoints[0].x, scaledPoints[0].y);
    
 
    for (let i = 1; i < scaledPoints.length; i++) {
      roomShape.lineTo(scaledPoints[i].x, scaledPoints[i].y);
    }
    
    roomShape.lineTo(scaledPoints[0].x, scaledPoints[0].y);
    
    const extrudeSettings = {
      depth: height,
      bevelEnabled: false
    };
    

    const wallMaterial = new MeshStandardMaterial({ color: wallColor, side: BackSide, transparent: true, opacity: 0.8 });
    const floorMaterial = new MeshStandardMaterial({ color: floorColor });
    const ceilingMaterial = new MeshStandardMaterial({ color: ceilingColor });
    
    return (
      <group ref={roomRef} position={[0, height/2, 0]}>
        {/* Walls */}
        <mesh receiveShadow>
          <extrudeGeometry args={[roomShape, extrudeSettings]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        
        {/* Floor */}
        <mesh position={[0, -height/2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <shapeGeometry args={[roomShape]} />
          <primitive object={floorMaterial} attach="material" />
        </mesh>
        
        {/* Ceiling */}
        <mesh position={[0, height/2 - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <shapeGeometry args={[roomShape]} />
          <primitive object={ceilingMaterial} attach="material" />
        </mesh>
      </group>
    );
  };

  const renderLShape = () => {
    const lShapeDimensions = {
      mainLength: length * 0.7,
      mainWidth: width,
      extensionLength: length,
      extensionWidth: width * 0.5,
    };
    
   
    const wallMaterial = new MeshStandardMaterial({ color: wallColor, side: BackSide, transparent: true, opacity: 0.8 });
    const floorMaterial = new MeshStandardMaterial({ color: floorColor });
    const ceilingMaterial = new MeshStandardMaterial({ color: ceilingColor });

    return (
      <group ref={roomRef}>
        {/*Walls */}
        <mesh position={[0, height / 2, 0]} receiveShadow>
          <boxGeometry args={[lShapeDimensions.mainLength, height, lShapeDimensions.mainWidth]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        
        <mesh 
          position={[
            (lShapeDimensions.mainLength - lShapeDimensions.extensionLength) / 2, 
            height / 2, 
            (lShapeDimensions.mainWidth - lShapeDimensions.extensionWidth) / 2
          ]} 
          receiveShadow
        >
          <boxGeometry args={[lShapeDimensions.extensionLength, height, lShapeDimensions.extensionWidth]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>

        {/* Floor */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[lShapeDimensions.mainLength, lShapeDimensions.mainWidth]} />
          <primitive object={floorMaterial} attach="material" />
        </mesh>

        <mesh 
          position={[
            (lShapeDimensions.mainLength - lShapeDimensions.extensionLength) / 2, 
            0.01, 
            (lShapeDimensions.mainWidth - lShapeDimensions.extensionWidth) / 2
          ]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          <planeGeometry args={[lShapeDimensions.extensionLength, lShapeDimensions.extensionWidth]} />
          <primitive object={floorMaterial} attach="material" />
        </mesh>

       
        <mesh position={[0, height - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[lShapeDimensions.mainLength, lShapeDimensions.mainWidth]} />
          <primitive object={ceilingMaterial} attach="material" />
        </mesh>

        {/* Ceiling */}
        <mesh 
          position={[
            (lShapeDimensions.mainLength - lShapeDimensions.extensionLength) / 2, 
            height - 0.01, 
            (lShapeDimensions.mainWidth - lShapeDimensions.extensionWidth) / 2
          ]} 
          rotation={[Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          <planeGeometry args={[lShapeDimensions.extensionLength, lShapeDimensions.extensionWidth]} />
          <primitive object={ceilingMaterial} attach="material" />
        </mesh>
      </group>
    );
  };

  const renderRectangular = () => {

    const wallMaterial = new MeshStandardMaterial({ color: wallColor, side: BackSide, transparent: true, opacity: 0.8 });
    const floorMaterial = new MeshStandardMaterial({ color: floorColor });
    const ceilingMaterial = new MeshStandardMaterial({ color: ceilingColor });
    
    return (
      <group ref={roomRef}>
        {/* Walls*/}
        <mesh position={[0, height / 2, 0]} receiveShadow>
          <boxGeometry args={[length, height, width]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>

        {/* Floor  */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[length, width]} />
          <primitive object={floorMaterial} attach="material" />
        </mesh>

        {/* Ceiling */}
        <mesh position={[0, height - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[length, width]} />
          <primitive object={ceilingMaterial} attach="material" />
        </mesh>
      </group>
    );
  };

  return (
    <group>
      {shape === 'rectangular' ? renderRectangular() : 
       shape === 'L-shaped' ? renderLShape() : 
       renderCustomShape()}

      {/* Furniture */}
      {activeDesign.furniture.map((item) => (
        <FurnitureModel
          key={item.id}
          item={item}
          isSelected={item.id === selectedFurniture}
          onClick={() => setSelectedFurniture(item.id)}
          roomDimensions={[length, width]}
        />
      ))}

      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.4}
      />
    </group>
  );
};

const CameraControls = () => {
  const { camera } = useThree();
  const activeDesign = useRoomStore(state => state.activeDesign);
  
  useEffect(() => {
    if (activeDesign) {
      const { length, width } = activeDesign;
      const maxDimension = Math.max(length, width);
      camera.position.set(maxDimension, maxDimension * 0.8, maxDimension);
      camera.lookAt(0, 0, 0);
    }
  }, [activeDesign, camera]);
  
  return <OrbitControls makeDefault enableDamping dampingFactor={0.1} />;
};

const Room3D = () => {
  const activeDesign = useRoomStore(state => state.activeDesign);
  const containerRef = useRef<HTMLDivElement>(null);
  
  if (!activeDesign) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-light">
        <p className="text-neutral-dark">No active design. Create or select a design to start.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full" ref={containerRef} data-room-component="room3d">
      <Canvas shadows data-threejs-canvas>
        <SceneExporter />
        <CameraControls />
        <Suspense fallback={<Html center><p>Loading...</p></Html>}>
          <Room />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Room3D;