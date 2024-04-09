"use client";

import withAuth from '@/lib/withAuth';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Accordion from '@/components/Accordion';
import LoadingQuotes from '@/components/LoadingQuotes';

function SupportPage() {
    const { user, loading } = useAuth();

    // Ensure user object is available before rendering the page content
    if (loading) {
        return <LoadingQuotes />;
    }

    return (
        <main className="flex flex-col items-center h-screen p-2 overflow-y-auto">
            <h1 className="mb-4 text-3xl font-bold text-center">
                Welcome to REI Automated's Support Page
            </h1>
            <p className="mb-4 text-center">
                We're here to help you with any questions or issues you may have. Please feel free to reach out to us at any time.
            </p>
            <h3 className="mb-4 text-2xl font-bold text-center">
                Yellow Light Support Structure
            </h3>

            <div className="flex flex-col w-full p-4 overflow-y-auto bg-gray-100 rounded-lg shadow-inner lg:w-11/12 xl:w-3/4">

                <Accordion title={"Training and Tutorials Library"} className="mb-2">
                    <p>Access our extensive library of training materials and tutorials to enhance your skills.</p>
                    <Link href="https://knowledge.reiautomated.io/enrollments" className="italic underline text-gray-50 hover:text-blue-50" target="_blank" rel="noopener noreferrer">
                        REI Automated Training and Tutorials
                    </Link>
                </Accordion>

                <Accordion title={"Office Hours"}>
                    <div className="flex flex-col gap-2">
                        <p>
                            Join us live daily at 1:00 PM ET for 1 hour support calls.<br />
                            Get your questions answered.<br />
                            Educate. Support. Encourage.
                        </p>
                        <Link href="https://zoom.us/j/9479993954" className="italic underline text-gray-50 hover:text-blue-50" target="_blank" rel="noopener noreferrer">
                            Monday, Wednesday, Friday Zoom Link
                        </Link>
                        <Link href="https://zoom.us/j/8082010528" className="italic underline text-gray-50 hover:text-blue-50" target="_blank" rel="noopener noreferrer">
                            Tuesday, Thursday Zoom Link
                        </Link>
                    </div>
                </Accordion>

                <Accordion title={"REI Automated Private Facebook Group"}>
                    <p>
                        Share your KPIs. Share your wins.<br />
                        Ask for help. Give help. Build the community. <br />
                        Sometimes there are opportunities to collaborate with other members, buy and sell deals, and more.
                    </p>
                    <Link href="https://www.facebook.com/groups/reiautomated" className="italic underline text-gray-50 hover:text-blue-50" target="_blank" rel="noopener noreferrer">
                        REI Automated Private Facebook Group
                    </Link>
                </Accordion>

                <Accordion title={"Support Tickets"}>
                    <p>
                        When you need some technical support, you can email us at <Link href="mailto:support@reiautomated.io" className="italic underline text-gray-50 hover:text-blue-50">support@reiautomated.io</Link>.
                    </p>
                    <p>
                        You can also submit a ticket using the support widget at the bottom right of your screen in the app.
                    </p>
                    <p>
                        Or you can submit a ticket at our Service Desk. <br />
                        Please be sure to include your name, email, and a detailed description of the issue you are experiencing. <br />
                        Screenshots or a video are always helpful.
                    </p>
                    <Link href="https://reiautomated.atlassian.net/servicedesk/customer/portal/3" className="italic underline text-gray-50 hover:text-blue-50" target="_blank" rel="noopener noreferrer">
                        REI Automated Service Desk
                    </Link>
                </Accordion>

            </div>
        </main>
    );
}

export default withAuth(SupportPage);
