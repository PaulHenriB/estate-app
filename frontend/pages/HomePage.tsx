import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Listing } from '../shared/types';
import ListingCard from '../components/ListingCard';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';

// FIX: Use a relative path for the API URL to work in proxied environments.
const API_URL = '/api';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);


const HomePage: React.FC = () => {
    const { isAuthenticated, token } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [propertyType, setPropertyType] = useState<'APARTMENT' | 'HOUSE' | 'STUDIO' | 'Any'>('Any');
    const [maxPrice, setMaxPrice] = useState(6000);
    const [minBedrooms, setMinBedrooms] = useState(0);

    const [savedListings, setSavedListings] = useState<Set<string>>(new Set());

    const fetchListings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams({
            searchTerm,
            propertyType,
            maxPrice: maxPrice.toString(),
            minBedrooms: minBedrooms.toString(),
        });

        try {
            const response = await fetch(`${API_URL}/listings?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Network response was not ok. Failed to fetch listings.');
            }
            const data = await response.json();
            setListings(data);
        } catch (error: any) {
            console.error("Failed to fetch listings", error);
            setError(error.message || "An unexpected error occurred while fetching listings.");
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, propertyType, maxPrice, minBedrooms]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    useEffect(() => {
        const fetchSavedListings = async () => {
            if (isAuthenticated && token) {
                try {
                    const response = await fetch(`${API_URL}/users/me/saved-listings`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                     if (!response.ok) {
                        throw new Error('Failed to fetch saved listings.');
                    }
                    const data: Listing[] = await response.json();
                    setSavedListings(new Set(data.map(l => l.id)));
                } catch (error) {
                    console.error("Failed to fetch saved listings", error);
                }
            } else {
                setSavedListings(new Set());
            }
        }
        fetchSavedListings();
    }, [isAuthenticated, token]);

    const handleSaveToggle = async (listingId: string) => {
        if (!isAuthenticated || !token) {
            alert("Please log in to save listings.");
            return;
        }

        const response = await fetch(`${API_URL}/users/me/saved-listings/${listingId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            setSavedListings(prev => {
                const newSet = new Set(prev);
                if (newSet.has(listingId)) {
                    newSet.delete(listingId);
                } else {
                    newSet.add(listingId);
                }
                return newSet;
            });
        } else {
            alert("Failed to update saved listing.");
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-primary/10 py-16 sm:py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">Find Your Dublin Dream Home</h1>
                    <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                        Dwelli uses AI to simplify your property search, helping you find the perfect rental or purchase faster.
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white sticky top-16 z-40 shadow-sm py-4">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div className="relative">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Location or Keyword</label>
                            <input
                                type="text"
                                id="search"
                                placeholder="e.g., Dublin 2, Ranelagh"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full mt-1 pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                            <SearchIcon className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Property Type</label>
                            <select id="type" value={propertyType} onChange={e => setPropertyType(e.target.value as any)} className="w-full mt-1 p-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary">
                                <option value="Any">Any</option>
                                <option value='APARTMENT'>Apartment</option>
                                <option value='HOUSE'>House</option>
                                <option value='STUDIO'>Studio</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Max Price: €{maxPrice.toLocaleString()}</label>
                            <input type="range" id="price" min="500" max="6000" step="100" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full mt-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                        </div>
                        <div>
                            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Min Bedrooms</label>
                            <select id="bedrooms" value={minBedrooms} onChange={e => setMinBedrooms(Number(e.target.value))} className="w-full mt-1 p-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary">
                                <option value="0">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Listings Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">{!error && `${listings.length} Properties Found`}</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Spinner /> 
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xl text-red-700">Sorry, something went wrong.</p>
                        <p className="text-neutral-500 mt-2">{error}</p>
                        <p className="text-neutral-500 mt-1 text-sm">Please ensure the backend server is running and accessible.</p>
                    </div>
                ) : listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map(listing => (
                            <ListingCard 
                                key={listing.id} 
                                listing={listing} 
                                isSaved={savedListings.has(listing.id)}
                                onSaveToggle={handleSaveToggle}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-neutral-100 rounded-lg">
                        <p className="text-xl text-neutral-600">No properties match your current filters.</p>
                        <p className="text-neutral-500 mt-2">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;