import { useState, useEffect } from "react";
import "./cassier.css";

function cassier() {
  // table data
  const [payments, setPayments] = useState([]);

  // ids of checked rows
  const [selectedRows, setSelectedRows] = useState([]);
//rbac
const token = localStorage.getItem("token");

/*
  // load data once
  useEffect(() => {
    setPayments([
      { id: 1, name: "Yanis Amrani", customer_id: "C123", BL: "BL001", transaction_number: "TX1001", amount: 120, date: "2026-03-28", status: "approved" },
      { id: 2, name: "Sara Ahmed", customer_id: "C124", BL: "BL002", transaction_number: "TX1002", amount: 250, date: "2026-03-28", status: "pending" },
      { id: 3, name: "Ali Bensaid", customer_id: "C125", BL: "BL003", transaction_number: "TX1003", amount: 75, date: "2026-03-28", status: "approved" },
      { id: 4, name: "Nora Khelifi", customer_id: "C126", BL: "BL004", transaction_number: "TX1004", amount: 300, date: "2026-03-28", status: "pending" },
    ]);
  }, []);*/
  /* recieve data from the caissier table   */
 useEffect(() => {
    fetch("http://localhost:5000/api/caissier", {
  headers: {
    Authorization: `Bearer ${token}`
  }
 })
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((err) => console.error("Erreur demandes:", err));

   
  }, []);
  // style for status
  const getStatusClass = (status) => {
    return status === "approved" ? "status-approved" : "status-pending";
  };

  // click on checkbox
  const toggleCheckbox = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((x) => x !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  


    // select all
  const selectAll = () => {
    if (selectedRows.length === payments.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(payments.map((p) => p.id));
    }
  };

  // count pending rows 
  const countPending = () => {
    let count = 0;

    for (let id of selectedRows) {
      const p = payments.find((x) => x.id === id);
      if (p && p.status === "pending") {
        count++;
      }
    }

    return count;
  };
  // count approved rows 
   const  countApproved = () => {
    let count = 0; 
    for(let id of selectedRows){
      const p = payments.find((x) => x.id === id); 
      if(p &&  p.status === "approved"){
        count++;
      }
    }
    return count;
   };



  // check if there is approved selected
  const hasApproved = () => {
    for (let id of selectedRows) {
      const p = payments.find((x) => x.id === id);
      if (p && p.status === "approved") {
        return true;
      }
    }
    return false;
  };

  // approve button
  const handleApproveAll = async () => {
    // count pending rows status
    const pendingCount = countPending();
    const approvedCount = countApproved();

    // no pending
    if (pendingCount === 0 && approvedCount == 0) {
      alert("Select pending payments to approve");
      return;
    }
  
     // if no pending and only approved 
    if(!pendingCount && approvedCount > 0 ){
      alert("The selected payments are already approved");
      return;
    }
   

    // confirm with only pending count
    if (!window.confirm(`Approve ${pendingCount} payments?`)) return;
    
/*
    // update only pending
    const newPayments = payments.map((p) => {
      if (selectedRows.includes(p.id) && p.status === "pending") {
        return { ...p, status: "approved" };
      }
      return p;
    });

    setPayments(newPayments);
    setSelectedRows([]);

    alert("Payments approved");
    */

    // Identify exactly which items are being moved
  const itemsToApprove = payments.filter(
    (p) => selectedRows.includes(p.id) && p.status === "pending"
  );
/* hadik test l base de donnees brk ra7 nzidou nba3thou fichier excel l finance  */
  try {
    const res = await fetch("http://localhost:5000/api/caissier-post", {
      method: "POST",
      headers: { "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
       },
      body: JSON.stringify({ items: itemsToApprove }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Server error");

    // Update UI: set status to 'approved' for the items we just sent
    const newPayments = payments.map((p) => {
      if (selectedRows.includes(p.id) && p.status === "pending") {
        return { ...p, status: "approved" };
      }
      return p;
    });

    setPayments(newPayments);
    setSelectedRows([]);
    alert(`${pendingCount} payments approved and saved to DB`);
    
  } catch (err) {
    console.error(err);
    alert("Failed to approve");
  }

  };

  return (
    <div id="cassier-dashboard">
      <header id="cassier-header" className="header_caissier">
        <h1>Caissier Dashboard</h1>
      </header>

      <div id="approve-all-container">
        <h2>Caissier Table</h2>

        <button
          id="approve-all-btn"
          onClick={handleApproveAll}
          
        >
          Approve All
        </button>
      </div>

 <div id="cassier-table-container">

  <table id="cassier-table">
      <thead>
       <tr>
          <th className="checkbox-col">
            <input type="checkbox"   checked={ selectedRows.length === payments.length && payments.length > 0  } onChange={selectAll}/>
          </th>
         <th>Name</th>
          <th>Customer ID</th>
         <th>BL</th>
         <th>Transaction</th>
          <th>Amount (€)</th>
         <th>Date</th>
        <th>Status</th>
       </tr>
    </thead>

       <tbody>
            {payments.length > 0 ? ( payments.map((row) => (
           <tr key={row.id}>
              <td className="checkbox-col">
                    <input type="checkbox" checked={selectedRows.includes(row.id)}  onChange={() => toggleCheckbox(row.id)} />
            </td>
            <td>{row.name}</td>
            <td>{row.customer_id}</td>
            <td>{row.bl}</td>
           <td>{row.transaction_number}</td>
          <td>€{row.amount}</td>
         <td>{row.date}</td>
          <td>
          <span className={`status-badge ${getStatusClass(row.status)}`}>     {row.status}
          </span>
           </td>
                  </tr>
              ))
            ) : (
              <tr>
         <td colSpan="8" className="empty-message-caissier">
         No payments found
          </td>
        </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default cassier;
