import apiClient from "../../../apiClient";
import roomEndpoints from "../endpoints/roomEndpoints";

// Fetch all rooms
export const getRooms = () => apiClient.get(roomEndpoints.getRooms);

// Fetch a specific room by ID
export const getRoomById = (id) => apiClient.get(roomEndpoints.getRoomById(id));

// Create a new room
export const createRoom = (data) =>
  apiClient.post(roomEndpoints.createRoom, { data });

// Update a room by ID
export const updateRoom = (id, data) =>
  apiClient.put(roomEndpoints.updateRoom(id), data);

// Delete a room by ID
export const deleteRoom = (id) =>
  apiClient.delete(roomEndpoints.deleteRoom(id));

// Fetch rooms by floor ID (if applicable)
export const getRoomsByFloorId = (floorId) =>
  apiClient.get(`${roomEndpoints.getRooms}?floorId=${floorId}`);

// Fetch rooms by user ID (if applicable)
export const getRoomsByUser = (userId) =>
  apiClient.get(`${roomEndpoints.getRooms}?userId=${userId}`);
