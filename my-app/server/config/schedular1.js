/*      IMPORTANT!!! : 
  9bal ma tdir run l folder ta3 nodejs l1awal mara lazem tdir f terminal : 
   npm install node-cron  (hadi ta3 cron job li yt3aewd b schedule)
   npm install csv-writer (creation fichier csv) 
   w f app.js 7at : require("./schedular1");
*/



const cron = require("node-cron");
const { Pool } = require("pg"); 

const createCsvWriter = require('csv-writer').createArrayCsvWriter;


/* Database Connection */

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "refund_db",
  password: "imadorb",
  port: 5432,
});

const exportcsv = async () => {
     console.log("exporting now at :", new Date());
   try{
    const result = await pool.query("SELECT * FROM caissier_table"); 
// case 1 : no rows from the caissier_table database 
   if(result.rows.length === 0){
    console.log("empty result");
    return;  
   }
  
   // headers of csv 
   const headers = Object.keys(result.rows[0]); 
 // csv data 
 const records = result.rows.map(row => Object.values(row));

   const csvWriter = createCsvWriter({
header: headers,
   path: 'test.csv'
   });
  csvWriter.writeRecords(records).then(() => {
    console.log('...done');
    });

   }catch(err){
    console.log("error :", err.message); 
   }


};
//hada kima time, f had test rah koul 1 minute ymshi exportcsv
cron.schedule("* * * * *", exportcsv);

/*
// example koul youm 3la 17:00 kayna run l exportcsv function ta3 creation fichier
cron.schedule("0 17 * * *",exportcsv);   */ 

