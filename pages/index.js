// app/page.js
'use client';
import { useEffect, useState } from 'react';
import HomeClient from '../components/HomeClient';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <HomeClient />
    </div>
  );
};

export default Home;
