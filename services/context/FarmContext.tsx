"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchKenyaMarketData } from '@/services/market-api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FarmContext = createContext<any>(null);

export const FarmProvider = ({ children }: { children: React.ReactNode }) => {
  const [farmData, setFarmData] = useState({
    livestock: [],
    crops: [],
    market: null,
    loading: true
  });

  const syncFarm = async () => {
    // 1. Fetch User Data (Livestock & Crops from Supabase)
    const { data: animals } = await supabase.from('livestock').select('*');
    const { data: plants } = await supabase.from('crops').select('*');

    // 2. Fetch Market Data (Ksh Prices)
    const marketPrices = await fetchKenyaMarketData();

    setFarmData({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      livestock: animals as any || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      crops: plants as any || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      market: marketPrices as any,
      loading: false
    });
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { syncFarm(); }, []);

  return (
    <FarmContext.Provider value={{ ...farmData, refresh: syncFarm }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
