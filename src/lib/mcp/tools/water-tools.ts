import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { MCPTool, WaterEntry } from "@/lib/types";
import { startOfWeek } from "date-fns";

export const waterTrackingTools: MCPTool[] = [
  {
    name: "get_water_tracking",
    description: "Get all water tracking entries for a user",
    parameters: {
      type: "object",
      properties: {
        userId: { type: "string" },
        limit: { type: "number", default: 10 },
      },
      required: ["userId"],
    },
    function: async (params: { userId: string; limit?: number }) => {
      return await getWaterTracking(params);
    },
  },

  {
    name: "add_water_entry",
    description: "Add a new water tracking entry",
    parameters: {
      type: "object",
      properties: {
        userId: { type: "string" },
        amount: { type: "number" },
        notes: { type: "string" },
      },
      required: ["userId", "amount"],
    },
    function: async (params: {
      userId: string;
      amount: number;
      notes?: string;
    }) => {
      try {
        const waterRef = collection(db, "waterEntries");
        const newEntry = {
          userId: params.userId,
          amount: params.amount,
          timestamp: new Date(),
          notes: params.notes || "",
        };

        const docRef = await addDoc(waterRef, newEntry);

        return {
          success: true,
          data: { id: docRef.id, ...newEntry },
          message: `Added ${params.amount}ml water entry`,
        };
      } catch (error) {
        return {
          success: false,
          error: "Failed to add water entry",
          details: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  },
];

export async function getWaterThisWeek({ userId }: { userId: string }) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const q = query(
    collection(db, "water_entries"),
    where("userId", "==", userId),
    where("timestamp", ">=", Timestamp.fromDate(weekStart))
  );
  const snap = await getDocs(q);
  const litres = snap.docs.reduce((sum, d) => sum + d.data().ml, 0) / 1000;
  return { litres: +litres.toFixed(1) };
}

export async function getWaterTracking(params: {
  userId: string;
  limit?: number;
}) {
  try {
    const waterRef = collection(db, "waterEntries");
    const q = query(
      waterRef,
      where("userId", "==", params.userId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const waterEntries: WaterEntry[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      waterEntries.push({
        id: doc.id,
        userId: data.userId,
        amount: data.amount,
        timestamp: data.timestamp.toDate(),
      });
    });

    return {
      success: true,
      data: waterEntries,
      total: waterEntries.length,
      message: `Found ${
        waterEntries.length
      } water tracking entries with total of ${waterEntries.reduce(
        (acc, entry) => acc + entry.amount,
        0
      )}ml and the last entry was ${
        waterEntries[0].amount
      }ml on ${waterEntries[0].timestamp.toLocaleDateString()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch water tracking data",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
