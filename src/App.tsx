import './App.css'
import CurrentText from "./components/current-text/current-text.tsx";
import {Provider} from "react-redux";
import {store} from "./app/store.ts";
import React from "react";

const App: React.FC = () => {

  return (
   <Provider store={store}>
       <CurrentText/>
   </Provider>
  )
}

export default App
