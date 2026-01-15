import { useState, useCallback } from 'react';

interface UseMessageActionsReturn {
    copied: boolean;
    handleCopy: () => void;
    handleDownloadMD: () => void;
    handleDownloadPDF: (element: HTMLElement | null) => Promise<void>;
}

export function useMessageActions(currentText: string): UseMessageActionsReturn {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(currentText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [currentText]);

    const handleDownloadMD = useCallback(() => {
        const blob = new Blob([currentText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-response.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [currentText]);

    const handleDownloadPDF = useCallback(async (element: HTMLElement | null) => {
        if (!element) return;

        try {
            const { toPng } = await import('html-to-image');
            const { jsPDF } = await import('jspdf');

            // Add a small delay to ensure rendering is complete
            await new Promise((resolve) => setTimeout(resolve, 100));

            const dataUrl = await toPng(element, {
                quality: 0.95,
                backgroundColor: '#ffffff',
                // Filter out interactive elements that obscure content
                filter: (node) => {
                    if (node.classList && node.classList.contains('print:hidden')) {
                        return false;
                    }
                    return true;
                }
            });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: 'letter'
            });

            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('chat-response.pdf');

        } catch (e) {
            console.error('PDF generation failed', e);
        }
    }, []);

    return {
        copied,
        handleCopy,
        handleDownloadMD,
        handleDownloadPDF
    };
}
