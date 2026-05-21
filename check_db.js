import { db } from "./src/lib/firebase/client.js";
import { collection, getDocs, query, where } from "firebase/firestore";

async function checkProducts() {
  const q = query(collection(db, "products"), where("name", "==", "Cadmom"));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    console.log("ID:", doc.id);
    console.log("Stock:", doc.data().stock);
    console.log("Variants:", JSON.stringify(doc.data().variants, null, 2));
  });
  process.exit(0);
}

checkProducts().catch(console.error);
