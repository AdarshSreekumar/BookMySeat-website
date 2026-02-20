import commomAPI from "./commonAPI"
import serverURL from "./serverURL"

// register
export const registerAPI=async(userDetails)=>{
    return await commomAPI("POST",`${serverURL}/register`,userDetails) 
}

// login
export const loginAPI=async(userDetails)=>{
    return await commomAPI("POST",`${serverURL}/login`,userDetails) 
}
// google login
export const googleloginAPI=async(userDetails)=>{
    return await commomAPI("POST",`${serverURL}/google/sign-in`,userDetails) 
}

// get all events
export const getAllEventsAPI=async()=>{
    return await commomAPI("GET",`${serverURL}/all-events`,{}) 
}

// all event seats
export const getAllEventSeatsAPI=async(eventId)=>{
    return await commomAPI("GET",`${serverURL}/event-seats/${eventId}`,{}) 
}


// fetch seats
export const getAllSeatsAPI=async()=>{
    return await commomAPI("GET",`${serverURL}/get-seats`,{}) 
}

// book seats
export const bookSeatsAPI=async(bookingData,reqHeader)=>{
    return await commomAPI("POST",`${serverURL}/book-seats`,bookingData,reqHeader) 
}

// get all booked seats
export const getUserBookingsAPI=async(reqHeader)=>{
    return await commomAPI("GET",`${serverURL}/user-bookings`,"",reqHeader) 
}

// -------admin-------

// get alluser in admin
export const getAllUserAPI=async(reqHeader)=>{
    return await commomAPI("GET",`${serverURL}/admin/all-users`,"",reqHeader) 
}

// delete user
export const deleteUserAPI=async(id,reqHeader)=>{
return await commomAPI("DELETE",`${serverURL}/admin/delete-user/${id}`,{},reqHeader) 
}

// get allbooking
export const getAllBookingsAPI=async(reqHeader)=>{
return await commomAPI("GET",`${serverURL}/admin/all-bookings`,"",reqHeader) 
}

// delete booking
export const deleteBookingAPI=async(id,reqHeader)=>{
return await commomAPI("DELETE",`${serverURL}/admin/delete-booking/${id}`,{},reqHeader) 
}

// Add an event (Coordinator)
export const addEventAPI = async (reqBody, reqHeader) => {
    // Fixed spelling to commonAPI
    return await commomAPI("POST", `${serverURL}/add-event`, reqBody, reqHeader); 
};

// Get specific coordinator events
export const getCoordinatorEventsAPI = async (reqHeader) => {
    // Ensure this URL matches your router.get('/get-coordinator-events', ...) in backend
    return await commomAPI("GET", `${serverURL}/get-coordinator-events`, "", reqHeader); 
};

// get all events for approval
export const getAllEventsAdminAPI = async (reqHeader) => {
    return await commomAPI("GET", `${serverURL}/all-app-events`, "", reqHeader); 
};

// Approve an event (Admin)
export const approveEventAPI = async (id, reqHeader) => {
    // Changed GET to PUT to match your backend router.put
    // Changed {} to "" for the body since PUT requests usually expect a body or empty string
    return await commomAPI("PUT", `${serverURL}/approve-event/${id}`, {}, reqHeader); 
};

// all approved events see in home
export const getHomeEventsAPI = async () => {
    return await commomAPI("GET", `${serverURL}/home-events`, "", ""); 
};

// get all events seats :id
export const getEventSeatsAPI=async(eventId)=>{
    return await commomAPI("GET",`${serverURL}/get-all-seats/${eventId}`,{}) 
}


// Delete event API
export const deleteEventAPI = async (id, header) => {
    return await commomAPI("DELETE", `${serverURL}/event/remove/${id}`, {}, header);
};

// Payment API
export const processPaymentAPI = async (reqBody, reqHeader) => {
    return await commomAPI("POST", `${serverURL}/payment`, reqBody, reqHeader);
};

// Get all customer bookings for coordinator/admin
export const getAllBookingAPI = async (reqHeader) => {
    return await commomAPI("GET", `${serverURL}/all-bookings`, "", reqHeader);
};