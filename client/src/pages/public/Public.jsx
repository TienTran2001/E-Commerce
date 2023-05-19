import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopHeader, Header, Navigation } from '../../components';

const Public = () => {
  return (
    <section className="w-full flex flex-col items-center">
      <TopHeader />
      <Header />
      <Navigation />
      <main className="w-main px-5">
        <Outlet />
      </main>
    </section>
  );
};

export default Public;
