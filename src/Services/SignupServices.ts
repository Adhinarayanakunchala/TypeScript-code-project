import ApiService from "Services/config";

export const LoginService = (email: string, password: string) => {
    return ApiService.post("/pos/login", { email, password });
};

export const changePassword = (oldPassword: string, newPassword: string) => {
    return ApiService.patch("/pos/change-password", { oldPassword, newPassword });
};

// Requests
export const RequestService = (pageCount:any,PageSize:any) => {
    return ApiService.get(`/pos/requests?page=${pageCount}&size=${PageSize}`);
};

export const AddrequestService = (body:any) => {
    return ApiService.post(`/pos/requests/add`, body);
}

export const GetRequestByIDService = (id:any) => {
    return ApiService.get(`/pos/requests/details/${id}`);
}
export const RequestInventory = (pageCount:any,PageSize:any)=>{
    return ApiService.get(`/pos/inventory?page=${pageCount}&size=${PageSize}`);
}

export const AddItemsInventory = (body:any)=>{
    return ApiService.post("/pos/add-to-request", body);
}

export const ReadyToUseService = (id:any) => {
    return ApiService.patch(`/pos/ready-to-issue/${id}`);
}

export const CrossMatchService = (body:any) => {
    return ApiService.post(`/pos/cross-match`, body);
}
// Inventory
export const inventoryService = (pageCount:any,PageSize:any,status:number)=>{
    return ApiService.get(`/pos/inventory?page=${pageCount}&size=${PageSize}&status=${status}`);
}

export const AddInventorys = (body:any)=>{
    return ApiService.post("/pos/inventory/add", body);
}


export const BloodGroups = ()=>{
    return ApiService.get("/pos/blood-groups/all");
}

export const BloodgroupComponent = ()=>{
    return ApiService.get("/pos/blood-components/all");
}


// Profile
export const ProfileService = ()=>{
    return ApiService.get(`/pos/user-details`);
}

export const ProfileUpdate = (body:any) => {
    return ApiService.patch("/pos/user-details/update",body);
};

// blodbank types

export const BloodBankTypes = () => {
    return ApiService.get("/pos/blood-bank-types/all");
};

// Dashbord

// export const DashbordService = (pageCount:any,PageSize:any) => {
//     return ApiService.get(`/pos/dashboard-requests?page=${pageCount}&size=${PageSize}`);
// };

export const DashbordService = (bloodGroupId:number,bloodComponentId:number,pageCount:any,PageSize:any) => {
    return ApiService.get(`/pos/inventory?bloodGroupId=${bloodGroupId}&bloodComponentId=${bloodComponentId}&page=${pageCount}&size=${PageSize}`);
};

export const Dashbord = (pageCount:any,PageSize:any) => {
    return ApiService.get(`/pos/inventory?page=${pageCount}&size=${PageSize}`);
};




// Orders
export const OrderService = (pageCount:any,PageSize:any) => {
    return ApiService.get(`/pos/orders?page=${pageCount}&size=${PageSize}`);
};

export const OrderByIDService = (id:any) => {
    return ApiService.get(`/pos/orders/details/${id}`);
};

export const PlaceOrderService = (body:any) => {
    return ApiService.post(`/pos/place-order`, body);
};

export const ChangeOrderService = (id:any,status:number) => {
    return ApiService.patch(`/pos/orders/${id}/status/${status}`);
};

// search filter

export const SearchFilterService = (name:string) => {
    return ApiService.get(`/pos/dashboard-requests?search=${name}`);
};

// Cart
export const CartService = () => {
    return ApiService.get(`/pos/cart`);
};

export const AddCart = (body:any) => {
    return ApiService.post(`/pos/modify-cart`, body);
};

export const PlaceOrder = (body:any) =>{
    return  ApiService.post(`pos/create-order`, body);
}

// Image  Uploder


export const DocumentUploader = (image:string) =>{
    return  ApiService.get(`pos/get-upload-url?filename=${image}`);
}

export const DocumentView  = (Id:string)=>{
    return ApiService.get(`pos/documents?key=${Id}`);
}