import { useState, useEffect } from "react";
import "./Agent.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Agent() {
  const [demandes, setDemandes] = useState([]);
  const [doublePayments, setDoublePayments] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [filteredPayments, setFilteredPayments] = useState([]);
const token = localStorage.getItem("token");
  // تحميل البيانات من backend
  useEffect(() => {
    // طلبات الزبائن
    fetch("http://localhost:5000/api/demandes", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
      .then((res) => res.json())
      .then((data) => setDemandes(data))
      .catch((err) => console.error("Erreur demandes:", err));

    // المدفوعات المكررة
    fetch("http://localhost:5000/api/double-payments", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
      .then((res) => res.json())
      .then((data) => setDoublePayments(data))
      .catch((err) => console.error("Erreur payments:", err));
  }, []);
/*ta3 imad
  // عند الضغط على طلب
  const handleRowClick = (demande) => {
    setSelectedDemande(demande);

    // فلترة المدفوعات المكررة بناءً على customer_identifier + amount + payment_date
    const filtered = doublePayments.filter(
      (p) =>
        p.customer_identifier === demande.customer_identifier &&
        Number(p.amount) === Number(demande.amount) &&
        p.payment_date === demande.payment_date
    );

    setFilteredPayments(filtered);
  };
*/
//ta3 yanis 
const handleRowClick = (demande) => {
  setSelectedDemande(demande);

  const filtered = doublePayments.filter((p) => {
    // تحويل التاريخ إلى yyyy-mm-dd
    const datePayment = new Date(p.payment_date).toISOString().split("T")[0];
    const dateDemande = new Date(demande.payment_date).toISOString().split("T")[0];

    // مقارنة customer_identifier + amount + التاريخ
    return (
      p.customer_identifier === demande.customer_identifier &&
      Number(p.amount) === Number(demande.amount) &&
      datePayment === dateDemande
    );
  });

  console.log("Filtered Payments:", filtered); // لمراجعة النتائج في الكونسول
  setFilteredPayments(filtered);
};
  // Approve ta3 immad sans backend

   const handleApprove = async () => {
  if (!selectedDemande) return;

  // لازم يكون دفع مرتين
  if (filteredPayments.length < 1) {
    alert("This is not a duplicate payment ❌");
    return;
  }

  if (!window.confirm(`Approve request of ${selectedDemande.full_name}?`)) return;

  try {
const res = await fetch("http://localhost:5000/api/approve", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
   Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    id: selectedDemande.id,
    full_name: selectedDemande.full_name,
    customer_identifier: selectedDemande.customer_identifier,
    transaction_number: selectedDemande.transaction_number,
    payment_date: selectedDemande.payment_date,
    amount: selectedDemande.amount,
    phone: selectedDemande.phone
  })
});


/*
    const res = await fetch("http://localhost:5000/api/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedDemande.id, // ⬅️ مهم جدًا
        full_name: selectedDemande.full_name,
        customer_identifier: selectedDemande.customer_identifier,
        transaction_number: selectedDemande.transaction_number,
        payment_date: selectedDemande.payment_date,
        amount: selectedDemande.amount,
        phone: selectedDemande.phone,
      }),
    });
    */

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error saving");
    }

    // تحديث الواجهة
    setDemandes((prev) =>
      prev.map((d) =>
        d.id === selectedDemande.id ? { ...d, status: "approved" } : d
      )
    );

    setSelectedDemande(null);
    setFilteredPayments([]);
    toast.success("Saved in database ✅");
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Server error ❌");
  }
};
  // Reject
  const handleReject = () => {
    if (!selectedDemande) return;
    if (!window.confirm(`Reject request of ${selectedDemande.full_name}?`)) return;

    setDemandes((prev) =>
      prev.map((d) =>
        d.id === selectedDemande.id ? { ...d, status: "rejected" } : d
      )
    );

    setSelectedDemande(null);
    setFilteredPayments([]);
    alert("Request Rejected");
  };
 const handleLogout = () => {
  localStorage.removeItem("token"); 
  localStorage.removeItem("role");
  window.location.href = "/";      
};
  return (
    <>
      <header className="header">
        <h1>Agent Dashboard</h1>
         <img src="/photo_2026-03-06_00-59-26.jpg" alt="" />

          <button onClick={handleLogout} className="logout-btn">
           Logout
       </button>
      </header>

      <main>
        <div className="tables-container">
          {/* TABLE DEMANDES */}
          <div className="table-wrapper demandes">
            <h2>Refund Requests</h2>
            <div className="table-container">
              <table>
                <thead className="table-header">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Customer ID</th>
                    <th>Transaction</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Reason</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {demandes.length > 0 ? (
                    demandes.map((demande) => (
                      <tr
                        key={demande.id}
                        onClick={() => handleRowClick(demande)}
                        className={selectedDemande?.id === demande.id ? "selected" : ""}
                      >
                        <td>{demande.id}</td>
                        <td>{demande.full_name}</td>
                        <td>{demande.customer_identifier}</td>
                        <td>{demande.transaction_number}</td>
                        <td>{demande.payment_date}</td>
                        <td>{demande.amount} €</td>
                        <td>{demande.reason}</td>
                        <td>{demande.phone}</td>
                        <td>
                          <span className={`status-badge ${demande.status || "pending"}`}>
                            {demande.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="empty-message">
                        No requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE DOUBLE PAYMENTS */}
          <div className="table-wrapper double-payments">
            <h2>
              Duplicate Payments
              {selectedDemande && ` - Client ${selectedDemande.customer_identifier}`}
            </h2>
            <div className="table-container">
              <table>
                <thead className="table-header">
                  <tr>
                    <th>Customer ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.customer_identifier}</td>
                        <td>{payment.amount} €</td>
                        <td>{payment.payment_date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="empty-message">
                        {selectedDemande ? "No duplicate payments" : "Select a request"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
              <button
  className="btn approve"
  disabled={!selectedDemande || selectedDemande.status === "approved"} 
  onClick={handleApprove}
>
  sent_to_finance
</button>
          <button
            className="btn reject"
            disabled={!selectedDemande || selectedDemande.status}
            onClick={handleReject}
          >
            REJECT
          </button>
        </div>
      </main>
 <Link to="/Finance">go to f</Link>
 <ToastContainer position="top-center" autoClose={3000} />
      <footer>
        <p>Prototype © 2026</p>
      </footer>
    </>
  );
}

export default Agent;