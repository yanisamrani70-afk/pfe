import { useState } from "react";
import "./Form.css";
import { Link } from "react-router-dom";

function Form() {
  


  const [formData, setFormData] = useState({
    full_name: "",
    customer_identifier: "",
    transaction_number: "",
    payment_date: "",
    amount: "",
    reason: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.full_name) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.customer_identifier) {
      newErrors.customer_identifier = "Customer ID is required";
    }

    if (!formData.payment_date) {
      newErrors.payment_date = "Payment date is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Valid amount required";
    }

    if (!formData.reason) {
      newErrors.reason = "Reason is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }

    return newErrors;
  };

  // Submit
  /*
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Refund Request:", formData);

      alert("Refund request submitted successfully!");

      setFormData({
        full_name: "",
        customer_identifier: "",
        transaction_number: "",
        payment_date: "",
        amount: "",
        reason: "",
        phone: "",
      });

      setErrors({});
    }
      */
     const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
  } else {
    try {
      const response = await fetch("http://localhost:5000/api/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      alert("Data sent to server successfully!");

    } catch (error) {
      console.error("Error:", error);
    }
  }
};
  

  return (
    <div className="container">
     

      <form onSubmit={handleSubmit}>
        
     
         <h2>demonde de romborsement</h2>

        <div className="input-group">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
          />
          {errors.full_name && <p className="error">{errors.full_name}</p>}
        </div>

        <div className="input-group">
          <input
            type="text"
            name="customer_identifier"
            placeholder="Customer ID"
            value={formData.customer_identifier}
            onChange={handleChange}
          />
          {errors.customer_identifier && (
            <p className="error">{errors.customer_identifier}</p>
          )}
        </div>

        <div className="input-group">
          <input
            type="text"
            name="transaction_number"
            placeholder="Transaction Number (optional)"
            value={formData.transaction_number}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            type="date"
            name="payment_date"
            value={formData.payment_date}
            onChange={handleChange}
          />
          {errors.payment_date && (
            <p className="error">{errors.payment_date}</p>
          )}
        </div>

        <div className="input-group">
          <input
            type="number"
            step="0.01"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
          />
          {errors.amount && <p className="error">{errors.amount}</p>}
        </div>

        <div className="input-group">
          <textarea
            name="reason"
            placeholder="Reason for refund"
            value={formData.reason}
            onChange={handleChange}
          />
          {errors.reason && <p className="error">{errors.reason}</p>}
        </div>

        <div className="input-group">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>
      <Link to="/Agent">go to agent</Link>
      </div>
   
  );
}


export default Form;