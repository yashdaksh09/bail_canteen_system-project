import React, { useEffect, useState } from "react";
function MealStatus() {
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const employeeCode = localStorage.getItem("employee_code"); // ✅ Get stored employee code
    console.log("👤 Employee Code from localStorage:", employeeCode);

    if (!employeeCode) {
      setError("⚠️ Employee code not found. Please scan your QR again.");
      return;
    }   

    fetch(`http://localhost:8281/meal-status/${employeeCode}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("🍽️ Meal data received:", data);
        if (data && data.meal_type) {
          setMeal(data);
        } else {
          setError("⚠️ No recent meal found.");
        }
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setError("⚠️ No recent meal found.");
      });
  }, []);

  if (error) return <p className="mt-5 text-red-600">{error}</p>;

  if (!meal) return <p className="mt-5">Loading meal data...</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">🍴 Latest Meal Status</h2>
      <div className="space-y-2">
        <p><strong>Employee Code:</strong> {meal.employee_code}</p>
        <p><strong>Name:</strong> {meal.employee_name}</p>
        <p><strong>Department:</strong> {meal.employee_department}</p>
        <p><strong>Designation:</strong> {meal.employee_designation}</p>
        <p><strong>Meal Type:</strong> {meal.meal_type}</p>
        <p><strong>Quantity:</strong> {meal.quantity}</p>
        <p><strong>Token Number:</strong> {meal.token_number}</p>
        <p><strong>Order Time:</strong> {new Date(meal.order_time).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default MealStatus;