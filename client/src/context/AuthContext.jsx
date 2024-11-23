import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
    user: null,
    authTokens: null,
    login: () => {},
    logout: () => {}
});


export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens')
            ? JSON.parse(localStorage.getItem('authTokens'))
            : null
    );

    const [user, setUser] = useState(null);

    const getUser = (token) => {
        fetch("http://localhost:3000/auth/get_user", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(() => {
                setUser(null);
                setAuthTokens(null);
            });
    }

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        if(tokens) {
            getUser(localStorage.getItem(tokens.access))
        }
    }, [])

    useEffect(() => {
        if (authTokens) {
            getUser(authTokens.access)
        }
    }, [authTokens]);

    const login = (tokens) => {
        setAuthTokens(tokens);
        fetch("http://localhost:3000/auth/get_user", {
            method: "GET",
            headers: {
                'authorization': 'Bearer ' + tokens.access,
                "Content-Type": "application/json",
            }
        }).then(res => res.json())
            .then(res => setUser(res.user))
        localStorage.setItem('authTokens', JSON.stringify(tokens));
    };

    const logout = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };

    const updateToken = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/rfresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh: authTokens?.refresh })
            });
            const data = await response.json();

            if (response.ok) {
                setAuthTokens(data);
                fetch("http://localhost:3000/auth/get_user", {
                    method: "GET",
                    headers: {
                        'authorization': 'Bearer ' + authTokens.access,
                        "Content-Type": "application/json",
                    }
                }).then(res => res.json())
                    .then(res => setUser(res.user))
                localStorage.setItem('authTokens', JSON.stringify(data));
            } else {
                logout();
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            logout();
        }
    };

    useEffect(() => {
        const fourMinutes = 1000 * 60 * 4;
        const interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fourMinutes);
        return () => clearInterval(interval);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={{
            user,
            authTokens,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}