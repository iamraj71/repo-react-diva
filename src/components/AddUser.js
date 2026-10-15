import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '',password:'' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{6,15}$/;
    const mobileRegex = /^[6-9][0-9]{9}$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must be 6 to 15 digits';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Mobile Address is required';
    }

    if (image && !image.type.startswith('image/')) {
      newErrors.image = 'Only image files are allowed';
    } else if (image && image.size > 2 * 1024 * 1024) {
      newErrors.image = 'Image must be less than 2MB';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    // console.log('Add User Data:', formData);
    // navigate('/dashboard');
    const data= new FormData()

    data.append('name',formData.name)
    data.append('email',formData.email)
    data.append('phone',formData.phone)
    data.append('address',formData.address)
    data.append('password',formData.password)
    if(image) {
      data.append('image',image)
    }

    try{
      const response = await axios.post("http://localhost:5000/api/add-user",formData)
      if(response.data.data){
        navigate('/Dashboard');
      }else{
        alert(response.data.message)
      }
    }catch(error){
      console.log(error.message)
    }
  };
  const handleImageChange = (e) => {
      const file = e.target.files[0];
  setImage(file || null);
  setPreview(file ? URL.createObjectURL(file) : '');
  }

  const handleCancel = () => navigate('/dashboard');

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add User</h2>
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; Back to list
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="add-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass('name')}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="add-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              id="add-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass('email')}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="add-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              id="add-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass('phone')}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass('password')}
              placeholder="Enter Password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div> */}

          {/* <div className="mb-6">
            <label htmlFor="add-mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              id="add-mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={inputClass('mobile')}
              placeholder="Enter 10 digit mobile number"
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div> */}
          <div className="mb-6">
            <label btmlfor="add-image" className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input 
              type="file"
              id="add-image"
              name="Image"
              accept='image/*'
              className={inputClass('image')}
              onChange={handleImageChange}
              />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              {preview && (
                <img src={preview} alt="preview" className="mt-3 h-24 w-24 object-cover raounded-md border" />
              )}
              
          </div>
          <div className="mb-4">
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
              address
            </label>
            <input
              type="text"
              id="add-name"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={inputClass('address')}
              placeholder="address"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
