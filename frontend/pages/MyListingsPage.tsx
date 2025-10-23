import React, { useState, useEffect } from 'react';
import ListingCard from '../components/ListingCard';
import { Listing } from '../../shared/types';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';

const API_URL = '/api';

const MyListingsPage: React.FC = () => {
    const { token } = useAuth();
    const [savedListings, setSavedListings] = useState<Listing[]>([]);
    const [savedListingIds, setSavedListingIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSavedListings = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/users/me/saved-listings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok. Failed to fetch saved listings.');
                }
                const data: Listing[] = await response.json();
                setSavedListings(data);
                setSavedListingIds(new Set(data.map(l => l.id)));
            } catch (error: any) {
                console.error("Failed to fetch saved listings", error);
                setError(error.message || 'An unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSavedListings();
    }, [token]);
    
    const handleSaveToggle = async (listingId: string) => {
        if (!token) return;

        const response = await fetch(`${API_URL}/users/me/saved-listings/${listingId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            // Refetch listings to get the updated list
            setSavedListings(prev => prev.filter(listing => listing.id !== listingId));
            setSavedListingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(listingId);
                return newSet;
            })

        } else {
            alert("Failed to update saved listing.");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Saved Listings</h1>
            {isLoading ? (
                 <div className="flex justify-center items-center py-12">
                    <Spinner /> 
                </div>
            ) : error ? (
                 <div className="text-center py-12 bg-red-50 rounded-lg shadow-md border border-red-200">
                    <p className="text-xl text-red-700">Could not load your listings.</p>
                    <p className="text-neutral-500 mt-2">{error}</p>
                </div>
            ) : savedListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {savedListings.map(listing => (
                        <ListingCard 
                            key={listing.id} 
                            listing={listing}
                            isSaved={savedListingIds.has(listing.id)}
                            onSaveToggle={handleSaveToggle}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-neutral-600">You haven't saved any listings yet.</p>
                    <p className="text-neutral-500 mt-2">Browse listings on the homepage and save your favorites.</p>
                </div>
            )}
        </div>
    );
};

export default MyListingsPage;