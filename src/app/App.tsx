import { FC, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../rootReducer';

const Auth = lazy(() => import ('../features/auth/Auth'));
const Home = lazy(() => import('../features/home/Home'));

const App: FC = () => {
    const isLoggedIn = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    return (
        <Router>
            <Routes>
                <Route path="/">
                <Suspense fallback={ <p>Loading...</p> }>
                    {isLoggedIn ? <Home /> : <Auth />}
                </Suspense>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;