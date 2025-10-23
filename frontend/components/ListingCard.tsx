import React, { useState } from 'react';
import { Listing } from '../../shared/types';
import Button from './Button';
import Spinner from './Spinner';

const API_URL = '/api';

interface ListingCardProps {
  listing: Listing;
  isSaved: boolean;
  onSaveToggle: (listingId: string) => void;
}

const BedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 4v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4"/><path d="M2 10h20"/><path d="M12 4v6"/></svg>
);
const BathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 12 4-10-2-2-4 10-2-2-4 10 10 4 2-2Z"/><path d="M12 12 22 2"/></svg>
);
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z"/></svg>
);


const ListingCard: React.FC<ListingCardProps> = ({ listing, isSaved, onSaveToggle }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const handleGetExplanation = async () => {
    setIsLoadingExplanation(true);
    setExplanation(null);
    // In a real app, user preferences would be dynamic.
    const mockPreferences = "2-bedroom apartment in Dublin 2 under €3000.";
    try {
        const response = await fetch(`${API_URL}/listings/${listing.id}/explain-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userPreferences: mockPreferences }),
        });
        if (!response.ok) {
            throw new Error('Failed to get explanation');
        }
        const data = await response.json();
        setExplanation(data.explanation);
    } catch (error) {
        console.error("Failed to fetch explanation:", error);
        setExplanation("Could not generate AI explanation at this time.");
    } finally {
        setIsLoadingExplanation(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <img src={listing.imageUrl} alt={listing.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col h-full">
        <div className="flex-grow">
            <p className="text-sm text-neutral-500">{listing.source}</p>
            <h3 className="text-lg font-bold text-neutral-800 truncate">{listing.title}</h3>
            <p className="text-neutral-600 truncate">{listing.address}</p>
            <p className="text-2xl font-bold text-primary my-2">€{listing.price.toLocaleString()}/month</p>
            <div className="flex items-center gap-4 text-neutral-700">
                <div className="flex items-center gap-1">
                    <BedIcon className="w-5 h-5" />
                    <span>{listing.bedrooms} beds</span>
                </div>
                <div className="flex items-center gap-1">
                    <BathIcon className="w-5 h-5" />
                    <span>{listing.bathrooms} baths</span>
                </div>
            </div>
             {explanation && (
                <div className="mt-3 p-3 bg-primary/10 rounded-md text-sm text-primary-800">
                   <p><strong className="font-semibold">AI Match Analysis:</strong> {explanation}</p>
                </div>
            )}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
           <Button onClick={() => onSaveToggle(listing.id)} variant={isSaved ? 'outline' : 'secondary'} className="flex-1">
              {isSaved ? 'Unsave' : 'Save'}
            </Button>
            <Button onClick={handleGetExplanation} variant="ghost" className="flex-1 flex items-center justify-center gap-2" disabled={isLoadingExplanation}>
              {isLoadingExplanation ? <Spinner size="sm" /> : <SparklesIcon className="w-4 h-4" />}
              Why this match?
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;