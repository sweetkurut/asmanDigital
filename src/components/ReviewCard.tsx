import { Quote } from "lucide-react";

interface ReviewProps {
    text: string;
    author: string;
    position: string;
}

export const ReviewCard: React.FC<ReviewProps> = ({ text, author, position }) => {
    return (
        <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 transition duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col">
            <Quote size={28} className="text-primary opacity-40 mb-4" />

            <p className="text-base leading-relaxed flex-grow mb-6">“{text}”</p>

            <div className="flex mb-4 text-primary">★★★★★</div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />

                <div>
                    <h4 className="font-medium">{author}</h4>
                    <p className="text-sm text-muted">{position}</p>
                </div>
            </div>
        </div>
    );
};
