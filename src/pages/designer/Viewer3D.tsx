
import Layout from "@/components/Layout";
import Sidebar from "@/components/Sidebar";
import RoomControls from "@/components/RoomControls";
import RoomContainer from "@/components/RoomContainer";

const Viewer3D = () => {
  return (
    <Layout>
      <div className="flex flex-1">
        <Sidebar>
          <RoomControls />
        </Sidebar>
        <div className="flex-1 h-full">
          <RoomContainer />
        </div>
      </div>
    </Layout>
  );
};

export default Viewer3D;
