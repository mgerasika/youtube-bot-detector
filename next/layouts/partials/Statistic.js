"use client"; // Add this line

import { useEffect, useState } from 'react';

const Statistic = () => {
  const [statistic, setStatistic] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/statistic');
      const data = await response.json();
      setStatistic(data);
    };

    fetchUsers();
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
