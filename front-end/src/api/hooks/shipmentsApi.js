import api from "./axios";

/**
 * Shipments API (custom actions)
 */
export const ShipmentsApi = {
  /** Transfer shipment between branches */
  transfer: async (data) => {
    // data = { shipment_id, to_branch_id, status_id, note }
    const res = await api.post("/shipments/transfer", data);
    return res.data?.data ?? res.data;
  },
};
