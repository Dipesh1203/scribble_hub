"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Video, Clock, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUserRooms } from '../actions/getUserRooms';
import { Session } from '../api/auth/[...nextauth]/options';

const ITEMS_PER_PAGE = 10;

export default function Rooms() {
    const { data, status } = useSession();
    const session = data as Session;
    const router = useRouter();
    const token = session?.token;

    const [userRooms, setUserRooms] = useState<Array<{ id: number, slug: string, createdAt: string }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!token) {
            router.push("/signin");
            return;
        }

        const fetchRooms = async () => {
            setIsLoading(true);
            try {
                const rooms = await getUserRooms(token);
                setUserRooms(rooms);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, [token]);

    const totalPages = Math.ceil(userRooms.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedRooms = userRooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">All Rooms</h1>

                    {isLoading ? (
                        <div className="text-center py-8 text-gray-600">Loading rooms...</div>
                    ) : userRooms.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">No rooms found</div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {paginatedRooms.map((room) => {
                                    const createdDate = new Date(room.createdAt);
                                    const daysAgo = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24));

                                    return (
                                        <div
                                            key={room.id}
                                            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mr-4">
                                                    <Video className="w-5 h-5 text-sky-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Room {room.id}</p>
                                                    <p className="text-sm text-gray-600">
                                                        <Clock className="w-3 h-3 inline mr-1" />
                                                        {daysAgo === 0
                                                            ? 'Today'
                                                            : daysAgo === 1
                                                                ? 'Yesterday'
                                                                : `${daysAgo} days ago`}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/main-canvas/${room.id}`)}
                                                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                                            >
                                                Join Room
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center space-x-4 mt-8">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}