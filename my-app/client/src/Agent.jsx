import { useState, useEffect } from "react";
import "./Agent.css";

function Agent() {
  const [demandes, setDemandes] = useState([]);
  const [doublePayments, setDoublePayments] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [filteredPayments, setFilteredPayments] = useState([]);

  // تحميل البيانات من backend
  useEffect(() => {
    // طلبات الزبائن
    fetch("http://localhost:5000/api/demandes")
      .then((res) => res.json())
      .then((data) => setDemandes(data))
      .catch((err) => console.error("Erreur demandes:", err));

    // المدفوعات المكررة
    fetch("http://localhost:5000/api/double-payments")
      .then((res) => res.json())
      .then((data) => setDoublePayments(data))
      .catch((err) => console.error("Erreur payments:", err));
  }, []);

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

  // Approve
  const handleApprove = () => {
    if (!selectedDemande) return;
    if (!window.confirm(`Approve request of ${selectedDemande.full_name}?`)) return;

    setDemandes((prev) =>
      prev.map((d) =>
        d.id === selectedDemande.id ? { ...d, status: "approved" } : d
      )
    );

    setSelectedDemande(null);
    setFilteredPayments([]);
    alert("Request Approved");
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

  return (
    <>
      <header className="header">
        <h1>Agent Dashboard</h1>
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
            disabled={!selectedDemande || selectedDemande.status}
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

      <footer>
        <p>Prototype © 2026</p>
      </footer>
    </>
  );
}

export default Agent;