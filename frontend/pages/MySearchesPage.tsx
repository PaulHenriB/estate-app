import React from 'react';
import Button from '../components/Button';
// FIX: Update import path from types.ts to shared/types.ts
import { PropertyType, SearchPreference } from '../../shared/types';

const mockSearches: SearchPreference[] = [
    { id: '1', name: 'City Centre 2-Bed', location: 'Dublin 2', minPrice: 2000, maxPrice: 2800, type: PropertyType.APARTMENT, minBedrooms: 2 },
    { id: '2', name: 'South Dublin House', location: 'Dún Laoghaire', minPrice: 3000, maxPrice: 4500, type: PropertyType.HOUSE, minBedrooms: 3 },
];

const MySearchesPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Searches</h1>
                <Button>Create New Search</Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {mockSearches.length > 0 ? (
                    <ul className="space-y-4">
                        {mockSearches.map(search => (
                            <li key={search.id} className="p-4 border rounded-md flex items-center justify-between hover:bg-neutral-50">
                                <div>
                                    <h3 className="font-semibold text-lg text-primary">{search.name}</h3>
                                    <p className="text-neutral-600">
                                        {search.location} | €{search.minPrice}-{search.maxPrice} | {search.minBedrooms}+ beds | {search.type}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">Edit</Button>
                                    <Button size="sm" variant="danger">Delete</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-neutral-600">You haven't saved any searches yet.</p>
                        <p className="text-neutral-500 text-sm">Create a search to get instant alerts for new listings.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MySearchesPage;