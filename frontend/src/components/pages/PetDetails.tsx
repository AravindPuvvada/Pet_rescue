import React, { useEffect } from 'react';
import type { Pet } from '../../services/api';
import { X, MapPin, Heart, Feather, Droplet, User, Weight, Calendar, Stethoscope, Quote } from 'lucide-react';

// Helper function to generate a dynamic quote
const generatePetQuote = (pet: Pet): string => {
    const breed = (typeof pet.breed === 'string' ? pet.breed : '').toLowerCase();
    const type = (typeof pet.pet_type === 'string' ? pet.pet_type : '').toLowerCase();
    let quote = '';

    if (breed.includes('labrador') || breed.includes('retriever')) {
        quote = "Ready for a game of fetch and a lifetime of loyalty!";
    } else if (breed.includes('shepherd')) {
        quote = "A noble heart and a sharp mind, I'm ready to be your loyal protector.";
    } else if (breed.includes('siamese')) {
        quote = "I'm a talkative and clever companion looking for someone to share secrets with.";
    } else if (type.includes('dog')) {
        quote = "Every day is an adventure waiting to happen. Let's explore together!";
    } else if (type.includes('cat')) {
        quote = "Looking for a cozy spot and a warm heart to purr for.";
    } else {
        quote = "A loving heart waiting for a forever home.";
    }

    if (pet.is_diseased) {
        quote += " I might have a few extra needs, but my love is unconditional and stronger than ever.";
    } else if (pet.is_vaccinated) {
        quote += " I'm vaccinated, healthy, and ready for all the cuddles we can find!";
    }

    return quote;
};

interface PetDetailsModalProps {
    pet: Pet;
    onClose: () => void;
    onPrimaryAction: (pet: Pet) => void;
    primaryButtonLabel: string;
}

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({ pet, onClose, onPrimaryAction, primaryButtonLabel }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const petQuote = generatePetQuote(pet);
    const medical = pet.medical_history || {};
    const locationText = [pet.city, pet.state, pet.pincode].filter(Boolean).join(', ');
    const displayLocation = locationText.trim() || 'Location Not Available';
    const displayDescription = pet.description || 'No Information Available';

    const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: React.ReactNode }> = ({ icon, label, value }) => (
        <div className="flex items-start py-1 text-light-text dark:text-dark-secondary">
            <span className="mr-3 text-light-accent dark:text-dark-accent flex-shrink-0">{icon}</span>
            <span className="font-semibold w-1/4 text-sm">{label}:</span>
            <span className="text-sm font-medium">{value != null ? String(value) : 'N/A'}</span>
        </div>
    );

    const QuoteDisplay: React.FC<{ text: string }> = ({ text }) => (
        <div className="mt-6 p-4 border-l-4 border-light-accent dark:border-dark-accent bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent italic rounded-r-lg">
            <Quote className="w-5 h-5 text-light-accent/50 dark:text-dark-accent/50 mb-2" />
            <p>"{text}"</p>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm theme-transition" onClick={onClose}>
            <div
                className="bg-light-neutral dark:bg-dark-primary rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all border border-light-secondary/20 dark:border-dark-secondary/20"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-light-neutral/80 dark:bg-dark-primary/80 text-light-text dark:text-dark-secondary hover:opacity-80 transition z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col lg:flex-row">
                    {/* Left Column */}
                    <div className="lg:w-1/3 bg-light-primary dark:bg-dark-background p-6 flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full bg-light-secondary dark:bg-dark-secondary flex items-center justify-center overflow-hidden border-4 border-light-accent/50 dark:border-dark-accent/50 mb-4">
                            {pet.image ? (
                                <img src={pet.image} alt={`Photo of ${pet.name}`} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-light-text/50 dark:text-dark-neutral" />
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-light-text dark:text-dark-secondary mb-1">{pet.name ?? 'Unnamed Pet'}</h2>
                        <div className="w-full space-y-3 text-left">
                           <DetailItem icon={<Feather className="w-4 h-4" />} label="Type" value={String(pet.pet_type) || 'N/A'} />
                            <DetailItem icon={<Feather className="w-4 h-4" />} label="Breed" value={pet.breed || 'N/A'} />
                            <DetailItem icon={<Heart className="w-4 h-4" />} label="Gender" value={pet.gender ?? 'N/A'} />
                            <DetailItem icon={<Weight className="w-4 h-4" />} label="Age" value={pet.age != null ? `${pet.age} years` : 'N/A'} />
                            <DetailItem icon={<Droplet className="w-4 h-4" />} label="Color" value={pet.color ?? 'N/A'} />
                        </div>
                        <div className="w-full mt-6 pt-4 border-t border-light-secondary/20 dark:border-dark-secondary/20">
                            <h4 className="text-lg font-bold text-light-text dark:text-dark-secondary flex items-center mb-2"><MapPin className="w-5 h-5 mr-2 text-red-500" />Location</h4>
                            <p className="text-sm font-medium whitespace-pre-line text-light-text dark:text-dark-neutral">{displayLocation}</p>
                            <p className="text-sm text-light-text/70 dark:text-dark-neutral flex items-center mt-1">
                                <Calendar className="w-4 h-4 mr-2" /> Listed on: {pet.created_date ? new Date(pet.created_date).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:w-2/3 p-6 flex flex-col">
                        <h3 className="text-2xl font-bold text-light-text dark:text-dark-secondary mb-3">About {pet.name ?? 'Pet'}</h3>
                        <p className="text-light-text/80 dark:text-dark-neutral mb-6 whitespace-pre-line">{displayDescription}</p>

                        {!pet.is_vaccinated && !pet.is_diseased && <QuoteDisplay text={petQuote} />}

                        {(pet.is_vaccinated || pet.is_diseased) && (
                            <>
                                <h3 className="text-2xl font-bold text-light-text dark:text-dark-secondary flex items-center mb-3"><Stethoscope className="w-6 h-6 mr-2 text-green-600" />Medical Information</h3>
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <div><span className="font-semibold text-light-text dark:text-dark-secondary">Diseased: </span><span className={pet.is_diseased ? 'text-red-500 font-bold' : 'text-green-500'}>{pet.is_diseased ? 'Yes' : 'No'}</span></div>
                                    <div><span className="font-semibold text-light-text dark:text-dark-secondary">Vaccinated: </span><span className={pet.is_vaccinated ? 'text-green-500 font-bold' : 'text-red-500'}>{pet.is_vaccinated ? 'Yes' : 'No'}</span></div>
                                </div>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm mb-8 p-4 border rounded-lg bg-light-primary dark:bg-dark-background/50 border-light-secondary/30 dark:border-dark-secondary/30">
                                    {pet.is_diseased && (
                                        <>
                                            <div><span className="font-semibold text-light-text dark:text-dark-secondary">Disease: </span><span className="text-light-text/80 dark:text-dark-neutral">{medical.disease_name || 'N/A'}</span></div>
                                            <div><span className="font-semibold text-light-text dark:text-dark-secondary">Stage: </span><span className="text-light-text/80 dark:text-dark-neutral">{medical.stage || 'N/A'}</span></div>
                                            <div className="col-span-2"><span className="font-semibold text-light-text dark:text-dark-secondary">For: </span><span className="text-light-text/80 dark:text-dark-neutral">{medical.no_of_years ? `${medical.no_of_years} years` : 'N/A'}</span></div>
                                        </>
                                    )}
                                    {pet.is_vaccinated && (
                                        <>
                                            <div><span className="font-semibold text-light-text dark:text-dark-secondary">Vaccine: </span><span className="text-light-text/80 dark:text-dark-neutral">{medical.vaccination_name || 'N/A'}</span></div>
                                            <div><span className="font-semibold text-light-text dark:text-dark-secondary">Last Date: </span><span className="text-light-text/80 dark:text-dark-neutral">{medical.last_vaccinated_date ? new Date(medical.last_vaccinated_date).toLocaleDateString() : 'N/A'}</span></div>
                                        </>
                                    )}
                                </div>
                                <QuoteDisplay text={petQuote} />
                            </>
                        )}
                        
                        <div className="mt-auto pt-4 border-t border-light-secondary/20 dark:border-dark-secondary/20 flex justify-end items-center space-x-4">
                            <button onClick={() => onPrimaryAction(pet)} className="px-6 py-3 font-semibold text-light-accent dark:text-dark-accent border border-light-accent dark:border-dark-accent rounded-lg shadow-sm hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition-colors">{primaryButtonLabel}</button>
                            <button onClick={onClose} className="px-6 py-3 font-semibold text-white bg-light-accent dark:bg-dark-accent rounded-lg shadow-md hover:opacity-90 transition-opacity">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailsModal;