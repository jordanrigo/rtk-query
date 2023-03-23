import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useAddPetMutation, useFindPetsByStatusQuery } from "./services/petApi";
import { useLoginMutation } from "./services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/auth.slice";

function App() {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);

  const { data, isLoading, isError, refetch } = useFindPetsByStatusQuery(
    {
      status: "available",
    }
    // { pollingInterval: 3000 }
  );

  const [createPet, status] = useAddPetMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const createPetHandler = async () => {
    try {
      await createPet({
        pet: {
          id: 1123456,
          name: "RTK-QUERY",
          category: {
            id: 1,
            name: "Dogs",
          },
          photoUrls: ["string"],
          tags: [
            {
              id: 0,
              name: "string",
            },
          ],
          status: "available",
        },
      }).unwrap();

      refetch();
    } catch (e) {
      console.error("elhasalt");
    }
  };

  const handleLogin = async () => {
    try {
      const user = await login({
        username: "kminchelle",
        password: "0lelplR",
      }).unwrap();

      dispatch(setCredentials(user));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <button onClick={handleLogin}>Login</button>

        <button onClick={createPetHandler}>Add Pet</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
