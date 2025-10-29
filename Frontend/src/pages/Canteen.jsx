import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Canteen() {
  const [employee, setEmployee] = useState(null);
  const [availableMeal, setAvailableMeal] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");

    if (code) {
      fetch(`http://localhost:8281/get-employee/${code}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Employee Data:", data);
          setEmployee(data);
        })
        .catch((err) => console.error("Error fetching employee:", err));
    }

    // Determine meal timing
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 7 && hour < 10.5) setAvailableMeal("Breakfast");
    else if (hour >= 11 && hour < 15) setAvailableMeal("Lunch");
    else if (hour >= 16 && hour < 18.5) setAvailableMeal("Snacks");
    else if (hour >= 19 && hour < 22) setAvailableMeal("Dinner");
    else setAvailableMeal("None");
  }, []);

  const handleSubmit = async () => {
    if (!selectedMeal) {
      setMessage("⚠️ Please select a meal.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8281/submit-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...employee,
          meal_type: selectedMeal,
          quantity: Number(quantity),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server Error:", text);
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      console.log("Meal response:", data);

      // ✅ Redirect to Token Page with details
      navigate("/token", {
        state: {
          employee,
          token: data.token_number,
          orderTime: data.order_time,
          meal_type: selectedMeal,
          quantity,
        },
      });
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong!");
    }
  };

  if (!employee) return <p className="mt-5 text-center">Loading employee details...</p>;

  return (
    <div className="p-6">
      <h2 className="mt-5 text-xl font-bold">Employee Details</h2>
      <p><strong>Code:</strong> {employee.employee_code}</p>
      <p><strong>Name:</strong> {employee.employee_name}</p>
      <p><strong>Designation:</strong> {employee.employee_designation}</p>
      <p><strong>Department:</strong> {employee.employee_department}</p>

      {availableMeal === "None" ? (
        <p className="text-red-600 mt-4">❌ No meal available at this time.</p>
      ) : (
        <div className="mt-5">
          <h3 className="font-semibold">Available Meal: {availableMeal}</h3>

          <select
            className="border form-select p-2 rounded mt-2"
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value)}
          >
            <option value="">Select Meal</option>
            {["Breakfast", "Lunch", "Snacks", "Dinner"].map((meal) => (
              <option key={meal} value={meal} disabled={meal !== availableMeal}>
                {meal}
              </option>
            ))}
          </select>

          <div className="mt-3">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border form-control p-2 rounded ml-2"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 btn btn-success bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit
          </button>

          {message && <p className="mt-3 text-red-600">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default Canteen;
