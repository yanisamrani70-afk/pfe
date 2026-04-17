/*      IMPORTANT!!! : 
  9bal ma tdir run l folder ta3 nodejs l1awal mara lazem tdir f terminal : 
   
  npm install xlsx

   source ta3 code original : https://www.geeksforgeeks.org/node-js/how-to-read-and-write-excel-file-in-node-js/
    
   
*/



const cron = require("node-cron");
const { Pool } = require("pg"); 


// Requiring module
const reader = require('xlsx')



/* Database Connection */

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "refund_db",
  password: "imadorb",
  port: 5432,
});

const exportExcel = async () => {
     console.log("exporting now at :", new Date());
   try{
   

    const result = await pool.query("SELECT * FROM caissier_table"); 
// case 1 : no rows from the caissier_table database 
   if(result.rows.length === 0){
    console.log("empty result");
    return;  
   }
   //creation of a new file every time the exportExcel runs 
    const file = reader.utils.book_new();

  // comvert the data to excel sheet (header included aswell)
  const ws = reader.utils.json_to_sheet(result.rows)

   // add the data to the file 
   reader.utils.book_append_sheet(file,ws,"Caissier")

  // Writing to the file
reader.writeFile(file,'./test.xlsx')



   }catch(err){
    console.log("error :", err.message); 
   }


};
//hada kima time, f had test rah koul 1 minute ymshi exportcsv
cron.schedule("* * * * *", exportExcel);



