'use server';

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export async function createProduct(formData: any) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/product/api/create`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
}