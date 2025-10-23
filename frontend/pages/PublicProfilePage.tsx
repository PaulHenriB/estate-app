import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';

const UserCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
);
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);


const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  // Mock data for the public profile
  const profileData = {
    name: username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Demo User',
    profession: 'Software Engineer',
    profilePicUrl: 'https://picsum.photos/seed/profile/200/200',
    aiSummary: "A responsible and reliable software engineer seeking a long-term rental in Dublin. Non-smoker with excellent references and a stable income, looking for a quiet and modern home.",
    isVerified: true
  };

  return (
    <div className="bg-neutral-100 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img 
            src={profileData.profilePicUrl} 
            alt={profileData.name} 
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-neutral-800">{profileData.name}</h1>
            <p className="text-xl text-primary font-medium mt-1">{profileData.profession}</p>
            {profileData.isVerified && (
              <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                <UserCheckIcon className="w-4 h-4" />
                Dwelli Verified
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-700">About Me</h2>
          <div className="mt-2 p-4 bg-neutral-50 rounded-lg border">
            <p className="text-neutral-600 italic">
              "{profileData.aiSummary}"
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" className="inline-flex items-center gap-2">
            <DownloadIcon className="w-5 h-5" />
            Download Rental Deck
          </Button>
           <p className="text-xs text-neutral-400 mt-2">(Download is disabled for this demo)</p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;