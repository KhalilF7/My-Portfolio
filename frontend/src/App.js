import React from 'react';

import { About, Education, Footer, Header, Skills, Work } from './containers';
import { Navbar, SiteFooter } from './components';
import './App.scss';

const App = () => (
  <div className="app">
    <Navbar />
    <main>
      <Header />
      <About />
      <Work />
      <Skills />
      <Education />
      <Footer />
    </main>
    <SiteFooter />
  </div>
);

export default App;
