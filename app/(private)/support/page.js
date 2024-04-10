"use client";

import withAuth from '@/lib/withAuth';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Accordion from '@/components/MyAccordion';
import LoadingQuotes from '@/components/LoadingQuotes';

function SupportPage() {
    const [height, setHeight] = useState('auto');
    const { user, loading } = useAuth();

    // Ensure user object is available before rendering the page content
    if (loading) {
        return <LoadingQuotes />;
    }

    return (
        <main className="flex flex-col items-center h-full p-2 overflow-y-auto">
            <h1 className="mb-4 text-3xl font-bold text-center">
                Welcome to REI Automated's Support Page
            </h1>
            <p className="mb-4 text-center">
                We're here to help you with any questions or issues you may have. Please feel free to reach out to us at any time.
            </p>
            <h3 className="mb-4 text-2xl font-bold text-center">
                Yellow Light Support Structure
            </h3>

            <div className="flex flex-col w-full h-[70%] p-4 overflow-y-auto bg-gray-100 rounded-lg lg:w-11/12 xl:w-3/4">

                <Accordion title={"Training and Tutorials Library"} height={height} setHeight={setHeight}>
                    <div className="flex flex-col pb-4">
                        <ul className="pl-5 space-y-2 list-disc">
                            <li>
                                The REI Automated Training and Tutorials Library contains all of our training on how to run a real estate investing business using REI Automated's tools and resources.
                            </li>
                            <li>
                                Please go here FIRST to look for answers before you ask a question during office hours, in the Facebook group, or submit a support ticket.
                            </li>
                            <li>
                                <Link href="https://knowledge.reiautomated.io/enrollments" className="italic underline text-gray-50 hover:text-blue-50" target="_blank" rel="noopener noreferrer">
                                    REI Automated Training and Tutorials
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Accordion>

                <Accordion title={"Office Hours"} height={height} setHeight={setHeight}>
                    <div className="flex flex-col pb-4">
                        <p>
                            Join us live daily at <strong>1:00 PM ET</strong> for 1 hour support calls.<br />
                            Get your questions answered.<br />
                            Educate. Support. Encourage.
                        </p>
                        <Link href="https://knowledge.reiautomated.io/courses/take/the-rei-playbook/lessons/48164730-subscribe-to-rei-automated-calendar-google-calendar-users" className="italic underline text-gray-50 hover:text-blue-50" target="_blank" rel="noopener noreferrer">
                            Subscribe To REI Automated Calendar (Google Calendar Users)
                        </Link>
                        <Link href="https://knowledge.reiautomated.io/courses/take/the-rei-playbook/lessons/48164727-subscribe-to-rei-automated-calendar-apple-mac-iphone-calendar" className="italic underline text-gray-50 hover:text-blue-50" target="_blank" rel="noopener noreferrer">
                            Subscribe to REI Automated Calendar (Apple Mac/iPhone Calendar)
                        </Link>
                        <div className="mt-3">
                            <iframe
                                src="https://calendar.google.com/calendar/embed?src=c_a0da7888d3a4e5b7ebf4d46b09f163550e0c1273e381ed0a92a4dc520937f283%40group.calendar.google.com&ctz=America/New_York&mode=WEEK"
                                style={{ border: "0" }}
                                width="100%"
                                height="300"
                                frameborder="0"
                            >
                            </iframe>
                        </div>
                    </div>
                </Accordion>

                <Accordion title={"REI Automated Private Facebook Group"} height={height} setHeight={setHeight}>
                    <div className="flex flex-col pb-4">
                        <p>
                            Share your KPIs. Share your wins.<br />
                            Ask for help. Give help. Build the community. <br />
                            Sometimes there are opportunities to collaborate with other members, buy and sell deals, and more.
                        </p>
                        <Link href="https://www.facebook.com/groups/reiautomated" className="italic underline text-gray-50 hover:text-blue-50" target="_blank" rel="noopener noreferrer">
                            REI Automated Private Facebook Group
                        </Link>
                    </div>
                </Accordion>

                <Accordion title={"Support Tickets"} height={height} setHeight={setHeight}>
                    <div className="flex flex-col pb-4">
                        <p>
                            When you need some technical support, you can email us at <Link href="mailto:support@reiautomated.io" className="italic underline text-gray-50 hover:text-blue-50">support@reiautomated.io</Link>.
                        </p>
                        <p>
                            You can also submit a ticket using the support widget at the bottom right of your screen in the app.
                        </p>
                        <p>
                            Please be sure to include your name, email, and a detailed description of the issue you are experiencing. <br />
                            Screenshots or a video are always helpful.
                        </p>
                    </div>
                </Accordion>

                { user && (user.isProfessional || user.isScaling || user.isAdmin) &&
                    (<><Accordion title={"Personal Coach"} height={height} setHeight={setHeight}>
                        <div className="flex flex-col pb-4">
                            <p>
                                Do you need more personalized help? <br />
                                You already have a personal coach and he/she should already be in contact with you. <br />
                                If not, please submit a support ticket and we will get you connected.
                            </p>
                        </div>
                    </Accordion>

                        <Accordion title={"1-on-1 or Team Phone Call or Video Call Support"} height={height} setHeight={setHeight}>
                            <div className="flex flex-col pb-4">
                                <p>
                                    The purpose of a 1-on-1 call is ONLY if:
                                </p>
                                <ol className="pl-5 space-y-2 list-decimal">
                                    <li>
                                        <p>What we're talking about is private/confidential/embarrassing.</p>
                                    </li>
                                    <li>
                                        <p>You are not able to come to an open forum Office Hours call due to your W2 job conflicting with the time.</p>
                                    </li>
                                    <li>
                                        <p>The problem is extremely urgent (must be resolved in the next 24 hrs) & extremely important ($10k+ will be lost, or $100k+ will be made).</p>
                                    </li>
                                    <li>
                                        <p>It is a personalized, tedious task that would be a waste of time for other REI Automated users to sit through on an open forum.</p>
                                    </li>
                                </ol>
                                <p>
                                    If you need a 1-on-1 call, please submit a support ticket and we will get you scheduled.
                                </p>
                            </div>
                        </Accordion>
                    </>)
                }


            </div>
        </main>
    );
}

export default withAuth(SupportPage);
