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

    const postStatistic = async() =>{
      const video_id = 'nN5awumyZMw'
      const response = await fetch(`/api/statistic/by-video?video_id=${video_id}`);
      const data = await response.json();
    }

    postStatistic();
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
