import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface MintProps {
    uploadToPinata: (file: File, name: string, description: string, price: string) => Promise<string>;
    mintNFT: (uri: string, price: string) => void;
    isMinting: boolean;
}

interface FileWithPreview extends File {
    preview: string;
}

const Mint: React.FC<MintProps> = ({ uploadToPinata, mintNFT, isMinting }) => {
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'video/*': [] },
        onDrop: (acceptedFiles) => {
            const selectedFile = acceptedFiles[0];
            if (selectedFile.size > 2 * 1024 * 1024) {
                setError("File size exceeds 2 MB limit");
                setFile(null);
            } else {
                setError(null);
                const previewFile = Object.assign(selectedFile, {
                    preview: URL.createObjectURL(selectedFile),
                }) as FileWithPreview;
                setFile(previewFile);
            }
        },
    });

    const clearVideo = () => {
        setFile(null);
    };

    const handleMint = async () => {
        if (!file || !name || !description) {
            alert('Please complete all fields');
            return;
        }

        setIsLoading(true);

        try {
            const IpfsHash = await uploadToPinata(file, name, description, price);
            mintNFT(IpfsHash, price);
            clearVideo();
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white pt-10">
            <h2 className="text-3xl font-bold mb-6">Mint Your Video NFT</h2>
            <div 
                {...getRootProps({ 
                    className: `rounded-lg text-center cursor-pointer ${
                        file ? 'pb-3' : 'border-2 border-dashed border-purple-500 p-6 m-4 '
                    }`
                })}
            >
                <input {...getInputProps()} />
                {file ? (
                    <div>
                        <video controls className="max-w-full max-h-40 rounded-lg">
                            <source src={file.preview} type={file.type} />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ) : (
                    <p className="text-purple-500">Drag & drop a video file, or click to select one <br/><span className='text-sm text-red-600 font-bold'>Max size only 2 MB</span></p>
                )}
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {file && (
                <button
                    onClick={clearVideo}
                    className="bg-red-500 text-white rounded-lg px-4 py-2 mb-4"
                >
                    Clear
                </button>
            )}

            <div className="w-full max-w-md mb-4">
                <label className="block mb-2">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter NFT Name"
                    className="w-full p-2 rounded-lg border border-gray-300 text-black"
                />
            </div>

            <div className="w-full max-w-md mb-4">
                <label className="block mb-2">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter NFT Description"
                    className="w-full p-2 rounded-lg border border-gray-300 text-black"
                />
            </div>

            <div className="w-full max-w-md mb-4">
                <label className="block mb-2">Price (in XION):</label>
                <input
                    id="price"
                    value={price}
                    type="number"
                    required
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="0.00"
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 text-black"
                />
            </div>
            <button
                onClick={handleMint}
                disabled={isLoading || isMinting || !!error}
                className={`bg-purple-500 text-white rounded-lg px-4 py-2 ${isLoading || isMinting ? 'cursor-not-allowed' : 'hover:bg-purple-600'}`}
            >
                {isLoading || isMinting ? 'Minting...' : 'Mint NFT'}
            </button>
        </div>
    );
};

export default Mint;
