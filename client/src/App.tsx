import React, { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080";
const LOGIN_URL = "http://localhost:8080/login"

function App() {
  const [data, setData] = useState<string>("");
  const [token, setToken] = useState<string | null>(null)

  const login = async () => {
   try {
    const response = await fetch(LOGIN_URL, {
        method: "POST",
        body: JSON.stringify({ username: "George"}), // sample username since login is simulated
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
    });
    const { accessToken } = await response.json()
    setToken(accessToken)
   } catch (error) {
    console.error("Error during login", error.message)
   }
    
  }

  const getData = useCallback(async (fetchToken: string | null) => {
    try {
        if(!fetchToken) {
            return
        }
        
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${fetchToken}`
            }
        } );

        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const { data } = await response.json();
        setData(data);
    } catch (error) {
        console.error("Error fetching", error.message)
    }
  }, [])

  useEffect(() => {
    login()
  }, [])

  useEffect(() => {
    if(token) {
        getData(token);
    }
  }, [token, getData]);

  

  

  const updateData = async () => {

    if(!token) {
        return
    }
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
       Authorization: `Bearer ${token}`
      },
    });

    await getData(token);
  };

  const verifyData = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        } );

        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const { data: serverData } = await response.json();

        if(serverData === data) {
            alert('Data is verified')
        } else {
            alert('Data is not verified and will be reverted')
            setData(serverData)
        }
    } catch (error) {
        console.log("Error verifying", error.message)
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
