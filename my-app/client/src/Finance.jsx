import { useState, useEffect } from "react";
import "./Finance.css";
import { Link } from "react-router-dom";
import logoutLogo from "./assets/logout-16.ico";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";



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
  const [bankXLSX, setBankXLSX] = useState([]);
  const [filteredXLSX, setFilteredXLSX] = useState([]);
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
   fetch("http://localhost:5000/api/approved-refunds", {
    headers: {
      Authorization: `Bearer ${token}`, // صححت هنا
    },
  })
    .then((res) => res.json())
    .then((data) => setDemandes(data))
    .catch((err) => console.error("Erreur demandes:", err));
}, []);

 // read xlsx file source : https://dev.to/enesakk0/react-read-excel-and-data-visualize-1498
  useEffect(()=> {
  // fetch the file in public folder
  fetch("/bank.xlsx")
  .then((res) => res.arrayBuffer())
  .then((data) => {
const wb = XLSX.read(data,{type: "buffer"});
const sheetName = wb.SheetNames[0]; 
const sheet = wb.Sheets[sheetName];

//convert to JSON 
const rows = XLSX.utils.sheet_to_json(sheet);
  
//setData(json)
setBankXLSX(rows);
      setFilteredXLSX(rows);

  });

  },[]);
//
// حساب المدفوعات المكررة
const getDuplicatePayments = () => {
  const duplicates = [];
  const seen = {};

  bankXLSX.forEach((row) => {
    const key = `${row.BL}-${row.customer_id}-${row.amount}`; // مفتاح فريد لكل دفعة
    if (seen[key]) {
      duplicates.push(row); // تم الدفع مسبقًا
    } else {
      seen[key] = true;
    }
  });

  return duplicates;
};
  
  // // Check if row is valid by BL
  // const isRowValid = (row, demande) => {
  //   if (!demande ||  rows.length < 2) return false;
  //   return Number(row.amount) === Number(demande.amount) && row.status === "paid";
  // };

  // Filter CSV by selected demande
  const handleRowClick = (demande) => {
    setSelectedDemande(demande);

     const matches = bankXLSX.filter((row)=>row.BL===demande.bl && Number(row.amount)===Number(demande.amount)&& row.status=="paid");
   
     if (matches.length > 1) {
    setFilteredXLSX(matches);
    setIsValid(true);
  }else if(matches.length == 1){

    setFilteredXLSX(matches);
    setIsValid(false);
  }
  
  else{
    setFilteredXLSX(bankXLSX);
    setIsValid(false);
  }
  };

  // Clear selection
  const resetSelection = () => {
    setSelectedDemande(null);
    setFilteredXLSX(bankXLSX);
    setIsValid(false);
  };

  // Approve
  const handleApprove = async () => {
  if (!selectedDemande) return;
  if (!window.confirm(`Approve refund for ${selectedDemande.full_name}?`)) return;

  // تحقق من صحة العملية
  if (!isValid) {
    
    toast.error("This refund does not match a valid bank transaction ");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/caissiersend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: selectedDemande.full_name,
        customer_id: selectedDemande.customer_identifier,
        bl: selectedDemande.bl,
       
        amount: selectedDemande.amount,
        payment_date: selectedDemande.payment_date,
        status: "pending",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Insert failed");
    }

setDemandes((prev) =>
        prev.map((d) =>
          d.id === selectedDemande.id ? { ...d, status: "approved" } : d
        )
      );
    // رسالة نجاح
    
    toast.success("Inserted into caissier_table successfully");

  } catch (err) {
    console.error("Error inserting into caissier_table:", err);
    toast.error(`${err.message}`);
      
  
    
  }
};



const handleReject = async () => {
    if (!selectedDemande) return;

    if (!window.confirm(`Reject ${selectedDemande.full_name}?`)) return;

    try {
      const res = await fetch(
         `http://localhost:5000/api/demandes/${selectedDemande.id}/rejectfinance`,
        
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setDemandes((prev) =>
        prev.map((d) =>
          d.id === selectedDemande.id ? { ...d, status: "rejected" } : d
        )
      );

      toast.success("Rejected successfully");
      setSelectedDemande(null);
    } catch (err) {
      toast.error("Error rejecting");
    }
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

  const handleLogout = () => {
  if (window.confirm("Are you sure you want to log out?")) {
  localStorage.removeItem("token"); 
  localStorage.removeItem("role");
  window.location.href = "/";   
  }   
};

  return (
    <div className="app-container">
      <header className="header">
        <h1>Finance Dashboard</h1>
        {/* <div className="header-right"> */}
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
                    
                    <th>Date</th>
                    <th>Amount</th>
                    {/* <th>Reason</th> */}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
  {demandes.length > 0 ? (
    demandes.map((demande) =>(
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
                
                    <th>Customer ID</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredXLSX.length > 0 ? (
                    filteredXLSX.map((row, index) => {
                      const isInvalid = selectedDemande && row.BL === selectedDemande.BL && !isRowValid(row, selectedDemande);
                      return (
                        <tr key={index} className={isInvalid ? "invalid" : ""}>
                          <td>{row.BL}</td>
                       
                          <td>{row.customer_id}</td>
                          <td>{row.name}</td>
                          <td>{row.amount} DA</td>
                          <td>{row.date}</td>
                          <td>{row.status}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-message">
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
            disabled={!isValid || isButtonDisabled || selectedDemande.status === "rejected" || selectedDemande.status === "approved"}
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="btn reject"
            disabled={isButtonDisabled || selectedDemande.status === "rejected" || selectedDemande.status === "approved"}
            onClick={handleReject}
          >
            Reject
          </button>
          </div>
      </main>
  <ToastContainer position="top-center" autoClose={3000} />  
      <footer>
        <p>Prototype © 2026</p>
      </footer>
      
 
    </div>
  );
}

export default Finance;
