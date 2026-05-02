import { useState, useEffect } from "react";
import "./Agent.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoutLogo from "./assets/logout-16.ico";
import { Navigate } from "react-router-dom";


// icons imported from https://icons.getbootstrap.com/icons
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-moon" viewBox="0 0 16 16">
  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
</svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
</svg>
);


function Agent() {
  const [demandes, setDemandes] = useState([]);
  const [doublePayments, setDoublePayments] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [filteredPayments, setFilteredPayments] = useState([]);
const [dark, setDark] = useState(false);

  const token = localStorage.getItem("token");


// Toggle dark mode
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);



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
  
   toast.error("This is not a duplicate payment");
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
   
    payment_date: selectedDemande.payment_date,
    amount: selectedDemande.amount,
    phone: selectedDemande.phone,
    bl: selectedDemande.bl
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
    toast.success("Saved in database ");
  } catch (err) {
    console.error(err);
    toast.error(`${err.message}`);
  }
};
  // Reject
const handleReject = async () => {
  if (!selectedDemande) return;
  if (!window.confirm(`Reject request of ${selectedDemande.full_name}?`)) return;

  try {
    const res = await fetch(`http://localhost:5000/api/${selectedDemande.id}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    // تحديث الواجهة بعد النجاح
    setDemandes((prev) =>
      prev.map((d) =>
        d.id === selectedDemande.id ? { ...d, status: "rejected" } : d
      )
    );
    toast.success("Demand rejected successfully");
  } catch (err) {
    console.error(err);
     toast.error("Error rejecting request");
    
  }
};


    
const handleLogout = () => {
  if (window.confirm("Are you sure you want to log out?")) {
  localStorage.removeItem("token"); 
  localStorage.removeItem("role");
  window.location.href = "/";   
  }   
};
/*
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleLogout = () => {
  localStorage.clear();
  navigate("/");
};
*/
  return (
    <>
      <header className="header">
        <h1>Agent Dashboard</h1>
         <img src="/photo_2026-03-06_00-59-26.jpg" alt="" />

         <div className="buttons-container">
                   <button className="theme-toggle-btn" onClick={() => setDark(!dark)}>
                     {dark ? <SunIcon /> : <MoonIcon />}
                   </button>
                 
                  <button onClick={handleLogout} className="logout-btn">
                   <img src={logoutLogo} alt="Logout"/> Logout
                </button>
                </div>
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
                   
                    <th>BL</th>
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
                       
                        <td>{demande.bl}</td>
                        <td>{demande.payment_date}</td>
                        <td>{demande.amount} DA</td>
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
                      <td colSpan="8" className="empty-message">
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
                    <th>BL</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.customer_identifier}</td>
                        <td>{payment.bl}</td>
                        <td>{payment.amount} DA</td>
                        <td>{payment.payment_date}</td>
                        <td>{payment.type}</td>
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
  disabled={!selectedDemande || selectedDemande.status === "approved" || selectedDemande.status === "rejected"} 
  onClick={handleApprove}
>
  sent_to_finance
</button>
          <button
            className="btn reject"
             disabled={
                   !selectedDemande || selectedDemande.status === "rejected" || selectedDemande.status === "approved"
                    }
            onClick={handleReject}
          >
            REJECT
          </button>
        </div>
      </main>
 
 <ToastContainer position="top-center" autoClose={3000} />
      <footer>
        <p>Prototype © 2026</p>
      </footer>
    </>
  );
}

export default Agent;