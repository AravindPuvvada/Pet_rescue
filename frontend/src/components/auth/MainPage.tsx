import { useState, useEffect } from "react";
import axios from "axios";
import { LogOut, Heart, MapPin, Palette, Dog } from "lucide-react";

interface PetType {
  id: number;
  type: string;
}

interface LocationType {
  id: number;
  type: string;
}

interface Pet {
  id: number;
  name: string;
  pet_type: PetType | string;
  breed: string;
  color: string;
  location: LocationType | string;  // 👈 allow both
  status: string;
  image?: string | null;
}


interface FormDataType {
  name: string;
  petType: PetType | string;
  gender: "Male" | "Female" | "";
  breed: string;
  color: string;
  age: number | "";
  weight: number | "";
  description: string;
  address: string;
  state: string;
  city: string;
  pincode: number | "";
  is_diseased: boolean;
  is_vaccinated: boolean;
  status: "Lost" | "Found";
  image: File | null;
}

function MainPage() {
  const [formData, setFormData] = useState<FormDataType>({
  name: "",
  petType: "",
  gender: "",
  breed: "",
  color: "",
  age: "",
  weight: "",
  description: "",
  address: "",
  state: "",
  city: "",
  pincode: "",
  is_diseased: false,
  is_vaccinated: false,
  status: "Lost",
  image: null,
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

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, type, value, checked, files } = e.target as HTMLInputElement;

  if (type === "file") {
    setFormData((prev: FormDataType) => ({
      ...prev,
      [name]: files?.[0] || null,
    }));
  } else if (type === "checkbox") {
    setFormData((prev: FormDataType) => ({
      ...prev,
      [name]: checked,
    }));
  } else if (type === "number") {
    setFormData((prev: FormDataType) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  } else {
    setFormData((prev: FormDataType) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const data = new FormData();
    data.append("name", formData.name);

    // ✅ handle object vs string for pet_type
    if (typeof formData.petType === "object") {
  data.append("pet_type_id", formData.petType.id.toString());
} else {
  data.append("pet_type_id", formData.petType);
}

    data.append("breed", formData.breed);
    data.append("color", formData.color);
    data.append("age", formData.age.toString());
    data.append("weight", formData.weight.toString());
    data.append("description", formData.description);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("pincode", formData.pincode.toString());
    data.append("is_diseased", formData.is_diseased ? "true" : "false");
    data.append("is_vaccinated", formData.is_vaccinated ? "true" : "false");
    data.append("status", formData.status);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("User not authenticated");

    const res = await axios.post(
      "http://127.0.0.1:8000/api/pets/",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res.data);

    setMessage("Pet uploaded successfully!");
    await fetchPets();

    // reset form
    setFormData({
      name: "",
      petType: "",
      gender: "",
      breed: "",
      color: "",
      age: "",
      weight: "",
      description: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      is_diseased: false,
      is_vaccinated: false,
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
    type="text"
    name="name"
    placeholder="Pet Name"
    value={formData.name}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
    required
  />
<input
  type="text"
  name="petType"
  placeholder="Pet Type"
  value={formData.petType?.toString() ?? ""}
  onChange={handleChange}
  className="w-full p-3 border rounded-lg"
  required
/>
  <select
    name="gender"
    value={formData.gender || ""}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>

  <input
    type="text"
    name="breed"
    placeholder="Breed"
    value={formData.breed}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  />

  <input
    type="text"
    name="color"
    placeholder="Color"
    value={formData.color}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  />

  <input
    type="number"
    name="age"
    placeholder="Age (in years)"
    value={formData.age || ""}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  />

  <input
    type="number"
    name="weight"
    placeholder="Weight (kg)"
    value={formData.weight || ""}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  />

  <textarea
    name="description"
    placeholder="Description"
    value={formData.description || ""}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
    rows={3}
  />

  <textarea
    name="address"
    placeholder="Address"
    value={formData.address || ""}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
    rows={2}
  />

  <input
    type="text"
    name="state"
    placeholder="State"
    value={formData.state || ""}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  />

  <input
    type="text"
    name="city"
    placeholder="City"
    value={formData.city || ""}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  />

  <input
    type="number"
    name="pincode"
    placeholder="Pincode"
    value={formData.pincode || ""}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  />

  <div className="flex items-center space-x-4">
    <label className="flex items-center space-x-2">
      <input
  type="checkbox"
  name="is_diseased"
  checked={formData.is_diseased}
  onChange={handleChange}
/>
      <span>Diseased</span>
    </label>

    <label className="flex items-center space-x-2">
      <input
  type="checkbox"
  name="is_vaccinated"
  checked={formData.is_vaccinated}
  onChange={handleChange}
/>
      <span>Vaccinated</span>
    </label>
  </div>

 <textarea
  name="address"
  placeholder="Address"
  value={formData.address}
  onChange={handleChange}
  className="w-full p-3 border rounded-lg"
  rows={2}
/>


  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  >
    <option value="Lost">Lost</option>
    <option value="Found">Found</option>
  </select>

  <input
    type="file"
    name="image"
    accept="image/*"
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
  />

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-indigo-600 text-white py-3 rounded-lg"
  >
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
  {typeof pet.pet_type === "object" ? pet.pet_type.type : pet.pet_type}
  {pet.breed && ` • ${pet.breed}`}
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
    {typeof pet.location === "object" ? pet.location.type : pet.location}
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

  