import { PartyPopper, X } from "lucide-react";
import Button from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface CongratulationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskTitle: string;
}

export const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
    isOpen,
    onClose,
    taskTitle
}) => {
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="pb-4">
                    <div className="flex justify-end">
                        <Button
                        variant="ghost"
                        size="icon" 
                        onClick={onClose} 
                        className="w-6 h-6">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <PartyPopper className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-green-700">
                        Parabéns!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-lg text-gray-700">
                        Você completou a tarefa:
                    </p>
                    <p className="text-xl font-semibold text-primary bg-primary/10 p-3 rounded-lg">
                        "{taskTitle}"
                    </p>
                    <p className="text-gray-600">
                        Continue assim! Cada tarefa concluída é um passo para seus objetivos.
                    </p>
                    <Button 
                    onClick={onClose}
                    className="w-full bg-green-600 hover:bg-green-700">
                        Continuar
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}