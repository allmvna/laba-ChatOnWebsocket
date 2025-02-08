import Chat from "./containers/Chat/Chat.tsx";
import AppToolbar from "./components/AppToolbar/AppToolbar.tsx";
import {Route, Routes } from "react-router-dom";
import RegisterPage from "./features/users/RegisterPage.tsx";
import LoginPage from "./features/users/LoginPage.tsx";
import {Alert} from "@mui/material";

const App = () => {
    return (
        <>
            <header>
                <AppToolbar />
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<Chat/>}/>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Alert severity="error">Page not found</Alert>}/>
                </Routes>
            </main>
        </>
    )
}

export default App;
