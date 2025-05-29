import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";

import { useAuth } from "./context/Auth";
import { setUnauthorizedHandler } from "./utils/request";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
// Wallet page 
import WalletPage from "./pages/Dashboard/WalletPage";
import WalletCreatePage from "./pages/Dashboard/WalletPage/create";
import WalletUpdatePage from "./pages/Dashboard/WalletPage/update";
// Transaction pages
import TransactionIncomePage from "./pages/Dashboard/TransactionPages/income/index";
import TransactionCreateIncomePage from "./pages/Dashboard/TransactionPages/income/create";
import TransactionEditIncomePage from "./pages/Dashboard/TransactionPages/income/update";
import TransactionOutcomePage from "./pages/Dashboard/TransactionPages/outcome/index";
import TransactionCreateOutcomePage from "./pages/Dashboard/TransactionPages/outcome/create";
import TransactionEditOutcomePage from "./pages/Dashboard/TransactionPages/outcome/update";
// Category page
import CategoryPage from "./pages/Dashboard/CategoryPage";
// Statistic page
import StatisticPage from "./pages/Dashboard/StatisticPage";
// Other pages
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

export default function App() {
  const { handleUnauthorized, isAuth } = useAuth();

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
  }, [handleUnauthorized]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Auth Layout */}
        <Route path="/signin" element={!isAuth ? <SignIn /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!isAuth ? <SignUp /> : <Navigate to="/" replace />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}

        {/* Redirect to home if already authenticated */}
        {/* Dashboard Layout */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index path="/" element={<Home />} />

          {/* Wallet Pages */}
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/wallet/create" element={<WalletCreatePage />} />
          <Route path="/wallet/edit/:id" element={<WalletUpdatePage />} />

          {/* Transaction Pages */}
          <Route path="/transaction-income" element={<TransactionIncomePage />} />
          <Route path="/transaction-income/create" element={<TransactionCreateIncomePage />} />
          <Route path="/transaction-income/edit/:id" element={<TransactionEditIncomePage />} />
          <Route path="/transaction-outcome" element={<TransactionOutcomePage />} />
          <Route path="/transaction-outcome/create" element={<TransactionCreateOutcomePage />} />
          <Route path="/transaction-outcome/edit/:id" element={<TransactionEditOutcomePage />} />

          {/* Category Pages */}
          <Route path="/category" element={<CategoryPage />} />
          
          {/* Statistic Pages */}
          <Route path="/statistic" element={<StatisticPage />} />


          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />

          {/* Ui Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
