"use client"; // Add this line

import { useEffect, useState } from 'react';

const Statistic = () => {
  const [statistic, setStatistic] = useState();

  useEffect(() => {
    const fetchStatistic = async () => {
      const response = await fetch('/api/statistic/info');
      const data = await response.json();
      setStatistic(data);
    };

    const postScan = async() =>{
      const video_id = 'nN5awumyZMw'
      const response = await fetch(`/api/scan/by-video?video_id=${video_id}`);
      const data = await response.json();
    }

    postScan();
    fetchStatistic();
  }, []);

  return (
    <div className="flex justify-center">
      <pre>
        {JSON.stringify(statistic, null, 2)}
      </pre>
    </div>
  );
};

export default Statistic;
