import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import axiosInstance from '../api/axios';

const TermsModal = ({ onClose, onAccept }) => {
    const [hasRead, setHasRead] = useState(false);
    const [loading, setLoading] = useState(false);
    const [terms, setTerms] = useState(null);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const { data } = await axiosInstance.get('/terms');
                setTerms(data);
            } catch (error) {
                console.error('Error fetching terms:', error);
            }
        };
        fetchTerms();
    }, []);

    const handleAccept = async () => {
        if (!hasRead) {
            alert('Please confirm that you have read the terms');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.post('/terms/accept');
            onAccept();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to accept terms');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <FileText className="text-primary-600" size={24} />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Terms and Conditions
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {terms ? (
                        <div className="prose dark:prose-invert max-w-none">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Version {terms.version} | Last Updated: {new Date(terms.lastUpdated).toLocaleDateString()}
                            </div>
                            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {terms.content}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <label className="flex items-center gap-3 mb-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={hasRead}
                            onChange={(e) => setHasRead(e.target.checked)}
                            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                            I have read and agree to the Terms and Conditions
                        </span>
                    </label>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={!hasRead || loading}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Accepting...' : 'I Accept'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
