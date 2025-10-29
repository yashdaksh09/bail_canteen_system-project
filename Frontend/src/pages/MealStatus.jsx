import React, { useEffect, useState } from "react";

function MealStatus() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/get-meal-status")
      .then((res) => res.json())
      .then((data) => setMeals(data))
      .catch((err) => console.error("Error loading meal status:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">🍽️ Meal Status</h2>

      {meals.length === 0 ? (
        <p>No meals recorded yet.</p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2">Token</th>
              <th className="p-2">Name</th>
              <th className="p-2">Meal</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((m) => (
              <tr key={m.token_number} className="border-t text-center">
                <td className="p-2 font-bold">{m.token_number}</td>
                <td className="p-2">{m.employee_name}</td>
                <td className="p-2">{m.meal_type}</td>
                <td className="p-2">{m.quantity}</td>
                <td className="p-2">{new Date(m.order_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MealStatus;
