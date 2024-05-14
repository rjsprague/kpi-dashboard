"use client"

import React, { useState } from 'react';
import axios from 'axios';

interface FormData {
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessEmail: string;
    businessWebsite: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    gtmId: string;
    sendToEmails: string;
    twilioToPhoneNumbers: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+\d{11}$/;

const ProjectForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        businessName: '',
        businessAddress: '',
        businessPhone: '',
        businessEmail: '',
        businessWebsite: '',
        logoUrl: '',
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
        gtmId: '',
        sendToEmails: '',
        twilioToPhoneNumbers: '',
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateAndFormatEmails = (emailString: string) => {
        const emails = emailString.split(',').map(email => email.trim());
        return emails.every(email => emailRegex.test(email));
    };

    const validateAndFormatPhones = (phoneString: string) => {
        const phones = phoneString.split(',').map(phone => phone.trim());
        return phones.every(phone => phoneRegex.test(phone));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.businessName || !formData.businessEmail) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!validateAndFormatEmails(formData.sendToEmails)) {
            alert("One or more email addresses are invalid.");
            return;
        }

        if (!validateAndFormatPhones(formData.twilioToPhoneNumbers)) {
            alert("One or more phone numbers are invalid. Ensure they match the +12223334444 format.");
            return;
        }

        console.log("Form data is valid. Submitting form...", formData);
        // Here you would typically send the formData to your backend via an API
        await axios.post('/api-routes/setup-project', { formData },
            {
                headers: {
                    'Content-Type': 'application/json',
                }

            }).then(response => {
                if (response.status === 200) {
                    alert("Form submitted successfully!");
                } else {
                    alert("There was an error submitting the form. Please try again later.");
                }
            }).catch(error => {
                console.error("Error submitting form:", error);
                alert("There was an error submitting the form. Please try again later. \n Error: " + error.message || "Unknown error.");
            });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-2 border border-gray-300 rounded-lg shadow-lg">
            <div>
                <label htmlFor="businessName" className="block text-sm font-medium">Business Name *</label>
                <input type="text" name="businessName" id="businessName" required
                    value={formData.businessName} onChange={handleInputChange}
                    className="block w-full px-1 mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div>

            <div>
                <label htmlFor="businessAddress" className="block text-sm font-medium">Business Address *</label>
                <input type="text" name="businessAddress" id="businessAddress" required
                    value={formData.businessAddress} onChange={handleInputChange}
                    className="block w-full px-1 mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />

            </div>

            <div>
                <label htmlFor="businessPhone" className="block text-sm font-medium">Business Phone *</label>
                <input type="tel" name="businessPhone" id="businessPhone" required pattern="\d{10}"
                    title="Phone number must be in the format: +12345678901"
                    value={formData.businessPhone} onChange={handleInputChange}
                    className="block w-full px-1 mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />

            </div>

            <div>
                <label htmlFor="businessEmail" className="block text-sm font-medium">Business Email *</label>
                <input type="email" name="businessEmail" id="businessEmail" required
                    value={formData.businessEmail} onChange={handleInputChange}
                    className="block w-full px-1 mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />

            </div>

            <div>
                <label htmlFor="businessWebsite" className="block text-sm font-medium">Business Website</label>
                <input type="url" name="businessWebsite" id="businessWebsite"
                    value={formData.businessWebsite} onChange={handleInputChange}
                    className="block w-full px-1 mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />

            </div>

            <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium">Business Logo URL</label>
                <input type="url" name="logoUrl" id="logoUrl"
                    value={formData.logoUrl} onChange={handleInputChange}
                    className="block w-full px-1 mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />

            </div>

            <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium">Primary Color</label>
                <input type="color" name="primaryColor" id="primaryColor"
                    value={formData.primaryColor} onChange={handleInputChange}
                    className="w-12 h-12 border-none cursor-pointer" />
            </div>

            <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium">Secondary Color</label>
                <input type="color" name="secondaryColor" id="secondaryColor"
                    value={formData.secondaryColor} onChange={handleInputChange}
                    className="w-12 h-12 border-none cursor-pointer" />
            </div>

            <div>
                <label htmlFor="gtmId" className="block text-sm font-medium">Google Tag Manager ID</label>
                <input type="text" name="gtmId" id="gtmId"
                    value={formData.gtmId} onChange={handleInputChange}
                    className="block w-full px-1 mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />

            </div>

            <div>
                <label htmlFor="sendToEmails" className="block text-sm font-medium">Send To Emails (comma-separated)</label>
                <input type="text" name="sendToEmails" id="sendToEmails"
                    value={formData.sendToEmails} onChange={handleInputChange}
                    className="block w-full px-1 mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />

            </div>

            <div>
                <label htmlFor="twilioToPhoneNumbers" className="block text-sm font-medium">Twilio To Phone Numbers (comma-separated)</label>
                <input type="text" name="twilioToPhoneNumbers" id="twilioToPhoneNumbers" required pattern="\+\d{11}"
                    value={formData.twilioToPhoneNumbers} onChange={handleInputChange}
                    className="block w-full px-1 mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />

            </div>

            <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Submit
            </button>
        </form>
    );
};

export default ProjectForm;
