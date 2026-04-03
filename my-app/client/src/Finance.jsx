import { useState, useEffect } from "react";
import "./Finance.css";
import { Link } from "react-router-dom";
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

function Finance() {
  const [demandes, setDemandes] = useState([]);
  const [bankCSV, setBankCSV] = useState([]);
  const [filteredCSV, setFilteredCSV] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [dark, setDark] = useState(false);
//rbac
  const token = localStorage.getItem("token");

  // Toggle dark mode
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // Load data from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/approved-refunds",{
       headers: {
        //rbac
    Authorization: `Bearer ${token}`
  }
    })
      .then((res) => res.json())
      .then((data) => setDemandes(data))
      .catch((err) => console.error("Erreur demandes:", err));

   
  }, []);


useEffect(() => {
    fetch("/bank.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const headers = lines[0].split(";");
        const rows = lines.slice(1).map((line) => {
          const values = line.split(";");
          const row = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || "";
          });
          return row;
        });
        setBankCSV(rows);
        setFilteredCSV(rows);
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);
//
// حساب المدفوعات المكررة
const getDuplicatePayments = () => {
  const duplicates = [];
  const seen = {};

  bankCSV.forEach((row) => {
    const key = `${row.BL}-${row.customer_id}-${row.amount}`; // مفتاح فريد لكل دفعة
    if (seen[key]) {
      duplicates.push(row); // تم الدفع مسبقًا
    } else {
      seen[key] = true;
    }
  });

  return duplicates;
};
  
  // Check if row is valid by BL
  const isRowValid = (row, demande) => {
    if (!demande || row.BL !== demande.BL) return false;
    return row.amount === demande.amount && row.status === "paid";
  };

  // Filter CSV by selected demande
  const handleRowClick = (demande) => {
    setSelectedDemande(demande);

    const match = bankCSV.find((row) => row.BL === demande.BL);
    
    if (match) {
      setFilteredCSV([match]);
      setIsValid(isRowValid(match, demande));
    } else {
      setFilteredCSV(bankCSV);
      setIsValid(false);
    }
  };

  // Clear selection
  const resetSelection = () => {
    setSelectedDemande(null);
    setFilteredCSV(bankCSV);
    setIsValid(false);
  };

  // Approve
  const handleApprove = async () => {
  if (!selectedDemande) return;
  if (!window.confirm(`Approve refund for ${selectedDemande.full_name}?`)) return;

  try {
    const res = await fetch("http://localhost:5000/api/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: selectedDemande.id,
        full_name: selectedDemande.full_name,
        customer_identifier: selectedDemande.customer_id,
        transaction_number: selectedDemande.transaction_number,
        payment_date: selectedDemande.payment_date,
        amount: selectedDemande.amount,
        phone: selectedDemande.phone,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Server error");
    }

    // تحديث الواجهة
    setDemandes((prev) =>
      prev.map((d) =>
        d.id === selectedDemande.id ? { ...d, status: "Validé" } : d
      )
    );

    alert("Refund approved and saved in DB ✅");
    resetSelection();
  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};

  // Reject
  const handleReject = () => {
    if (!selectedDemande) return;
    if (!window.confirm(`Reject refund for ${selectedDemande.full_name}?`)) return;

    setDemandes((prev) =>
      prev.map((d) =>
        d.id === selectedDemande.id ? { ...d, status: "Rejeté" } : d
      )
    );

    alert("Refund rejected");
    resetSelection();
  };

  // Check if buttons disabled
  const isButtonDisabled = !selectedDemande || selectedDemande.status === "Validé" || selectedDemande.status === "Rejeté";

  // Get status badge class
  const getStatusClass = (status) => {
    if (status === "Pending") return "status-pending";
    if (status === "Validé") return "status-valide";
    if (status === "Rejeté") return "status-rejete";
    return "";
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Finance Dashboard</h1>
        <div className="header-right">
          <button className="theme-toggle-btn" onClick={() => setDark(!dark)}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <main>
        <div className="tables-container">
          {/* DEMANDS TABLE */}
          <div className="table-wrapper demandes">
            <h2>Refund Demands</h2>
            <div className="table-container">
              <table>
                <thead className="table-header">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Customer ID</th>
                    <th>BL</th>
                    <th>Transaction</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Reason</th>
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
        <td>{demande.customer_identifier}</td> {/* كان customer_id، صححناه */}
        <td>{demande.BL}</td>
        <td>{demande.transaction_number}</td>
        <td>{demande.payment_date}</td>
        <td>€{demande.amount}</td>
        <td>{demande.reason}</td>
        <td>{demande.phone}</td>
        <td>
          <span className={`status-badge ${getStatusClass(demande.status)}`}>
            {demande.status || "Pending"}
          </span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="10" className="empty-message">
        No approved refunds found
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>
          </div>

          {/* CSV TABLE */}
          <div className="table-wrapper double-payments">
            <h2>Bank Transactions</h2>
            <div className="table-container">
              <table>
                <thead className="table-header">
                  <tr>
                    <th>BL</th>
                    <th>Transaction</th>
                    <th>Customer ID</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredCSV.length > 0 ? (
                    filteredCSV.map((row, index) => {
                      const isInvalid = selectedDemande && row.BL === selectedDemande.BL && !isRowValid(row, selectedDemande);
                      return (
                        <tr key={index} className={isInvalid ? "invalid" : ""}>
                          <td>{row.BL}</td>
                          <td>{row.transaction_number}</td>
                          <td>{row.customer_id}</td>
                          <td>{row.name}</td>
                          <td>€{row.amount}</td>
                          <td>{row.date}</td>
                          <td>{row.status}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-message">
                        No transactions found
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
            disabled={!isValid || isButtonDisabled}
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="btn reject"
            disabled={isButtonDisabled}
            onClick={handleReject}
          >
            Reject
          </button>
          <Link to="/Agent">Go to Agent</Link>
          <Link to="/cassier">Go to c</Link>
        </div>
      </main>

      <footer>
        <p>Prototype © 2026</p>
      </footer>
    </div>
  );
}

export default Finance;
