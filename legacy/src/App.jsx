import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import GetWeather from './components/GetWeather';
import Weather from './components/Weather';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path ="/" exact element ={<GetWeather />}></Route>
      <Route path ="/weather" exact element ={<Weather />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;