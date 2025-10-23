import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const MyProfilePage: React.FC = () => {
    const { user } = useAuth();
    const profileLink = user ? `${window.location.origin}/#/t/${user.username.toLowerCase()}` : '';

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                    <form className="space-y-4">
                        <Input label="Username" id="username" defaultValue={user?.username} />
                        <Input label="Email Address" id="email" type="email" defaultValue={user?.email} disabled />
                        <Input label="Profession" id="profession" placeholder="e.g., Marketing Professional" defaultValue={user?.profession} />
                        <div className="pt-2">
                             <Button>Save Changes</Button>
                        </div>
                    </form>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Tenant Profile Link</h2>
                        <p className="text-sm text-neutral-600 mb-4">Share this public link with landlords and agents.</p>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={profileLink}
                                className="w-full bg-neutral-100 border border-neutral-300 rounded-md p-2 pr-20 text-sm"
                            />
                            <Button
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2"
                                onClick={() => navigator.clipboard.writeText(profileLink)}
                            >
                                Copy
                            </Button>
                        </div>
                        <Link to={`/t/${user?.username.toLowerCase()}`} target="_blank" rel="noopener noreferrer">
                             <Button variant="outline" className="w-full mt-3">Preview Profile</Button>
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-red-200">
                         <h2 className="text-xl font-semibold text-red-700 mb-2">Account Deletion</h2>
                         <p className="text-sm text-neutral-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                         <Button variant="danger" className="w-full">Delete My Account</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfilePage;