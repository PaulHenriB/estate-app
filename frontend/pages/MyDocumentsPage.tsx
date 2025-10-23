import React, { useState } from 'react';
import { Document } from '../../shared/types';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';

const API_URL = '/api';


const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);
const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
);


const MyDocumentsPage: React.FC = () => {
    const { user, token } = useAuth();
    // This component would now fetch documents from the backend
    const [documents, setDocuments] = useState<Document[]>([]);
    const [aiSummary, setAiSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDeckGenerated, setIsDeckGenerated] = useState(false);

    // In a real app, you'd fetch documents on load.
    // useEffect(() => { ... fetch user documents ... }, [token]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // This is a placeholder for actual backend upload logic.
            console.log("Uploading file:", file.name);
            alert("File upload is not implemented in this demo.");
        }
    };

    const handleGenerateSummary = async () => {
        if (!user || !token) return;
        setIsGenerating(true);
        try {
            const response = await fetch(`${API_URL}/users/me/generate-summary`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to generate summary.');
            const data = await response.json();
            setAiSummary(data.summary);
        } catch (error) {
            console.error(error);
            setAiSummary("Could not generate summary at this time.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleGenerateDeck = () => {
        setIsDeckGenerated(true);
        setTimeout(() => setIsDeckGenerated(false), 3000);
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">My Documents & Rental Deck</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Document Management */}
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <h2 className="text-xl font-semibold">Manage Your Documents</h2>
                     <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                            <UploadIcon className="w-6 h-6 text-gray-600"/>
                            <span className="font-medium text-gray-600">
                                Click to upload or drag and drop
                            </span>
                        </span>
                        <span className="mt-1 text-sm text-gray-500">PDF, JPG or PNG</span>
                        <input type="file" name="file_upload" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                    </label>

                    <ul className="space-y-2">
                       {documents.length > 0 ? documents.map(doc => (
                            <li key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                                <div className="flex items-center gap-3">
                                    <FileIcon className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-medium">{doc.name}</p>
                                        <p className="text-xs text-neutral-500">{doc.type} - Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="danger">Remove</Button>
                            </li>
                        )) : <p className="text-center text-sm text-neutral-500 py-4">No documents uploaded yet.</p>}
                    </ul>
                </div>

                {/* Rental Deck & AI Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                     <h2 className="text-xl font-semibold">Rental Deck Generator</h2>
                     <p className="text-sm text-neutral-600">Combine your documents and an AI summary into a professional application pack.</p>

                    <div className="p-4 bg-primary/5 rounded-md border border-primary/20">
                         <h3 className="font-semibold mb-2">AI-Generated Tenant Summary</h3>
                         {isGenerating && <div className="flex justify-center p-4"><Spinner /></div>}
                         {aiSummary && !isGenerating && <p className="text-neutral-700 italic">"{aiSummary}"</p>}
                         {!aiSummary && !isGenerating && <p className="text-sm text-neutral-500">Click below to generate a summary based on your profile and documents.</p>}
                         <Button onClick={handleGenerateSummary} disabled={isGenerating} className="mt-3 w-full" variant="outline">
                           {isGenerating ? 'Generating...' : '✨ Generate with AI'}
                         </Button>
                    </div>

                    <Button onClick={handleGenerateDeck} className="w-full" size="lg" disabled={!documents.length}>
                        {isDeckGenerated ? 'Generated Successfully!' : 'Generate Rental Deck (PDF)'}
                    </Button>
                    {isDeckGenerated && <p className="text-center text-sm text-green-600">Your rental deck would be downloading now.</p>}
                </div>
            </div>
        </div>
    );
};

export default MyDocumentsPage;