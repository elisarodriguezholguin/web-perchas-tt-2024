import { Navigate, Route, Routes } from "react-router-dom";
import { ProjectLayout } from "../../layout";
import { CustomGondolaPage, HistoryPage, HomePage } from "../pages";
import { ProfilePage } from "../../screens";

export const ProjectRouter = () => {
  return (
    <ProjectLayout>
      <div className="container">
        <Routes>
          <Route path="home" element={<HomePage />} />
          <Route path="custom" element={<CustomGondolaPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </ProjectLayout>
  );
};
