"use client"
import React from 'react';
import useAuth from '@/hooks/useAuth';
import withAuth from '@/lib/withAuth';
import { useEffect, useState } from 'react'
import NavigationBar from '@/components/NavigationBar'
import LoadingQuotes from '@/components/LoadingQuotes';


import ProjectForm from '@/components/client-sites/ProjectForm';

const Home: React.FC = () => {
    const { user, loading, logout } = useAuth();
    console.log('User:', user);

    if (loading) <LoadingQuotes mode={"light"} />

    return (
        <main className="flex flex-col items-center justify-between min-h-screen p-8 overflow-y-auto">
            {user && !user.isAdmin ? (
                <div className="">
                    <h1 className="text-xl font-bold">You do not have permission to view this page.</h1>
                    <button onClick={logout} className="px-4 py-2 mt-8 text-white bg-red-500 rounded">Log Out</button>
                </div>
            ) : (

                <div className="">
                    <h1 className="text-xl font-bold">Create a New Project</h1>
                    <ProjectForm />
                </div>
            )}
        </main>
    );
}

export default withAuth(Home);
