import Header from "./Header";
import '../styles/App.css';
import { GlobalSettingsContext, useGlobalSettings } from "../hooks/useGlobalSettings";
import { StatisticsContext, useStatistics } from "../hooks/useStatistics";
import { Outlet } from "react-router-dom";

function App() {
  const globalSettings = useGlobalSettings();
  const statistics = useStatistics();

  return (
    <StatisticsContext.Provider value={statistics}>
      <GlobalSettingsContext.Provider value={globalSettings}>
        <div className="app-container">
          <Header />      
          <Outlet />
        </div>
      </GlobalSettingsContext.Provider>
    </StatisticsContext.Provider>
  );
}

export default App;
