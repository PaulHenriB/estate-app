
import React, { useState, useEffect } from 'react';
import { DUBLIN_LISTINGS } from '../constants';
import ListingCard from '../components/ListingCard';
import { Listing } from '../types';

const MyListingsPage: React.FC = () => {
    const [savedListingIds, setSavedListingIds] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('saved_listings');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    const [savedListings, setSavedListings] = useState<Listing[]>([]);

    useEffect(() => {
        const listings = DUBLIN_LISTINGS.filter(listing => savedListingIds.has(listing.id));
        setSavedListings(listings);
    }, [savedListingIds]);
    
    const handleSaveToggle = (listingId: string) => {
        setSavedListingIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(listingId)) {
                newSet.delete(listingId);
            } else {
                newSet.add(listingId);
            }
            localStorage.setItem('saved_listings', JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Saved Listings</h1>
            {savedListings.length > 0 ? (
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
