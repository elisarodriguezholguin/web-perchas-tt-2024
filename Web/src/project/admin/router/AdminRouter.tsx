import { Navigate, Route, Routes } from "react-router-dom";
import { ProjectLayout } from "../../layout";
import { BillHistoryScreen, RegisterTextureScreen } from "../pages";
import { ProfilePage } from "../../screens";

export const AdminRouter = () => {
  return (
    <ProjectLayout>
      <div className="container">
        <Routes>
          <Route path="billHistory" element={<BillHistoryScreen />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="registerTexture" element={<RegisterTextureScreen />} />
          {/* <Route path="registerType" element={<RegisterTypeScreen />} /> */}
          <Route path="/" element={<Navigate to="/billHistory" />} />
          <Route path="/*" element={<Navigate to="/billHistory" />} />
        </Routes>
      </div>
    </ProjectLayout>
  );
};
