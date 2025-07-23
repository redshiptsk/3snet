import React, { useState, useEffect } from 'react';
import { ApiResponse} from './types';

const App: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://3snet.co/js_test/api.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonData: ApiResponse = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear(prev => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear(prev => prev + 1);
  };

  const getDisplayMonths = () => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = (currentMonth + i) % 12;
      const year = currentYear + Math.floor((currentMonth + i) / 12);
      return { month, year };
    });
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  if (!data) return <div className="flex justify-center items-center h-screen">No data available</div>;

  const displayMonths = getDisplayMonths();

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1440px]">
      <h1 className="text-xl font-bold mb-6">Admin Performance Dashboard</h1>
      
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          ← Previous
        </button>
        
        <div className="flex space-x-4">
          {displayMonths.map(({ month, year }, index) => (
            <div key={index} className="text-center px-4 py-2 bg-gray-100 rounded">
              <div className="font-semibold">
                {new Date(year, month).toLocaleString('default', { month: 'long' })}
              </div>
              <div className="text-sm text-gray-500">{year}</div>
            </div>
          ))}
        </div>
        
        <button onClick={handleNextMonth} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Next →
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th rowSpan={2} colSpan={2} className="py-3 px-4 border-b border-gray-200 text-left sticky left-0 bg-gray-100 z-10"></th>
              {displayMonths.map(({ month, year }, index) => (
                <th key={index} colSpan={2} className="py-3 px-4 border-b border-gray-200 text-center">
                  {new Date(year, month).toLocaleString('default', { month: 'short' })} {year}
                </th>
              ))}
            </tr>
            <tr>
              {displayMonths.map((_, monthIndex) => (
                <React.Fragment key={monthIndex}>
                  <th className="py-2 px-4 border-b border-gray-200 text-center bg-blue-50">Plan</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-center bg-green-50">Fact</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50 font-semibold">
              <td rowSpan={2} className="py-2 px-4 border-b border-gray-200 sticky left-0 bg-gray-50 z-10">Admin</td>
              <td className="py-2 px-4 border-b border-gray-200 sticky left-0 bg-gray-50 z-10">TOTAL INCOME</td>
              {displayMonths.map(({ month }) => {
                const totalData = data.data.total[month];
                return (
                  <React.Fragment key={month}>
                    <td className="py-2 px-4 border-b border-gray-200 text-center bg-blue-100">
                      {totalData?.plan.income.toLocaleString() || '0'}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center bg-green-100">
                      {totalData?.fact.income.toLocaleString() || '0'}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
            <tr className="bg-gray-50 font-semibold">
              <td className="py-2 px-4 border-b border-gray-200 sticky left-0 bg-gray-50 z-10">TOTAL PARTNERS</td>
              {displayMonths.map(({ month }) => {
                const totalData = data.data.total[month];
                return (
                  <React.Fragment key={month}>
                    <td className="py-2 px-4 border-b border-gray-200 text-center bg-blue-100">
                      {totalData?.plan.activePartners.toLocaleString() || '0'}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center bg-green-100">
                      {totalData?.fact.activePartners.toLocaleString() || '0'}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>

            {data.data.table.map((admin) => (
              <React.Fragment key={admin.id}>
                <tr className="hover:bg-gray-50">
                  <td rowSpan={2} className="py-2 px-4 border-b border-gray-200 sticky left-0 bg-white z-10">
                    <span className="font-medium">{admin.adminName}</span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 sticky left-0 bg-white z-10">
                    Income
                  </td>
                  {displayMonths.map(({ month }) => {
                    const monthData = admin.months[month];
                    return (
                      <React.Fragment key={month}>
                        <td className="py-2 px-4 border-b border-gray-200 text-center bg-blue-50">
                          {monthData?.plan.income.toLocaleString() || 'No Data'}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center bg-green-50">
                          {monthData?.fact.income.toLocaleString() || 'No Data'}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200 sticky left-0 bg-white z-10">
                    Partners
                  </td>
                  {displayMonths.map(({ month }) => {
                    const monthData = admin.months[month];
                    return (
                      <React.Fragment key={month}>
                        <td className="py-2 px-4 border-b border-gray-200 text-center bg-blue-50">
                          {monthData?.plan.activePartners.toLocaleString() || 'No Data'}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center bg-green-50">
                          {monthData?.fact.activePartners.toLocaleString() || 'No Data'}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;