// import { useState, useEffect } from "react";
// import axios from "axios";
// import { LogOut, Heart, MapPin, Palette, Dog } from "lucide-react";

// interface Pet {
//   id: number;
//   name: string;
//   pet_type: string;
//   breed: string;
//   color: string;
//   location: string;
//   status: string;
//   image?: string;
// }

// function MainPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     petType: "",
//     breed: "",
//     color: "",
//     location: "",
//     status: "Lost",
//     image: null as File | null,
//   });

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [pets, setPets] = useState<Pet[]>([]);
//   const [loadingPets, setLoadingPets] = useState(false);

//   // Fetch pets when component mounts
//   useEffect(() => {
//     fetchPets();
//   }, []);

//   const fetchPets = async () => {
//     try {
//       setLoadingPets(true);
//       const response = await axios.get("http://127.0.0.1:8000/api/pets/");
//       setPets(response.data);
//     } catch (error) {
//       console.error("Error fetching pets:", error);
//     } finally {
//       setLoadingPets(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("user_id");
//     localStorage.removeItem("username");
//     localStorage.removeItem("email");
//     localStorage.removeItem("role");
//     window.location.href = "/login";
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     if (e.target instanceof HTMLInputElement && e.target.type === "file") {
//       const file = e.target.files?.[0] || null;
//       setFormData(prev => ({ ...prev, [e.target.name]: file }));
//     } else {
//       setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoading(true);
//   setMessage("");

//   try {
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("pet_type", formData.petType);
//     data.append("breed", formData.breed);
//     data.append("color", formData.color);
//     data.append("location", formData.location);
//     data.append("status", formData.status);
//     if (formData.image) data.append("image", formData.image);

//     // ✅ Get JWT token from localStorage
//     const token = localStorage.getItem("access_token");

//     const response = await axios.post(
//       "http://127.0.0.1:8000/api/pets/",
//       data,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: token ? `Bearer ${token}` : "", // Include token
//         },
//       }
//     );
    
//     setMessage("Pet uploaded successfully!");
//     console.log(response.data);

//     // Refresh the pets list
//     await fetchPets();

//     // Reset form
//     setFormData({
//       name: "",
//       petType: "",
//       breed: "",
//       color: "",
//       location: "",
//       status: "Lost",
//       image: null,
//     });
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       setMessage(error.response?.data?.message || "Something went wrong!");
//     } else if (error instanceof Error) {
//       setMessage(error.message);
//     } else {
//       setMessage("Something went wrong!");
//     }
//     console.error(error);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <Heart className="w-8 h-8 text-indigo-600 mr-3" />
//               <h1 className="text-2xl font-bold text-gray-900">Pet Rescue Pro</h1>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Upload Form */}
//           <div className="bg-white shadow-xl rounded-2xl p-8">
//             <div className="text-center mb-8">
//               <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
//                 <Dog className="w-8 h-8 text-indigo-600" />
//               </div>
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Pet</h2>
//               <p className="text-gray-600">Help a pet find their way home</p>
//             </div>

//             {message && (
//               <div
//                 className={`mb-6 p-4 rounded-lg text-center font-medium ${
//                   message.includes("successfully")
//                     ? "bg-green-50 text-green-600 border border-green-200"
//                     : "bg-red-50 text-red-600 border border-red-200"
//                 }`}
//               >
//                 {message}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Enter pet name"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type *</label>
//                 <input
//                   type="text"
//                   name="petType"
//                   placeholder="e.g., Dog, Cat, Bird"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                   value={formData.petType}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
//                   <input
//                     type="text"
//                     name="breed"
//                     placeholder="Enter breed"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                     value={formData.breed}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
//                   <input
//                     type="text"
//                     name="color"
//                     placeholder="Enter color"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                     value={formData.color}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//                 <input
//                   type="text"
//                   name="location"
//                   placeholder="Where was the pet last seen?"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                   value={formData.location}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                 >
//                   <option value="Lost">Lost</option>
//                   <option value="Found">Found</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Pet Photo</label>
//                 <input
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   onChange={handleChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
//               >
//                 {loading ? "Uploading..." : "Upload Pet"}
//               </button>
//             </form>
//           </div>

//           {/* Pets List */}
//           <div className="bg-white shadow-xl rounded-2xl p-8">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Pets</h3>

//             {loadingPets ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                 <p className="mt-4 text-gray-600">Loading pets...</p>
//               </div>
//             ) : pets.length === 0 ? (
//               <div className="text-center py-8">
//                 <Dog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No pets uploaded yet</p>
//                 <p className="text-sm text-gray-400 mt-2">Upload your first pet to get started!</p>
//               </div>
//             ) : (
//               <div className="space-y-4 max-h-96 overflow-y-auto">
//                 {pets.map((pet) => (
//                   <div key={pet.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-lg text-gray-900">{pet.name}</h4>
//                         <div className="mt-2 space-y-1">
//                           <p className="text-sm text-gray-600 flex items-center">
//                             <Dog className="w-4 h-4 mr-2" />
//                             {pet.pet_type} {pet.breed && `• ${pet.breed}`}
//                           </p>
//                           {pet.color && (
//                             <p className="text-sm text-gray-600 flex items-center">
//                               <Palette className="w-4 h-4 mr-2" />
//                               {pet.color}
//                             </p>
//                           )}
//                           {pet.location && (
//                             <p className="text-sm text-gray-600 flex items-center">
//                               <MapPin className="w-4 h-4 mr-2" />
//                               {pet.location}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           pet.status === "Lost"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {pet.status}
//                       </span>
//                     </div>
//                     {pet.image && (
//   <div className="mt-3">
//     <img
//       src={pet.image}
//       alt={pet.name}
//       className="w-full h-32 object-cover rounded-lg"
//     />
//   </div>
// )}


//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MainPage;


import { useState, useEffect } from "react";
import axios from "axios";
import { LogOut, Heart, MapPin, Palette, Dog } from "lucide-react";

interface Pet {
  id: number;
  name: string;
  pet_type: string;
  breed: string;
  color: string;
  location: string;
  status: string;
  image?: string | null;
}

function MainPage() {
  const [formData, setFormData] = useState({
    name: "",
    petType: "",
    breed: "",
    color: "",
    location: "",
    status: "Lost",
    image: null as File | null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);

  // Fetch pets on mount
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
  try {
    setLoadingPets(true);
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get("http://127.0.0.1:8000/api/pets/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPets(response.data);
  } catch (error) {
    console.error("Error fetching pets:", error);
  } finally {
    setLoadingPets(false);
  }
};


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0] || null;
      setFormData(prev => ({ ...prev, [e.target.name]: file }));
    } else {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("pet_type", formData.petType);
      data.append("breed", formData.breed);
      data.append("color", formData.color);
      data.append("location", formData.location);
      data.append("status", formData.status);
      if (formData.image) data.append("image", formData.image);

      const token = localStorage.getItem("access_token");
      console.log(token);
      if (!token) throw new Error("User not authenticated");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/pets/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Pet uploaded successfully!");
      console.log(response.data);

      // Refresh pet list
      await fetchPets();

      // Reset form
      setFormData({
        name: "",
        petType: "",
        breed: "",
        color: "",
        location: "",
        status: "Lost",
        image: null,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.detail || "Something went wrong!");
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong!");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Pet Rescue Pro</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Dog className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Pet</h2>
            <p className="text-gray-600">Help a pet find their way home</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
              message.includes("successfully")
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text" name="name" placeholder="Pet Name" value={formData.name} onChange={handleChange}
              className="w-full p-3 border rounded-lg" required
            />
            <input
              type="text" name="petType" placeholder="Pet Type" value={formData.petType} onChange={handleChange}
              className="w-full p-3 border rounded-lg" required
            />
            <input type="text" name="breed" placeholder="Breed" value={formData.breed} onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full p-3 border rounded-lg" />

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg">
              {loading ? "Uploading..." : "Upload Pet"}
            </button>
          </form>
        </div>
        {/* Pets List */}
      {/* Pets List */}
<div className="bg-white shadow-xl rounded-2xl p-8">
  <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Pets</h3>

  {loadingPets ? (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading pets...</p>
    </div>
  ) : pets.length === 0 ? (
    <div className="text-center py-8">
      <Dog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">No pets uploaded yet</p>
      <p className="text-sm text-gray-400 mt-2">
        Upload your first pet to get started!
      </p>
    </div>
  ) : (
    <div className="grid sm:grid-cols-2 gap-6 max-h-[32rem] overflow-y-auto pr-2">
      {pets.map((pet) => (
        <div
          key={pet.id}
          className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all bg-gray-50"
        >
          {pet.image && (
            <div className="relative">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                  pet.status === "Lost"
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {pet.status}
              </span>
            </div>
          )}
          <div className="p-4">
            <h4 className="font-bold text-lg text-gray-900 mb-1">
              {pet.name}
            </h4>
            <p className="text-sm text-gray-600 flex items-center mb-1">
              <Dog className="w-4 h-4 mr-2 text-indigo-500" />
              {pet.pet_type} {pet.breed && `• ${pet.breed}`}
            </p>
            {pet.color && (
              <p className="text-sm text-gray-600 flex items-center mb-1">
                <Palette className="w-4 h-4 mr-2 text-pink-500" />
                {pet.color}
              </p>
            )}
            {pet.location && (
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-green-500" />
                {pet.location}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        </div>
      </div>
  );
}

export default MainPage;

        {/* Pets List
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Pets</h3>
          {loadingPets ? <p>Loading...</p> : pets.length === 0 ? <p>No pets uploaded yet</p> :
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pets.map(pet => (
                <div key={pet.id} className="border p-4 rounded-lg">
                  <h4 className="font-semibold">{pet.name}</h4>
                  <p>{pet.pet_type} {pet.breed && `• ${pet.breed}`}</p>
                  {pet.color && <p>Color: {pet.color}</p>}
                  {pet.location && <p>Location: {pet.location}</p>}
                  <span className={`px-2 py-1 rounded-full text-xs ${pet.status === "Lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                    {pet.status}
                  </span>
                  {pet.image && <img src={pet.image} alt={pet.name} className="w-full h-32 object-cover mt-2 rounded-lg" />}
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default MainPage; */}
