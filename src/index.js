import express from "express";
import cors from "cors";
import fs from "fs";
import csv from "csvtojson";
import path, { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.post("/", async (req, res) => {
  try {
    const csvPath = path.join(__dirname, "merged_data.csv");
  
    const { text } = req.body;

    const csvData = await csv().fromFile(csvPath);

   
    const inputWords = text.split(/\s+/);
   const extractedWords=[]
    
    csvData.map((items,id)=>{
    //   console.log(items.extracted_x)
       inputWords.forEach((word)=>{
        
        if(items.extracted_x.includes(word)){
            extractedWords.push({
                extracted_x:items.extracted_x,
                prerequisitetaxonomy:items.prerequisitetaxonomy,
               
            })
        }
       })
    })


    const removeDuplicates = (arr, key) => {
        const seen = new Set();
        return arr.filter((obj) => {
          const value = obj[key];
          if (!seen.has(value)) {
            seen.add(value);
            return true;
          }
          return false;
        });
      };

      const resultArray = removeDuplicates(extractedWords, "extracted_x");
      


    res.json({ result: resultArray.slice(0,2)});
  } catch (error) {
    console.log("ERRR in handling files", error);
  }
});

app.listen(process.env.PORT || 8000, (req, res) => {
  console.log("server is listinig at :8000");
});
