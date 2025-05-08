
import { useRoomStore } from "@/store/roomStore";
import Room2D from "@/components/room/Room2D";
import Room3D from "@/components/room/Room3D";

const RoomContainer = () => {
  const viewMode = useRoomStore(state => state.viewMode);
  const activeDesign = useRoomStore(state => state.activeDesign);
  
  if (!activeDesign) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-light p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-purple">Welcome to Decor - Haven</h2>
          <p className="text-neutral-dark mb-4">
            Create a new room design or select an existing one to start configuring your perfect space.
          </p>
          <p className="text-sm text-neutral">
            This tool lets you design rooms in 2D and 3D, add furniture, customize colors, and save your designs for later.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      {viewMode === '2d' ? <Room2D /> : <Room3D />}
    </div>
  );
};

export default RoomContainer;
